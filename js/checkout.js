document.addEventListener("DOMContentLoaded", function () {
  const unidadeId = obterUnidadeSelecionadaId();
  const unidade = obterUnidadePorId(unidadeId);
  const carrinho = obterCarrinho().filter(function (item) {
    return item.unidadeId === unidadeId;
  });
  const conteudo = document.querySelector("#checkout-content");
  const resumo = document.querySelector("#checkout-summary");

  if (!unidade || !carrinho.length) {
    conteudo.appendChild(document.querySelector("#checkout-empty-template").content.cloneNode(true));
    return;
  }

  const subtotal = calcularSubtotal(carrinho);
  const desconto = calcularDesconto(carrinho);
  const total = calcularTotal(carrinho);
  const produtoIndisponivel = carrinho.some(function (item) {
    return !produtoDisponivel(obterProdutoPorId(item.produtoId), unidadeId);
  });
  const conteudoFragmento = document.querySelector("#checkout-content-template").content.cloneNode(true);
  const mensagem = conteudoFragmento.querySelector("#checkout-message");

  conteudoFragmento.querySelector("[data-checkout-unit]").textContent = unidade.nome;
  conteudoFragmento.querySelector("[data-checkout-address]").textContent = unidade.endereco + " · " + unidade.horario;
  if (produtoIndisponivel) {
    mensagem.textContent = "Um item ficou indisponível nesta unidade. Volte ao carrinho para ajustar o pedido.";
    mensagem.classList.add("form-message-erro");
  }
  conteudo.appendChild(conteudoFragmento);

  const campoCpf = document.querySelector("#checkout-cpf");
  const campoCpfNota = document.querySelector("#checkout-cpf-invoice");
  const campoFidelidade = document.querySelector("#checkout-loyalty");
  const mensagemIdentificacao = document.querySelector("#checkout-identification-message");
  campoCpf.addEventListener("input", function () {
    campoCpf.value = formatarCpf(campoCpf.value);
  });

  const resumoFragmento = document.querySelector("#checkout-summary-template").content.cloneNode(true);
  const itensResumo = resumoFragmento.querySelector("[data-checkout-items]");
  carrinho.forEach(function (item) {
    const produto = obterProdutoPorId(item.produtoId);
    const itemFragmento = document.querySelector("#checkout-item-template").content.cloneNode(true);
    itemFragmento.querySelector("[data-checkout-item-name]").textContent = item.quantidade + "x " + produto.nome;
    itemFragmento.querySelector("[data-checkout-item-total]").textContent = formatarPreco(obterPrecoProduto(produto, unidadeId) * item.quantidade);
    itensResumo.appendChild(itemFragmento);
  });
  resumoFragmento.querySelector("[data-checkout-discount]").textContent = "- " + formatarPreco(desconto);
  resumoFragmento.querySelector("[data-checkout-total]").textContent = formatarPreco(total);
  resumo.appendChild(resumoFragmento);

  const botaoConfirmar = document.querySelector("#confirm-order");
  botaoConfirmar.disabled = produtoIndisponivel;
  botaoConfirmar.addEventListener("click", function () {
    const cpf = normalizarCpf(campoCpf.value);
    const usarCpfNota = campoCpfNota.checked;
    const participaFidelidade = campoFidelidade.checked;

    if (cpf && cpf.length !== 11) {
      mostrarMensagem(mensagemIdentificacao, "Informe os 11 números do CPF ou deixe o campo vazio.", "erro");
      campoCpf.focus();
      return;
    }

    if (cpf && !usarCpfNota && !participaFidelidade) {
      mostrarMensagem(mensagemIdentificacao, "Escolha CPF na nota ou fidelidade para continuar com este CPF.", "erro");
      return;
    }

    if (!cpf && (usarCpfNota || participaFidelidade)) {
      mostrarMensagem(mensagemIdentificacao, "Informe o CPF para usar uma das opções de identificação.", "erro");
      campoCpf.focus();
      return;
    }

    const beneficioAplicado = obterBeneficioAplicado();

    const pedido = {
      numero: "RN-" + String(Date.now()).slice(-6),
      unidadeId: unidadeId,
      itens: carrinho,
      desconto: desconto,
      total: total,
      retirada: "Retirada rápida no balcão",
      status: "Aguardando pagamento",
      cpfInformado: Boolean(cpf),
      cpfMascarado: mascararCpf(cpf),
      usarCpfNota: usarCpfNota,
      participaFidelidade: participaFidelidade,
      pontosUtilizados: participaFidelidade && beneficioAplicado
        ? beneficioAplicado.pontosNecessarios
        : 0
    };

    localStorage.setItem("raizesPedido", JSON.stringify(pedido));
    window.location.href = "pagamento.html";
  });
});
