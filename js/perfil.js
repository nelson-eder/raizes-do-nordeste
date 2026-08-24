document.addEventListener("DOMContentLoaded", function () {
  const areaPerfil = document.querySelector("#profile-content");
  const usuario = obterUsuario();

  if (!usuario) {
    areaPerfil.appendChild(document.querySelector("#profile-empty-template").content.cloneNode(true));
    return;
  }

  const consentimentos = obterConsentimentos();
  const fragmento = document.querySelector("#profile-content-template").content.cloneNode(true);
  fragmento.querySelector("[data-profile-name]").textContent = usuario.nome;
  fragmento.querySelector("[data-profile-email]").textContent = usuario.email;
  fragmento.querySelector("[data-profile-points]").textContent = usuario.pontos + " pontos de fidelidade";
  fragmento.querySelector("#consent-campaigns").checked = consentimentos.campanhas === true;
  fragmento.querySelector("#consent-loyalty").checked = consentimentos.fidelidade === true;
  areaPerfil.appendChild(fragmento);

  document.querySelector("#save-privacy").addEventListener("click", function () {
    salvarConsentimentos({
      campanhas: document.querySelector("#consent-campaigns").checked,
      fidelidade: document.querySelector("#consent-loyalty").checked
    });
    mostrarMensagem(document.querySelector("#privacy-message"), "Preferências salvas com segurança.", "sucesso");
  });
});
