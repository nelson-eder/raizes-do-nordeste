document.addEventListener("DOMContentLoaded", inicializarMenuSite);

function inicializarMenuSite() {
  document.querySelectorAll(".menu-toggle").forEach(function (botaoMenu) {
    const menu = document.querySelector("#" + botaoMenu.getAttribute("aria-controls"));

    if (!menu) {
      return;
    }

    botaoMenu.addEventListener("click", function () {
      const menuAberto = menu.hidden;
      menu.hidden = !menuAberto;
      botaoMenu.setAttribute("aria-expanded", String(menuAberto));
      botaoMenu.setAttribute("aria-label", menuAberto ? "Fechar menu" : "Abrir menu");
      botaoMenu.classList.toggle("menu-toggle-active", menuAberto);
    });

    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        fecharMenuSite(menu, botaoMenu);
      });
    });

    document.addEventListener("keydown", function (evento) {
      if (evento.key === "Escape" && !menu.hidden) {
        fecharMenuSite(menu, botaoMenu);
      }
    });
  });
}

function fecharMenuSite(menu, botaoMenu) {
  menu.hidden = true;
  botaoMenu.setAttribute("aria-expanded", "false");
  botaoMenu.setAttribute("aria-label", "Abrir menu");
  botaoMenu.classList.remove("menu-toggle-active");
}
