document.addEventListener("DOMContentLoaded", function () {
  const usuario = obterUsuario();
  const consentimentos = obterConsentimentos();
  const unidadeId = obterUnidadeSelecionadaId();
  const participaFidelidade = Boolean(usuario && consentimentos.fidelidade === true);
  const pontosArea = document.querySelector("#points-card");
  const beneficiosArea = document.querySelector("#benefits-grid");
  const pontos = participaFidelidade ? usuario.pontos : 0;

  montarCartaoPontos(pontosArea, usuario, participaFidelidade, pontos);
  montarBeneficios(beneficiosArea, participaFidelidade, pontos);
  montarPromocoes(beneficiosArea, unidadeId);
});

function montarCartaoPontos(area, usuario, participaFidelidade, pontos) {
  const fragmento = document.querySelector("#points-card-template").content.cloneNode(true);
  const acao = fragmento.querySelector("[data-points-action]");

  fragmento.querySelector("[data-points-value]").textContent = participaFidelidade ? pontos + " pontos" : "Fidelidade desativada";
  fragmento.querySelector("[data-points-description]").textContent = participaFidelidade
    ? "Acumule pontos a cada pedido e troque por benefícios."
    : "Ative o consentimento de fidelidade no seu perfil para acumular pontos.";
  acao.href = usuario ? "perfil.html" : "acesso.html";
  acao.textContent = usuario ? "Ver privacidade" : "Entrar para participar";
  acao.classList.remove("button-primary", "button-outline");
  acao.classList.add(usuario ? "button-outline" : "button-primary");

  area.appendChild(fragmento);
}

function montarBeneficios(area, participaFidelidade, pontos) {
  const template = document.querySelector("#benefit-card-template");

  beneficios.forEach(function (beneficio) {
    const podeUsar = participaFidelidade && pontos >= beneficio.pontosNecessarios;
    const fragmento = template.content.cloneNode(true);
    const botao = fragmento.querySelector("[data-benefit-button]");

    fragmento.querySelector("[data-benefit-name]").textContent = beneficio.nome;
    fragmento.querySelector("[data-benefit-description]").textContent = beneficio.descricao;
    fragmento.querySelector("[data-benefit-points]").textContent = beneficio.pontosNecessarios + " pontos";
    botao.dataset.benefitId = beneficio.id;
    botao.disabled = !podeUsar;
    botao.textContent = !participaFidelidade ? "Ative a fidelidade" : podeUsar ? "Usar benefício" : "Junte mais pontos";

    area.appendChild(fragmento);
  });

  area.querySelectorAll(".benefit-button").forEach(function (botao) {
    botao.addEventListener("click", function () {
      salvarBeneficioAplicado(botao.dataset.benefitId);
      mostrarMensagem(botao.parentElement.querySelector(".benefit-message"), "Benefício selecionado para o próximo pedido.", "sucesso");
    });
  });
}

function montarPromocoes(area, unidadeId) {
  const template = document.querySelector("#promotion-card-template");
  const promocoesDisponiveis = promocoes.filter(function (promocao) {
    return !unidadeId || promocao.unidades.includes(unidadeId);
  });

  promocoesDisponiveis.forEach(function (promocao) {
    const fragmento = template.content.cloneNode(true);
    fragmento.querySelector("[data-promotion-name]").textContent = promocao.nome;
    fragmento.querySelector("[data-promotion-description]").textContent = promocao.descricao;
    fragmento.querySelector("[data-promotion-audience]").textContent = "Campanha ativa · " + promocao.publicoAlvo;
    area.appendChild(fragmento);
  });

  if (!promocoesDisponiveis.length) {
    const mensagem = document.querySelector("#promotion-empty-template").content.cloneNode(true);
    area.appendChild(mensagem);
  }
}
