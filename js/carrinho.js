document.addEventListener("DOMContentLoaded", function () {
  const unidadeId = obterUnidadeSelecionadaId();
  const unidade = obterUnidadePorId(unidadeId);
  const itensArea = document.querySelector("#cart-items");
  const resumoArea = document.querySelector("#cart-summary");
  const mensagem = document.querySelector("#cart-message");
  const etiquetaUnidade = document.querySelector("#cart-unit-label");

  etiquetaUnidade.textContent = unidade
    ? unidade.nome + " · retirada rápida disponível"
    : "Itens salvos de todas as unidades";

  function renderizarCarrinho() {
    const carrinhoSalvo = obterCarrinho();
    const carrinho = unidade
      ? carrinhoSalvo.filter(function (item) {
        return item.unidadeId === unidadeId;
      })
      : carrinhoSalvo;
    const unidadesDoCarrinho = obterUnidadesDoCarrinho(carrinho);
    const temDivergencia = !unidade && unidadesDoCarrinho.length > 1;

    itensArea.replaceChildren();
    resumoArea.replaceChildren();
    resumoArea.hidden = true;
    mensagem.textContent = "";
    mensagem.className = "status-message";
    mensagem.hidden = true;

    if (!carrinho.length) {
      itensArea.appendChild(document.querySelector("#cart-empty-template").content.cloneNode(true));
      return;
    }

    if (!unidade) {
      if (temDivergencia) {
        mensagem.hidden = false;
        mostrarMensagem(
          mensagem,
          "Seu pedido reúne itens de unidades diferentes. Remova os itens divergentes antes de continuar.",
          "erro"
        );
      }
    }

    carrinho.forEach(function (item) {
      const produto = obterProdutoPorId(item.produtoId);
      const unidadeDoItem = obterUnidadePorId(item.unidadeId);
      const preco = obterPrecoProduto(produto, item.unidadeId);
      const fragmento = document.querySelector("#cart-item-template").content.cloneNode(true);
      const quantidade = fragmento.querySelector("[data-cart-quantity]");
      const unidadeDoProduto = fragmento.querySelector("[data-cart-unit]");
      const cartItem = fragmento.querySelector(".cart-item");

      fragmento.querySelector("[data-cart-image]").src = produto.imagem;
      fragmento.querySelector("[data-cart-image]").alt = produto.nome;
      fragmento.querySelector("[data-cart-name]").textContent = produto.nome;
      fragmento.querySelector("[data-cart-price]").textContent = formatarPreco(preco) + " cada";
      if (!unidade) {
        unidadeDoProduto.hidden = false;
        unidadeDoProduto.textContent = unidadeDoItem
          ? unidadeDoItem.nome
          : "Unidade do item não identificada";
      }
      if (temDivergencia) {
        unidadeDoProduto.classList.add("cart-item-unit-warning");
        cartItem.classList.add("cart-item-divergent");
      }
      fragmento.querySelector("[data-cart-quantity-label]").setAttribute("aria-label", "Quantidade de " + produto.nome);
      quantidade.textContent = item.quantidade;
      fragmento.querySelector("[data-cart-total]").textContent = formatarPreco(preco * item.quantidade);
      fragmento.querySelectorAll("[data-action]").forEach(function (botao) {
        botao.dataset.productId = item.produtoId;
        botao.dataset.unitId = item.unidadeId;
      });

      itensArea.appendChild(fragmento);
    });

    resumoArea.hidden = false;
    montarResumoCarrinho(resumoArea, carrinho, temDivergencia, unidadesDoCarrinho);
    configurarAcoesCarrinho();
  }

  function montarResumoCarrinho(area, carrinho, temDivergencia, unidadesDoCarrinho) {
    const fragmento = document.querySelector("#cart-summary-template").content.cloneNode(true);
    const botaoContinuar = fragmento.querySelector("[data-cart-continue]");
    const dicaResumo = fragmento.querySelector("[data-summary-hint]");
    fragmento.querySelector("[data-summary-subtotal]").textContent = formatarPreco(calcularSubtotal(carrinho));
    fragmento.querySelector("[data-summary-discount]").textContent = "- " + formatarPreco(calcularDesconto(carrinho));
    fragmento.querySelector("[data-summary-total]").textContent = formatarPreco(calcularTotal(carrinho));

    if (temDivergencia) {
      botaoContinuar.disabled = true;
      botaoContinuar.textContent = "Ajuste as unidades para continuar";
      dicaResumo.textContent = "Cada pedido deve reunir itens de uma única unidade. Remova os itens divergentes ou escolha uma unidade no cardápio.";
    } else if (!unidade && unidadesDoCarrinho.length === 1) {
      dicaResumo.textContent = "Todos os itens pertencem a " + unidadesDoCarrinho[0].nome + ". Essa unidade será selecionada ao continuar.";
      botaoContinuar.addEventListener("click", function () {
        salvarUnidadeSelecionada(unidadesDoCarrinho[0].id);
        window.location.href = "checkout.html";
      });
    } else {
      botaoContinuar.addEventListener("click", function () {
        window.location.href = "checkout.html";
      });
    }

    area.appendChild(fragmento);
  }

  function obterUnidadesDoCarrinho(carrinho) {
    const ids = [];

    carrinho.forEach(function (item) {
      if (item.unidadeId && !ids.includes(item.unidadeId)) {
        ids.push(item.unidadeId);
      }
    });

    return ids.map(function (id) {
      return obterUnidadePorId(id);
    }).filter(Boolean);
  }

  function configurarAcoesCarrinho() {
    document.querySelectorAll("[data-action]").forEach(function (botao) {
      botao.addEventListener("click", function () {
        const produtoId = botao.dataset.productId;
        const itemUnidadeId = botao.dataset.unitId || unidadeId;

        if (botao.dataset.action === "increase") {
          alterarQuantidadeDoCarrinho(produtoId, itemUnidadeId, 1);
        }
        if (botao.dataset.action === "decrease") {
          alterarQuantidadeDoCarrinho(produtoId, itemUnidadeId, -1);
        }
        if (botao.dataset.action === "remove") {
          removerProdutoDoCarrinho(produtoId, itemUnidadeId);
        }
        renderizarCarrinho();
      });
    });
  }

  renderizarCarrinho();
});
