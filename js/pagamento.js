document.addEventListener("DOMContentLoaded", function () {
  const pagamentoArea = document.querySelector("#payment-content");
  const resumoArea = document.querySelector("#payment-summary");
  const pedidoSalvo = localStorage.getItem("raizesPedido");

  if (!pedidoSalvo) {
    pagamentoArea.appendChild(document.querySelector("#payment-empty-template").content.cloneNode(true));
    return;
  }

  const pedido = JSON.parse(pedidoSalvo);
  if (!pedido || typeof pedido !== "object") {
    pagamentoArea.appendChild(document.querySelector("#payment-empty-template").content.cloneNode(true));
    return;
  }

  const unidade = obterUnidadePorId(pedido.unidadeId);
  if (!unidade) {
    pagamentoArea.appendChild(document.querySelector("#payment-empty-template").content.cloneNode(true));
    return;
  }

  pedido.itens = Array.isArray(pedido.itens) ? pedido.itens : [];
  pedido.total = obterTotalPedido(pedido);
  const resumo = document.querySelector("#payment-summary-template").content.cloneNode(true);
  const totalResumo = resumo.querySelector("[data-payment-total]");
  resumo.querySelector("[data-payment-order]").textContent = pedido.numero;
  resumo.querySelector("[data-payment-unit]").textContent = unidade.nome;
  resumoArea.appendChild(resumo);

  function atualizarResumo() {
    totalResumo.textContent = formatarPreco(pedido.total);
  }

  atualizarResumo();

  function obterUsuarioDaConsulta() {
    const usuario = obterUsuario();
    if (usuario) {
      return usuario;
    }

    return {
      pontos: obterPontosFidelidade(pedido.cpfMascarado)
    };
  }

  function consultarBeneficiosPagamento() {
    const campoCpf = document.querySelector("#payment-cpf");
    const campoUsarPontos = document.querySelector("#payment-use-loyalty");
    const mensagem = document.querySelector("#payment-cpf-message");
    const cpf = normalizarCpf(campoCpf.value);

    if (cpf.length !== 11) {
      mostrarMensagem(mensagem, "Informe os 11 números do CPF para consultar seus pontos.", "erro");
      campoCpf.focus();
      return;
    }

    if (!campoUsarPontos.checked) {
      mostrarMensagem(mensagem, "Marque a opção para usar seus pontos neste pedido.", "erro");
      return;
    }

    pedido.cpfInformado = true;
    pedido.cpfMascarado = mascararCpf(cpf);
    pedido.participaFidelidade = true;

    const usuario = obterUsuarioDaConsulta();
    const beneficio = obterBeneficioDisponivelPorPontos(usuario.pontos);
    const beneficioSelecionado = obterBeneficioAplicado();
    const subtotal = calcularSubtotal(pedido.itens);

    if (!pedido.desconto && beneficio) {
      pedido.desconto = Math.min(beneficio.desconto, subtotal);
      pedido.total = Number((subtotal - pedido.desconto).toFixed(2));
      pedido.beneficioNome = beneficio.nome;
      pedido.pontosUtilizados = beneficio.pontosNecessarios;
      atualizarResumo();
      mostrarMensagem(
        mensagem,
        "CPF identificado. " + beneficio.nome + " foi aplicado ao pedido.",
        "sucesso"
      );
    } else {
      if (!pedido.pontosUtilizados && beneficioSelecionado) {
        pedido.pontosUtilizados = beneficioSelecionado.pontosNecessarios;
      }
      mostrarMensagem(mensagem, "CPF identificado. Seus pontos serão considerados neste pedido.", "sucesso");
    }

    const status = document.querySelector("[data-payment-cpf-status]");
    status.hidden = false;
    status.textContent = "CPF identificado: " + pedido.cpfMascarado;
    campoCpf.readOnly = true;
    campoUsarPontos.disabled = true;
    document.querySelector("#payment-identify").disabled = true;
    localStorage.setItem("raizesPedido", JSON.stringify(pedido));
  }

  function mostrarInicio() {
    pagamentoArea.replaceChildren(document.querySelector("#payment-start-template").content.cloneNode(true));
    const campoCpf = document.querySelector("#payment-cpf");
    const campoUsarPontos = document.querySelector("#payment-use-loyalty");
    const statusCpf = document.querySelector("[data-payment-cpf-status]");

    campoCpf.addEventListener("input", function () {
      campoCpf.value = formatarCpf(campoCpf.value);
    });
    document.querySelector("#payment-identify").addEventListener("click", consultarBeneficiosPagamento);

    if (pedido.cpfInformado && pedido.cpfMascarado) {
      statusCpf.hidden = false;
      statusCpf.textContent = "CPF identificado: " + pedido.cpfMascarado;
      campoUsarPontos.checked = Boolean(pedido.pontosUtilizados);
      if (pedido.pontosUtilizados) {
        campoCpf.readOnly = true;
        campoUsarPontos.disabled = true;
        document.querySelector("#payment-identify").disabled = true;
      }
    }

    document.querySelector("#send-payment").addEventListener("click", processarPagamento);
  }

  function processarPagamento() {
    const botao = document.querySelector("#send-payment");
    botao.disabled = true;
    botao.textContent = "Processando...";
    mostrarMensagem(document.querySelector("#payment-message"), "Aguardando retorno do serviço externo.", "sucesso");

    setTimeout(function () {
      pagamentoArea.replaceChildren(document.querySelector("#payment-choice-template").content.cloneNode(true));
      document.querySelector("#approve-payment").addEventListener("click", aprovarPagamento);
      document.querySelector("#fail-payment").addEventListener("click", recusarPagamento);
      document.querySelector("#communication-failure").addEventListener("click", falharComunicacao);
    }, 700);
  }

  function aprovarPagamento() {
    pedido.pagamentoStatus = "Aprovado";
    pedido.status = "Pedido confirmado";
    const usuario = obterUsuario();
    const pontosGanhos = pedido.participaFidelidade ? Math.max(1, Math.floor(pedido.total)) : 0;
    const pontosUtilizados = Number(pedido.pontosUtilizados || 0);

    if (usuario && (pontosGanhos || pontosUtilizados)) {
      usuario.pontos = Math.max(0, usuario.pontos - pontosUtilizados) + pontosGanhos;
      salvarUsuario(usuario);
    }

    if (!usuario && pedido.participaFidelidade && pedido.cpfMascarado) {
      const pontosAtuais = obterPontosFidelidade(pedido.cpfMascarado);
      const saldoAtualizado = Math.max(0, pontosAtuais - pontosUtilizados) + pontosGanhos;
      salvarPontosFidelidade(pedido.cpfMascarado, saldoAtualizado);
    }

    pedido.pontosGanhos = pontosGanhos;
    localStorage.setItem("raizesPedido", JSON.stringify(pedido));
    localStorage.removeItem("raizesCarrinho");
    localStorage.removeItem(chaveBeneficio);
    const resultado = document.querySelector("#payment-success-template").content.cloneNode(true);
    resultado.querySelector("[data-payment-success-order]").textContent = pedido.numero;
    if (pontosGanhos) {
      const mensagemPontos = resultado.querySelector("[data-payment-points]");
      mensagemPontos.hidden = false;
      mensagemPontos.textContent = "Você ganhou " + pontosGanhos + " pontos nesta compra.";
    }
    pagamentoArea.replaceChildren(resultado);
  }

  function recusarPagamento() {
    mostrarFalhaPagamento("Pagamento não aprovado", "O serviço externo não confirmou o pagamento. O pedido ainda não foi enviado para a cozinha.");
    pedido.pagamentoStatus = "Não aprovado";
    pedido.status = "Pagamento não aprovado";
    localStorage.setItem("raizesPedido", JSON.stringify(pedido));
  }

  function falharComunicacao() {
    mostrarFalhaPagamento("Não foi possível receber o retorno", "O serviço externo não respondeu. O carrinho continua disponível para uma nova tentativa.");
    pedido.pagamentoStatus = "Falha de comunicação";
    pedido.status = "Pagamento pendente";
    localStorage.setItem("raizesPedido", JSON.stringify(pedido));
  }

  function mostrarFalhaPagamento(titulo, descricao) {
    const resultado = document.querySelector("#payment-error-template").content.cloneNode(true);
    resultado.querySelector("[data-payment-error-title]").textContent = titulo;
    resultado.querySelector("[data-payment-error-description]").textContent = descricao;
    pagamentoArea.replaceChildren(resultado);
    document.querySelector("#try-again").addEventListener("click", function () {
      pedido.status = "Aguardando pagamento";
      localStorage.setItem("raizesPedido", JSON.stringify(pedido));
      mostrarInicio();
    });
  }

  mostrarInicio();
});

function obterTotalPedido(pedido) {
  const totalInformado = Number(pedido.total);
  if (pedido.total !== null && pedido.total !== "" && Number.isFinite(totalInformado)) {
    return totalInformado;
  }

  const itensValidos = pedido.itens.filter(function (item) {
    return item && obterProdutoPorId(item.produtoId) && item.unidadeId;
  });

  return itensValidos.length ? calcularTotal(itensValidos) : 0;
}
