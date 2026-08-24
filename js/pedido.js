document.addEventListener("DOMContentLoaded", function () {
  const pedidoSalvo = localStorage.getItem("raizesPedido");
  const conteudo = document.querySelector("#order-content");
  const resumo = document.querySelector("#order-summary");
  const cabecalho = document.querySelector("#order-heading");

  if (!pedidoSalvo) {
    cabecalho.textContent = "Nenhum pedido encontrado";
    conteudo.replaceChildren(document.querySelector("#order-empty-template").content.cloneNode(true));
    resumo.replaceChildren();
    return;
  }

  const pedido = JSON.parse(pedidoSalvo);
  const unidade = obterUnidadePorId(pedido.unidadeId);
  const etapas = ["Pedido confirmado", "Em preparação", "Pronto para retirada", "Retirado"];

  function renderizarPedido() {
    const etapaAtual = etapas.indexOf(pedido.status);
    const pagamentoFalhou = pedido.pagamentoStatus === "Não aprovado" || pedido.pagamentoStatus === "Falha de comunicação";
    cabecalho.textContent = pedido.numero + " · " + unidade.nome;
    resumo.replaceChildren();

    if (pagamentoFalhou) {
      conteudo.replaceChildren(document.querySelector("#order-payment-error-template").content.cloneNode(true));
    } else {
      const status = document.querySelector("#order-status-template").content.cloneNode(true);
      status.querySelector("[data-order-status]").textContent = pedido.status;
      const progresso = status.querySelector("[data-order-progress]");
      etapas.forEach(function (etapa, index) {
        const passo = document.querySelector("#order-progress-step-template").content.cloneNode(true);
        const classe = index < etapaAtual ? "progress-step-complete" : index === etapaAtual ? "progress-step-active" : "";
        if (classe) {
          passo.querySelector(".progress-step").classList.add(classe);
        }
        passo.querySelector("[data-progress-number]").textContent = index + 1;
        passo.querySelector("[data-progress-label]").textContent = etapa;
        progresso.appendChild(passo);
      });
      if (etapaAtual < etapas.length - 1) {
        status.querySelector("#advance-order").addEventListener("click", function () {
          pedido.status = etapas[etapaAtual + 1];
          localStorage.setItem("raizesPedido", JSON.stringify(pedido));
          renderizarPedido();
        });
      } else {
        status.querySelector("#advance-order").hidden = true;
        status.querySelector("[data-order-finished]").hidden = false;
      }
      conteudo.replaceChildren(status);
    }

    const resumoPedido = document.querySelector("#order-summary-template").content.cloneNode(true);
    resumoPedido.querySelector("[data-summary-order]").textContent = pedido.numero;
    resumoPedido.querySelector("[data-summary-pickup]").textContent = pedido.retirada;
    resumoPedido.querySelector("[data-summary-total]").textContent = formatarPreco(pedido.total);
    resumo.appendChild(resumoPedido);
  }

  renderizarPedido();
});
