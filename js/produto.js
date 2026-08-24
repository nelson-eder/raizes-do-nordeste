document.addEventListener("DOMContentLoaded", function () {
  const areaProduto = document.querySelector("#product-content");
  const unidadeId = obterUnidadeSelecionadaId();
  const unidade = obterUnidadePorId(unidadeId);
  const parametros = new URLSearchParams(window.location.search);
  const produto = obterProdutoPorId(parametros.get("id"));

  if (!produto) {
    areaProduto.replaceChildren(document.querySelector("#product-error-template").content.cloneNode(true));
    return;
  }

  const disponivel = !unidadeId || produtoDisponivel(produto, unidadeId);
  const preco = unidadeId ? formatarPreco(obterPrecoProduto(produto, unidadeId)) : obterPrecoMinimo(produto);
  const fragmento = document.querySelector("#product-template").content.cloneNode(true);
  const botao = fragmento.querySelector("[data-product-button]");
  const imagem = fragmento.querySelector("[data-product-image]");

  imagem.src = produto.imagem;
  imagem.alt = produto.nome;
  fragmento.querySelector("[data-product-unit]").textContent = unidade ? unidade.nome : "Todas as unidades";
  fragmento.querySelector("[data-product-name]").textContent = produto.nome;
  fragmento.querySelector("[data-product-description]").textContent = produto.descricao;
  fragmento.querySelector("[data-product-price]").textContent = preco;
  fragmento.querySelector("[data-product-status]").textContent = unidade
    ? disponivel ? "Disponível para esta unidade" : "Indisponível nesta unidade"
    : "Disponível conforme a unidade escolhida";
  botao.textContent = unidade
    ? disponivel ? "Adicionar ao pedido" : "Indisponível no momento"
    : "Escolha uma unidade para pedir";
  botao.disabled = !unidade || !disponivel;

  produto.tags.forEach(function (tag) {
    const etiqueta = document.querySelector("#product-tag-template").content.cloneNode(true);
    etiqueta.querySelector(".product-tag").textContent = tag;
    fragmento.querySelector("[data-product-tags]").appendChild(etiqueta);
  });

  areaProduto.replaceChildren(fragmento);

  if (unidade && disponivel) {
    document.querySelector("#add-product-button").addEventListener("click", function () {
      salvarProdutoSelecionado(produto.id);
      adicionarProdutoAoCarrinho(produto.id, unidadeId);
      mostrarMensagem(document.querySelector("#product-message"), "Produto adicionado ao carrinho.", "sucesso");
      setTimeout(function () {
        window.location.href = "carrinho.html";
      }, 500);
    });
  }
});

function obterPrecoMinimo(produto) {
  const menorPreco = Math.min.apply(null, Object.values(produto.precos));
  return "A partir de " + formatarPreco(menorPreco);
}
