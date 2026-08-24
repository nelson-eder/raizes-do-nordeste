document.addEventListener("DOMContentLoaded", function () {
  const unidadeId = obterUnidadeSelecionadaId();
  const unidade = obterUnidadePorId(unidadeId);
  const titulo = document.querySelector("#menu-title");
  const resumoUnidade = document.querySelector("#unit-summary");
  const seletorUnidade = document.querySelector("#menu-unit-select");
  const gradeProdutos = document.querySelector("#menu-grid");
  const contadorCarrinho = document.querySelector("#floating-cart-count");

  if (unidade) {
    titulo.textContent = "Cardápio de " + unidade.nome;
    montarResumoUnidade(resumoUnidade, unidade);
  } else {
    titulo.textContent = "Cardápio completo";
    resumoUnidade.textContent = "Exibindo os produtos disponíveis em todas as unidades.";
  }

  if (unidadeId) {
    seletorUnidade.value = unidadeId;
  }

  seletorUnidade.addEventListener("change", function () {
    if (seletorUnidade.value) {
      salvarUnidadeSelecionada(seletorUnidade.value);
    } else {
      localStorage.removeItem(chaveUnidade);
    }
    window.location.reload();
  });

  function renderizarProdutos() {
    const produtosFiltrados = produtos.filter(function (produto) {
      const disponivel = !unidadeId || produtoDisponivel(produto, unidadeId);
      return disponivel;
    });

    gradeProdutos.replaceChildren();
    if (!produtosFiltrados.length) {
      gradeProdutos.appendChild(document.querySelector("#empty-menu-template").content.cloneNode(true));
      atualizarBarraRolagem(gradeProdutos);
      return;
    }

    produtosFiltrados.forEach(function (produto) {
      const fragmento = document.querySelector("#product-card-template").content.cloneNode(true);
      const imagem = fragmento.querySelector("[data-product-image]");
      const status = fragmento.querySelector("[data-product-status]");
      const botao = fragmento.querySelector("[data-product-action]");

      imagem.src = produto.imagem;
      imagem.alt = produto.nome;
      fragmento.querySelector("[data-product-name]").textContent = produto.nome;
      fragmento.querySelector("[data-product-description]").textContent = produto.descricao;
      fragmento.querySelector("[data-product-price]").textContent = obterPrecoCardapio(produto, unidadeId);
      status.textContent = unidadeId ? "Disponível" : "Disponível em alguma unidade";
      botao.textContent = unidadeId ? "Adicionar ao carrinho" : "Selecione uma unidade";

      if (!unidadeId) {
        botao.addEventListener("click", function () {
          seletorUnidade.focus();
          if (typeof seletorUnidade.showPicker === "function") {
            seletorUnidade.showPicker();
          } else {
            seletorUnidade.click();
          }
        });
      } else {
        botao.addEventListener("click", function () {
          salvarProdutoSelecionado(produto.id);
          adicionarProdutoAoCarrinho(produto.id, unidadeId);
          botao.textContent = "Adicionado ao carrinho";
          botao.classList.add("product-action-added");
          atualizarContadorCarrinho(contadorCarrinho, unidadeId);
        });
      }

      produto.tags.forEach(function (tag) {
        const etiqueta = document.querySelector("#product-tag-template").content.cloneNode(true);
        etiqueta.querySelector(".product-tag").textContent = tag;
        fragmento.querySelector("[data-product-tags]").appendChild(etiqueta);
      });
      gradeProdutos.appendChild(fragmento);
    });
    atualizarBarraRolagem(gradeProdutos);
  }

  atualizarContadorCarrinho(contadorCarrinho, unidadeId);
  configurarScrollTouch(gradeProdutos);
  renderizarProdutos();
});

function obterPrecoCardapio(produto, unidadeId) {
  if (unidadeId) {
    return formatarPreco(obterPrecoProduto(produto, unidadeId));
  }

  const precos = Object.values(produto.precos);
  const menorPreco = Math.min.apply(null, precos);
  return "A partir de " + formatarPreco(menorPreco);
}

function montarResumoUnidade(area, unidade) {
  const fragmento = document.querySelector("#unit-summary-template").content.cloneNode(true);
  fragmento.querySelector("[data-unit-address]").textContent = unidade.endereco;
  fragmento.querySelector("[data-unit-hours]").textContent = unidade.horario;
  fragmento.querySelector("[data-unit-format]").textContent = unidade.formato + " · " + unidade.cozinha;
  area.appendChild(fragmento);
}

function atualizarContadorCarrinho(area, unidadeId) {
  const quantidade = obterCarrinho().reduce(function (total, item) {
    if (unidadeId && item.unidadeId !== unidadeId) {
      return total;
    }
    return total + item.quantidade;
  }, 0);
  const textoQuantidade = quantidade === 1 ? "1 item" : quantidade + " itens";
  area.textContent = quantidade;
  area.parentElement.setAttribute("aria-label", "Abrir meu pedido: " + textoQuantidade);
}
