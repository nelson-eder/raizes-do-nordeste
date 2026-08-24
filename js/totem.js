document.addEventListener("DOMContentLoaded", function () {
  const areaTotem = document.querySelector("#totem-content");
  const chaveTotemUnidade = "raizesTotemUnidade";
  const senhaConfiguracaoTotem = "2026";
  const duracaoConfirmacao = 60;
  let temporizadorConfirmacao = null;
  const configuracaoSolicitada = window.location.search.includes("configuracao=1");
  const unidadeSalva = localStorage.getItem(chaveTotemUnidade);
  const unidadeConfigurada = obterUnidadePorId(unidadeSalva) ? unidadeSalva : "";
  const estado = {
    etapa: configuracaoSolicitada ? "configuracao" : unidadeConfigurada ? "inicio" : "bloqueado",
    unidadeId: unidadeConfigurada || "",
    carrinho: [],
    desconto: 0,
    beneficioAplicado: "",
    fidelidadeAtiva: false,
    cpfInformado: false,
    cpfMascarado: "",
    usarCpfNota: false,
    pontosUtilizados: 0,
    pontosGanhos: 0,
    numeroPedido: ""
  };

  const etapasTotem = [
    "cardapio",
    "carrinho",
    "identificacao",
    "pagamento",
    "confirmacao"
  ];

  function clonarTemplate(id) {
    return document.querySelector("#" + id).content.cloneNode(true);
  }

  function renderizar() {
    if (estado.etapa === "configuracao") {
      renderizarConfiguracao();
    } else if (estado.etapa === "bloqueado") {
      renderizarBloqueado();
    } else if (estado.etapa === "inicio") {
      renderizarInicio();
    } else if (estado.etapa === "cardapio") {
      renderizarCardapio();
    } else if (estado.etapa === "carrinho") {
      renderizarCarrinho();
    } else if (estado.etapa === "identificacao") {
      renderizarIdentificacao();
    } else if (estado.etapa === "pagamento") {
      renderizarPagamento();
    } else if (estado.etapa === "retorno-pagamento") {
      renderizarRetornoPagamento();
    } else if (estado.etapa === "falha-pagamento") {
      renderizarFalhaPagamento();
    } else if (estado.etapa === "confirmacao") {
      renderizarConfirmacao();
    }
    configurarNavegacao();
  }

  function obterEtapaVisual() {
    if (estado.etapa === "retorno-pagamento" || estado.etapa === "falha-pagamento") {
      return "pagamento";
    }
    return estado.etapa;
  }

  function cabecalhoNavegacao() {
    const etapaVisual = obterEtapaVisual();
    const indiceAtual = etapasTotem.findIndex(function (etapa) {
      return etapa === etapaVisual;
    });
    const navegacao = clonarTemplate("totem-progress-template");
    const progresso = navegacao.querySelector("[data-totem-progress]");
    const botaoVoltar = navegacao.querySelector("#totem-back");
    const botaoCancelar = navegacao.querySelector("#totem-cancel");
    const atendimentoConcluido = estado.etapa === "confirmacao";
    const textoVoltar = estado.etapa === "cardapio" ? "Voltar ao início" : "Voltar";

    progresso.querySelectorAll("[data-totem-progress-step]").forEach(function (item, index) {
      item.classList.remove("totem-progress-step-active", "totem-progress-step-done");
      if (index === indiceAtual) {
        item.classList.add("totem-progress-step-active");
        item.setAttribute("aria-current", "step");
      } else {
        item.removeAttribute("aria-current");
      }
      if (index < indiceAtual) {
        item.classList.add("totem-progress-step-done");
      }
    });

    if (atendimentoConcluido) {
      botaoVoltar.hidden = true;
      botaoCancelar.hidden = true;
      return navegacao;
    }

    botaoVoltar.setAttribute("aria-label", textoVoltar);
    botaoVoltar.title = textoVoltar;
    botaoVoltar.hidden = false;
    botaoCancelar.hidden = false;
    return navegacao;
  }

  function prepararEtapa(titulo, descricao, templateId) {
    const etapa = clonarTemplate(templateId || "totem-stage-template");
    const conteudo = etapa.querySelector("[data-totem-stage-content]") || etapa.querySelector("[data-totem-stage]");
    const cabecalho = clonarTemplate("totem-step-heading-template");
    cabecalho.querySelector("[data-totem-heading]").textContent = titulo;
    cabecalho.querySelector("[data-totem-description]").textContent = descricao;
    conteudo.prepend(cabecalho);
    conteudo.prepend(cabecalhoNavegacao());
    return etapa;
  }

  function prepararNavegacao(etapa) {
    const conteudo = etapa.querySelector("[data-totem-stage-content]") || etapa.querySelector("[data-totem-stage]");
    conteudo.prepend(cabecalhoNavegacao());
    return etapa;
  }

  function configurarNavegacao() {
    const botaoVoltar = document.querySelector("#totem-back");
    const botaoCancelar = document.querySelector("#totem-cancel");
    if (botaoVoltar) {
      botaoVoltar.addEventListener("click", voltarEtapa);
    }
    if (botaoCancelar) {
      botaoCancelar.addEventListener("click", finalizarSessao);
    }
  }

  function voltarEtapa() {
    if (estado.etapa === "cardapio") {
      limparDadosAtendimento();
      estado.etapa = "inicio";
      renderizar();
      return;
    }

    const etapasAnteriores = {
      carrinho: "cardapio",
      identificacao: "carrinho",
      pagamento: "identificacao",
      "retorno-pagamento": "pagamento",
      "falha-pagamento": "pagamento"
    };
    const etapaAnterior = etapasAnteriores[estado.etapa];
    if (etapaAnterior) {
      if (etapaAnterior === "identificacao") {
        estado.desconto = 0;
        estado.beneficioAplicado = "";
        estado.fidelidadeAtiva = false;
        estado.cpfInformado = false;
        estado.cpfMascarado = "";
        estado.usarCpfNota = false;
        estado.pontosUtilizados = 0;
        estado.pontosGanhos = 0;
      }
      estado.etapa = etapaAnterior;
      renderizar();
    }
  }

  function renderizarInicio() {
    const unidade = obterUnidadePorId(estado.unidadeId);
    if (!unidade) {
      estado.etapa = "bloqueado";
      renderizar();
      return;
    }
    const inicio = clonarTemplate("totem-welcome-template");
    inicio.querySelector("[data-totem-unit]").textContent = unidade.nome + " · " + unidade.endereco;
    areaTotem.replaceChildren(inicio);
    document.querySelector('[data-totem-action="start"]').addEventListener("click", function () {
      estado.etapa = "cardapio";
      renderizar();
    });
  }

  function renderizarBloqueado() {
    areaTotem.replaceChildren(clonarTemplate("totem-blocked-template"));
  }

  function renderizarConfiguracao() {
    const configuracao = clonarTemplate("totem-config-template");
    const seletor = configuracao.querySelector("#totem-config-unit");
    unidades.forEach(function (unidade) {
      const opcao = clonarTemplate("totem-unit-option-template");
      const elementoOpcao = opcao.querySelector("option");
      elementoOpcao.value = unidade.id;
      elementoOpcao.textContent = unidade.nome;
      elementoOpcao.selected = estado.unidadeId === unidade.id;
      seletor.appendChild(opcao);
    });
    areaTotem.replaceChildren(configuracao);
    document.querySelector('[data-totem-action="save-config"]').addEventListener("click", function () {
      const pin = document.querySelector("#totem-config-pin").value.trim();
      const unidadeId = document.querySelector("#totem-config-unit").value;
      if (pin !== senhaConfiguracaoTotem) {
        mostrarMensagem(document.querySelector("#totem-config-message"), "PIN inválido. Somente funcionários podem configurar o totem.", "erro");
        return;
      }
      if (!unidadeId) {
        mostrarMensagem(document.querySelector("#totem-config-message"), "Selecione uma unidade para continuar.", "erro");
        return;
      }
      limparDadosAtendimento();
      localStorage.setItem(chaveTotemUnidade, unidadeId);
      estado.unidadeId = unidadeId;
      window.location.href = "totem.html";
    });
  }

  function renderizarCardapio() {
    const produtosDisponiveis = produtos.filter(function (produto) {
      return produtoDisponivel(produto, estado.unidadeId);
    });
    const etapa = clonarTemplate("totem-menu-stage-template");
    const menu = clonarTemplate("totem-menu-content-template");
    const grade = menu.querySelector("[data-totem-menu-grid]");
    if (!produtosDisponiveis.length) {
      grade.appendChild(clonarTemplate("totem-empty-menu-template"));
    } else {
      produtosDisponiveis.forEach(function (produto) {
        grade.appendChild(criarCardTotem(produto));
      });
    }
    menu.querySelector("[data-totem-item-count]").textContent = obterTextoItensTotem();
    menu.querySelector("[data-totem-menu-total]").textContent = formatarPreco(calcularTotalTotem());
    const conteudo = etapa.querySelector("[data-totem-stage-content]");
    conteudo.prepend(cabecalhoNavegacao());
    conteudo.appendChild(menu);
    areaTotem.replaceChildren(etapa);
    configurarScrollTouch(document.querySelector("[data-totem-menu-grid]"));

    document.querySelectorAll('[data-totem-action="increase-product"], [data-totem-action="decrease-product"]').forEach(function (botao) {
      botao.addEventListener("click", function () {
        const produtoId = botao.dataset.totemProduct;
        if (botao.dataset.totemAction === "increase-product") {
          adicionarProdutoTotem(produtoId);
        } else {
          removerProdutoTotem(produtoId);
        }
        atualizarQuantidadeProdutoTotem(produtoId);
        atualizarContadorTotem();
      });
    });
    document.querySelector('[data-totem-action="open-cart"]').addEventListener("click", function () {
      estado.etapa = "carrinho";
      renderizar();
    });
  }

  function criarCardTotem(produto) {
    const card = clonarTemplate("totem-product-template");
    const preco = obterPrecoProduto(produto, estado.unidadeId);
    const tags = card.querySelector("[data-totem-tags]");
    const itemCarrinho = estado.carrinho.find(function (item) {
      return item.produtoId === produto.id;
    });
    card.querySelector("[data-totem-product-card]").dataset.totemProductCard = produto.id;
    card.querySelector("[data-totem-image]").src = produto.imagem;
    card.querySelector("[data-totem-image]").alt = produto.nome;
    card.querySelector("[data-totem-product-name]").textContent = produto.nome;
    card.querySelector("[data-totem-product-description]").textContent = produto.descricao;
    card.querySelector("[data-totem-product-price]").textContent = formatarPreco(preco);
    produto.tags.forEach(function (tag) {
      const tagElemento = clonarTemplate("totem-tag-template");
      tagElemento.querySelector("[data-totem-tag]").textContent = tag;
      tags.appendChild(tagElemento);
    });
    card.querySelector("[data-totem-product-quantity]").textContent = itemCarrinho ? itemCarrinho.quantidade : 0;
    card.querySelectorAll('[data-totem-action="increase-product"], [data-totem-action="decrease-product"]').forEach(function (botao) {
      botao.dataset.totemProduct = produto.id;
    });
    return card;
  }

  function adicionarProdutoTotem(produtoId) {
    const item = estado.carrinho.find(function (produto) {
      return produto.produtoId === produtoId;
    });
    if (item) {
      item.quantidade += 1;
      return;
    }
    estado.carrinho.push({ produtoId: produtoId, quantidade: 1 });
  }

  function obterQuantidadeItensTotem() {
    return estado.carrinho.reduce(function (total, item) {
      return total + item.quantidade;
    }, 0);
  }

  function obterTextoItensTotem() {
    const quantidade = obterQuantidadeItensTotem();
    return quantidade + " " + (quantidade === 1 ? "item" : "itens") + " no pedido";
  }

  function atualizarContadorTotem() {
    const contador = document.querySelector("[data-totem-item-count]");
    if (contador) {
      contador.textContent = obterTextoItensTotem();
    }
    const total = document.querySelector("[data-totem-menu-total]");
    if (total) {
      total.textContent = formatarPreco(calcularTotalTotem());
    }
  }

  function atualizarQuantidadeProdutoTotem(produtoId) {
    const card = document.querySelector('[data-totem-product-card="' + produtoId + '"]');
    const item = estado.carrinho.find(function (produto) {
      return produto.produtoId === produtoId;
    });
    if (card) {
      card.querySelector("[data-totem-product-quantity]").textContent = item ? item.quantidade : 0;
    }
  }

  function removerProdutoTotem(produtoId) {
    const item = estado.carrinho.find(function (produto) {
      return produto.produtoId === produtoId;
    });
    if (!item) {
      return;
    }
    item.quantidade -= 1;
    estado.carrinho = estado.carrinho.filter(function (produto) {
      return produto.quantidade > 0;
    });
  }

  function calcularSubtotalTotem() {
    return estado.carrinho.reduce(function (total, item) {
      const produto = obterProdutoPorId(item.produtoId);
      return total + obterPrecoProduto(produto, estado.unidadeId) * item.quantidade;
    }, 0);
  }

  function calcularTotalTotem() {
    return calcularSubtotalTotem() - estado.desconto;
  }

  function renderizarCarrinho() {
    if (!estado.carrinho.length) {
      const etapaVazia = prepararEtapa("Seu pedido está vazio", "Escolha pelo menos um item antes de continuar.", "totem-cart-empty-template");
      areaTotem.replaceChildren(etapaVazia);
      document.querySelector('[data-totem-action="back-to-menu"]').addEventListener("click", function () {
        estado.etapa = "cardapio";
        renderizar();
      });
      return;
    }

    const etapa = prepararEtapa("Confira seu pedido", "Você poderá identificar-se opcionalmente na próxima tela.");
    const conteudo = clonarTemplate("totem-cart-content-template");
    const itensArea = conteudo.querySelector("[data-totem-cart-items]");
    estado.carrinho.forEach(function (item) {
      const produto = obterProdutoPorId(item.produtoId);
      const preco = obterPrecoProduto(produto, estado.unidadeId);
      const itemMarkup = clonarTemplate("totem-cart-item-template");
      const imagem = itemMarkup.querySelector("[data-totem-cart-item-image]");
      imagem.src = produto.imagem;
      imagem.alt = produto.nome;
      itemMarkup.querySelector("[data-totem-cart-item-name]").textContent = produto.nome;
      itemMarkup.querySelector("[data-totem-cart-item-price]").textContent = formatarPreco(preco) + " cada";
      itemMarkup.querySelector("[data-totem-cart-item-quantity]").textContent = item.quantidade;
      itemMarkup.querySelector("[data-totem-cart-item-total]" ).textContent = formatarPreco(preco * item.quantidade);
      itemMarkup.querySelector(".totem-cart-item").dataset.totemCartProduct = produto.id;
      itemMarkup.querySelectorAll(
        '[data-totem-action="increase-cart-product"], ' +
        '[data-totem-action="decrease-cart-product"]'
      ).forEach(function (botao) {
        botao.dataset.totemProduct = produto.id;
      });
      itensArea.appendChild(itemMarkup);
    });
    conteudo.querySelector("[data-totem-total]").textContent = formatarPreco(calcularTotalTotem());
    etapa.querySelector("[data-totem-stage-content]").appendChild(conteudo);
    areaTotem.replaceChildren(etapa);
    configurarScrollTouch(document.querySelector("[data-totem-cart-items]"));

    document.querySelector('[data-totem-action="back-to-menu"]').addEventListener("click", function () {
      estado.etapa = "cardapio";
      renderizar();
    });
    document.querySelectorAll(
      '[data-totem-action="increase-cart-product"], ' +
      '[data-totem-action="decrease-cart-product"]'
    ).forEach(function (botao) {
      botao.addEventListener("click", function () {
        const produtoId = botao.dataset.totemProduct;
        if (botao.dataset.totemAction === "increase-cart-product") {
          adicionarProdutoTotem(produtoId);
        } else {
          removerProdutoTotem(produtoId);
        }
        renderizar();
      });
    });
    document.querySelector('[data-totem-action="continue-identification"]').addEventListener("click", function () {
      estado.etapa = "identificacao";
      renderizar();
    });
  }

  function renderizarIdentificacao() {
    const etapa = prepararEtapa("Informe seus dados", "Use o CPF para a nota ou para acumular pontos.");
    etapa.querySelector("[data-totem-stage-content]").appendChild(clonarTemplate("totem-identification-content-template"));
    areaTotem.replaceChildren(etapa);
    const campoCpf = document.querySelector("#totem-cpf");
    configurarTecladoCpf(campoCpf);
    document.querySelector('[data-totem-action="confirm-identification"]')
      .addEventListener("click", confirmarIdentificacaoTotem);
    document.querySelector('[data-totem-action="continue-without-cpf"]')
      .addEventListener("click", continuarSemCpf);
  }

  function obterBeneficioDisponivelTotem() {
    const usuario = obterUsuario();
    const pontos = usuario ? usuario.pontos : obterPontosFidelidade(estado.cpfMascarado);
    return obterBeneficioDisponivelPorPontos(pontos);
  }

  function configurarTecladoCpf(campoCpf) {
    campoCpf.addEventListener("input", function () {
      campoCpf.value = formatarCpf(campoCpf.value);
    });

    document.querySelectorAll("[data-totem-key]").forEach(function (botao) {
      botao.addEventListener("click", function () {
        const tecla = botao.dataset.totemKey;
        const cpfAtual = normalizarCpf(campoCpf.value);

        if (tecla === "backspace") {
          campoCpf.value = formatarCpf(cpfAtual.slice(0, -1));
        } else if (tecla === "clear") {
          campoCpf.value = "";
        } else {
          campoCpf.value = formatarCpf(cpfAtual + tecla);
        }

        campoCpf.focus();
      });
    });
  }

  function confirmarIdentificacaoTotem() {
    const campoCpf = document.querySelector("#totem-cpf");
    const campoCpfNota = document.querySelector("#totem-cpf-invoice");
    const campoFidelidade = document.querySelector("#totem-loyalty");
    const mensagem = document.querySelector("[data-totem-identification-message]");
    const cpf = normalizarCpf(campoCpf.value);
    const usarCpfNota = campoCpfNota.checked;
    const participaFidelidade = campoFidelidade.checked;

    if (cpf && cpf.length !== 11) {
      mostrarMensagem(mensagem, "Informe os 11 números do CPF ou deixe o campo vazio.", "erro");
      campoCpf.focus();
      return;
    }

    if (cpf && !usarCpfNota && !participaFidelidade) {
      mostrarMensagem(mensagem, "Escolha CPF na nota ou fidelidade para continuar com este CPF.", "erro");
      return;
    }

    if (!cpf && (usarCpfNota || participaFidelidade)) {
      mostrarMensagem(mensagem, "Informe o CPF para usar uma das opções de identificação.", "erro");
      campoCpf.focus();
      return;
    }

    estado.cpfInformado = Boolean(cpf);
    estado.cpfMascarado = mascararCpf(cpf);
    estado.usarCpfNota = usarCpfNota;
    estado.fidelidadeAtiva = participaFidelidade;
    estado.desconto = 0;
    estado.beneficioAplicado = "";
    estado.pontosUtilizados = 0;

    if (participaFidelidade) {
      const beneficio = obterBeneficioDisponivelTotem();
      if (beneficio) {
        estado.desconto = Math.min(beneficio.desconto, calcularSubtotalTotem());
        estado.beneficioAplicado = beneficio.nome;
        estado.pontosUtilizados = beneficio.pontosNecessarios;
      }
    }

    estado.etapa = "pagamento";
    renderizar();
  }

  function continuarSemCpf() {
    estado.desconto = 0;
    estado.beneficioAplicado = "";
    estado.fidelidadeAtiva = false;
    estado.cpfInformado = false;
    estado.cpfMascarado = "";
    estado.usarCpfNota = false;
    estado.pontosUtilizados = 0;
    estado.etapa = "pagamento";
    renderizar();
  }

  function renderizarPagamento() {
    const etapa = prepararEtapa("Pagamento", "A solicitação será enviada para um serviço externo.");
    const conteudo = clonarTemplate("totem-payment-content-template");
    conteudo.querySelector("[data-totem-total]").textContent = formatarPreco(calcularTotalTotem());
    const mensagemBeneficio = conteudo.querySelector("[data-totem-benefit-message]");
    if (estado.beneficioAplicado) {
      mensagemBeneficio.hidden = false;
      mensagemBeneficio.querySelector("[data-totem-benefit-value]").textContent = estado.beneficioAplicado;
    }
    if (estado.cpfInformado) {
      const mensagemCpf = conteudo.querySelector("[data-totem-cpf-message]");
      mensagemCpf.hidden = false;
      mensagemCpf.textContent = estado.fidelidadeAtiva
        ? "CPF identificado: " + estado.cpfMascarado + ". A compra acumulará pontos."
        : "CPF identificado para a nota: " + estado.cpfMascarado;
    }
    etapa.querySelector("[data-totem-stage-content]").appendChild(conteudo);
    areaTotem.replaceChildren(etapa);
    document.querySelector('[data-totem-action="send-payment"]').addEventListener("click", function () {
      estado.etapa = "retorno-pagamento";;
      renderizar();
    });
  }

  function renderizarRetornoPagamento() {
    const etapa = prepararEtapa("Aguardando retorno", "A confirmação será enviada pelo serviço de pagamento.");
    etapa.querySelector("[data-totem-stage-content]").appendChild(clonarTemplate("totem-payment-return-content-template"));
    areaTotem.replaceChildren(etapa);
    document.querySelector('[data-totem-action="approve-payment"]').addEventListener("click", function () {
      estado.numeroPedido = "TOTEM-" + String(Date.now()).slice(-5);
      estado.pontosGanhos = estado.fidelidadeAtiva && estado.cpfInformado
        ? Math.max(1, Math.floor(calcularTotalTotem()))
        : 0;
      const usuario = obterUsuario();
      const pontosUtilizados = estado.pontosUtilizados;
      if (usuario && (estado.pontosGanhos || pontosUtilizados)) {
        usuario.pontos = Math.max(0, usuario.pontos - pontosUtilizados) + estado.pontosGanhos;
        salvarUsuario(usuario);
      }
      if (estado.pontosGanhos && estado.cpfMascarado && !usuario) {
        const pontosAtuais = obterPontosFidelidade(estado.cpfMascarado);
        const saldoAtualizado = Math.max(0, pontosAtuais - pontosUtilizados) + estado.pontosGanhos;
        salvarPontosFidelidade(estado.cpfMascarado, saldoAtualizado);
      }
      estado.etapa = "confirmacao";
      renderizar();
    });
    document.querySelector('[data-totem-action="fail-payment"]').addEventListener("click", function () {
      estado.etapa = "falha-pagamento";
      renderizar();
    });
  }

  function renderizarFalhaPagamento() {
    const etapa = prepararNavegacao(clonarTemplate("totem-payment-failure-template"));
    areaTotem.replaceChildren(etapa);
    document.querySelector('[data-totem-action="retry-payment"]').addEventListener("click", function () {
      estado.etapa = "pagamento";
      renderizar();
    });
    document.querySelector('[data-totem-action="finish"]').addEventListener("click", finalizarSessao);
  }

  function limparTemporizadorConfirmacao() {
    if (temporizadorConfirmacao) {
      clearInterval(temporizadorConfirmacao);
      temporizadorConfirmacao = null;
    }
  }

  function iniciarTemporizadorConfirmacao() {
    limparTemporizadorConfirmacao();
    let segundosRestantes = duracaoConfirmacao;
    const mensagem = document.querySelector("[data-totem-timeout]");

    function atualizarMensagem() {
      if (mensagem) {
        const unidadeTempo = segundosRestantes === 1 ? "segundo" : "segundos";
        mensagem.textContent = "Esta tela será reiniciada em " + segundosRestantes + " " + unidadeTempo + ".";
      }
    }

    atualizarMensagem();
    temporizadorConfirmacao = setInterval(function () {
      segundosRestantes -= 1;
      if (segundosRestantes <= 0) {
        limparTemporizadorConfirmacao();
        finalizarSessao();
        return;
      }
      atualizarMensagem();
    }, 1000);
  }

  function renderizarConfirmacao() {
    const etapa = prepararNavegacao(clonarTemplate("totem-confirmation-template"));
    etapa.querySelector("[data-totem-order-number]").textContent = estado.numeroPedido;
    if (estado.pontosGanhos) {
      const mensagemPontos = etapa.querySelector("[data-totem-points-earned]");
      mensagemPontos.hidden = false;
      mensagemPontos.querySelector("[data-totem-points-value]").textContent = estado.pontosGanhos + " pontos";
    }
    areaTotem.replaceChildren(etapa);
    document.querySelector('[data-totem-action="finish"]').addEventListener("click", finalizarSessao);
    iniciarTemporizadorConfirmacao();
  }

  function limparDadosAtendimento() {
    sessionStorage.removeItem("raizesTotemState");
    localStorage.removeItem(chaveUnidade);
    localStorage.removeItem(chaveProduto);
    localStorage.removeItem(chaveCarrinho);
    localStorage.removeItem(chaveUsuario);
    localStorage.removeItem(chaveBeneficio);
    localStorage.removeItem(chaveConsentimentos);
    localStorage.removeItem("raizesPedido");
  }

  function finalizarSessao() {
    limparTemporizadorConfirmacao();
    limparDadosAtendimento();
    estado.etapa = "inicio";
    estado.unidadeId = localStorage.getItem(chaveTotemUnidade) || "";
    if (!estado.unidadeId) {
      estado.etapa = "bloqueado";
    }
    estado.carrinho = [];
    estado.desconto = 0;
    estado.beneficioAplicado = "";
    estado.fidelidadeAtiva = false;
    estado.cpfInformado = false;
    estado.cpfMascarado = "";
    estado.usarCpfNota = false;
    estado.pontosUtilizados = 0;
    estado.pontosGanhos = 0;
    estado.numeroPedido = "";
    renderizar();
  }

  renderizar();
});
