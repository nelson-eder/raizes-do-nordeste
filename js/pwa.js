let instalacaoPwaAdiada = null;

document.addEventListener("DOMContentLoaded", function () {
  registrarServiceWorker();
  configurarBotaoDeInstalacao();
});

function registrarServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  navigator.serviceWorker.register("./sw.js").catch(function () {
    return null;
  });
}

function configurarBotaoDeInstalacao() {
  const botaoInstalar = document.querySelector("#pwa-install-button");
  const mensagemInstalacao = document.querySelector("#pwa-install-message");

  if (!botaoInstalar) {
    return;
  }

  window.addEventListener("beforeinstallprompt", function (evento) {
    evento.preventDefault();
    instalacaoPwaAdiada = evento;
    botaoInstalar.hidden = false;
    botaoInstalar.textContent = "Instalar aplicativo";
    if (mensagemInstalacao) {
      mensagemInstalacao.textContent = "Instale a Raízes diretamente no seu dispositivo.";
    }
  });

  botaoInstalar.addEventListener("click", function () {
    if (!instalacaoPwaAdiada) {
      if (mensagemInstalacao) {
        mensagemInstalacao.textContent = "Abra o menu do navegador e escolha a opção de instalar o aplicativo.";
      }
      return;
    }

    instalacaoPwaAdiada.prompt();
    instalacaoPwaAdiada.userChoice.then(function () {
      instalacaoPwaAdiada = null;
      botaoInstalar.hidden = true;
    });
  });

  window.addEventListener("appinstalled", function () {
    botaoInstalar.hidden = true;
    if (mensagemInstalacao) {
      mensagemInstalacao.textContent = "Aplicativo instalado. Você já pode acessá-lo pela tela inicial.";
    }
  });
}
