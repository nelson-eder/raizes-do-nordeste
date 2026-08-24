document.addEventListener("DOMContentLoaded", function () {
  const seletorUnidade = document.querySelector("#unit-select");
  const botaoContinuar = document.querySelector("#continue-button");
  const unidadeSalva = obterUnidadeSelecionadaId();

  if (unidadeSalva) {
    seletorUnidade.value = unidadeSalva;
  }

  botaoContinuar.addEventListener("click", function () {
    const unidadeId = seletorUnidade.value;

    if (unidadeId) {
      salvarUnidadeSelecionada(unidadeId);
    } else {
      localStorage.removeItem(chaveUnidade);
    }

    window.location.href = "cardapio.html";
  });
});
