const chaveUnidade = "raizesUnidadeId";
const chaveProduto = "raizesProdutoId";
const chaveCarrinho = "raizesCarrinho";
const chaveUsuario = "raizesUsuario";
const chaveBeneficio = "raizesBeneficio";
const chaveConsentimentos = "raizesConsentimentos";
const chavePontosFidelidade = "raizesPontosFidelidade";

function salvarUnidadeSelecionada(unidadeId) {
  localStorage.setItem(chaveUnidade, unidadeId);
}

function obterUnidadeSelecionadaId() {
  return localStorage.getItem(chaveUnidade);
}

function obterUnidadePorId(unidadeId) {
  return unidades.find(function (unidade) {
    return unidade.id === unidadeId;
  });
}

function obterProdutoPorId(produtoId) {
  return produtos.find(function (produto) {
    return produto.id === produtoId;
  });
}

function produtoDisponivel(produto, unidadeId) {
  return Boolean(produto && produto.disponibilidade[unidadeId]);
}

function obterPrecoProduto(produto, unidadeId) {
  return produto.precos[unidadeId] || 0;
}

function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function normalizarCpf(valor) {
  return String(valor || "").replace(/\D/g, "").slice(0, 11);
}

function formatarCpf(valor) {
  const cpf = normalizarCpf(valor);

  if (cpf.length <= 3) {
    return cpf;
  }
  if (cpf.length <= 6) {
    return cpf.slice(0, 3) + "." + cpf.slice(3);
  }
  if (cpf.length <= 9) {
    return cpf.slice(0, 3) + "." + cpf.slice(3, 6) + "." + cpf.slice(6);
  }
  return cpf.slice(0, 3) + "." + cpf.slice(3, 6) + "." + cpf.slice(6, 9) + "-" + cpf.slice(9);
}

function mascararCpf(valor) {
  const cpf = normalizarCpf(valor);

  if (cpf.length !== 11) {
    return "";
  }

  return "***.***." + cpf.slice(6, 9) + "-" + cpf.slice(9);
}

function salvarProdutoSelecionado(produtoId) {
  localStorage.setItem(chaveProduto, produtoId);
}

function obterCarrinho() {
  const carrinhoSalvo = localStorage.getItem(chaveCarrinho);
  return carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];
}

function salvarCarrinho(carrinho) {
  localStorage.setItem(chaveCarrinho, JSON.stringify(carrinho))
}

function adicionarProdutoAoCarrinho(produtoId, unidadeId) {
  const carrinho = obterCarrinho();
  const itemExistente = carrinho.find(function (item) {
    return item.produtoId === produtoId && item.unidadeId === unidadeId;
  });

  if (itemExistente) {
    itemExistente.quantidade += 1;
  } else {
    carrinho.push({
      produtoId: produtoId,
      unidadeId: unidadeId,
      quantidade: 1
    });
  }

  salvarCarrinho(carrinho);
}

function alterarQuantidadeDoCarrinho(produtoId, unidadeId, variacao) {
  const carrinho = obterCarrinho();
  const item = carrinho.find(function (produto) {
    return produto.produtoId === produtoId && produto.unidadeId === unidadeId;
  });

  if (!item) {
    return;
  }

  item.quantidade += variacao;
  const carrinhoAtualizado = carrinho.filter(function (produto) {
    return produto.quantidade > 0;
  });
  salvarCarrinho(carrinhoAtualizado);
}

function removerProdutoDoCarrinho(produtoId, unidadeId) {
  const carrinhoAtualizado = obterCarrinho().filter(function (item) {
    return !(item.produtoId === produtoId && item.unidadeId === unidadeId);
  });
  salvarCarrinho(carrinhoAtualizado);
}

function calcularSubtotal(carrinho) {
  return carrinho.reduce(function (total, item) {
    const produto = obterProdutoPorId(item.produtoId);
    return total + obterPrecoProduto(produto, item.unidadeId) * item.quantidade;
  }, 0);
}

function obterUsuario() {
  const usuarioSalvo = localStorage.getItem(chaveUsuario);
  return usuarioSalvo ? JSON.parse(usuarioSalvo) : null;
}

function salvarUsuario(usuario) {
  localStorage.setItem(chaveUsuario, JSON.stringify(usuario));
}

function obterBeneficioAplicado() {
  const beneficioId = localStorage.getItem(chaveBeneficio);
  return beneficios.find(function (beneficio) {
    return beneficio.id === beneficioId;
  });
}

function salvarBeneficioAplicado(beneficioId) {
  localStorage.setItem(chaveBeneficio, beneficioId);
}

function calcularDesconto(carrinho) {
  const beneficio = obterBeneficioAplicado();
  const subtotal = calcularSubtotal(carrinho);

  if (!beneficio) {
    return 0;
  }

  return Number(Math.min(beneficio.desconto, subtotal).toFixed(2));
}

function calcularTotal(carrinho) {
  return Number((calcularSubtotal(carrinho) - calcularDesconto(carrinho)).toFixed(2));
}

function obterBeneficioDisponivelPorPontos(pontos) {
  const beneficiosOrdenados = beneficios.slice().sort(function (beneficioA, beneficioB) {
    return beneficioB.pontosNecessarios - beneficioA.pontosNecessarios;
  });

  return beneficiosOrdenados.find(function (beneficio) {
    return Number(pontos || 0) >= beneficio.pontosNecessarios;
  });
}

function obterPontosFidelidade(cpfMascarado) {
  if (!cpfMascarado) {
    return 0;
  }

  const pontosSalvos = localStorage.getItem(chavePontosFidelidade);
  const registros = pontosSalvos ? JSON.parse(pontosSalvos) : {};

  if (Object.prototype.hasOwnProperty.call(registros, cpfMascarado)) {
    return Number(registros[cpfMascarado]);
  }

  return typeof usuarioTotemDemo !== "undefined" ? Number(usuarioTotemDemo.pontos) : 0;
}

function salvarPontosFidelidade(cpfMascarado, pontos) {
  if (!cpfMascarado) {
    return;
  }

  const pontosSalvos = localStorage.getItem(chavePontosFidelidade);
  const registros = pontosSalvos ? JSON.parse(pontosSalvos) : {};
  registros[cpfMascarado] = Number(pontos);
  localStorage.setItem(chavePontosFidelidade, JSON.stringify(registros));
}

function obterConsentimentos() {
  const consentimentosSalvos = localStorage.getItem(chaveConsentimentos);
  return consentimentosSalvos ? JSON.parse(consentimentosSalvos) : {};
}

function salvarConsentimentos(consentimentos) {
  localStorage.setItem(chaveConsentimentos, JSON.stringify(consentimentos));
}

function mostrarMensagem(elemento, mensagem, tipo) {
  elemento.textContent = mensagem;
  elemento.className = "form-message";

  if (tipo) {
    elemento.classList.add("form-message-" + tipo);
  }
}
