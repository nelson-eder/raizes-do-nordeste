function configurarScrollTouch(areaRolagem) {
  if (!areaRolagem || areaRolagem.dataset.scrollConfigured === "true") {
    atualizarBarraRolagem(areaRolagem);
    return;
  }

  let toqueInicialY = null;
  let scrollInicial = 0;
  let arrastando = false;
  let ignorarClique = false;

  areaRolagem.dataset.scrollConfigured = "true";
  areaRolagem.addEventListener("touchstart", function (evento) {
    if (evento.touches.length !== 1) {
      return;
    }
    toqueInicialY = evento.touches[0].clientY;
    scrollInicial = areaRolagem.scrollTop;
    arrastando = false;
  }, { passive: true });

  areaRolagem.addEventListener("touchmove", function (evento) {
    if (toqueInicialY === null || evento.touches.length !== 1) {
      return;
    }

    const deslocamento = toqueInicialY - evento.touches[0].clientY;
    if (Math.abs(deslocamento) < 8) {
      return;
    }

    arrastando = true;
    areaRolagem.scrollTop = scrollInicial + deslocamento;
    evento.preventDefault();
  }, { passive: false });

  function finalizarToque() {
    if (arrastando) {
      ignorarClique = true;
      setTimeout(function () {
        ignorarClique = false;
      }, 400);
    }
    toqueInicialY = null;
    arrastando = false;
  }

  areaRolagem.addEventListener("touchend", finalizarToque);
  areaRolagem.addEventListener("touchcancel", finalizarToque);
  areaRolagem.addEventListener("scroll", function () {
    atualizarBarraRolagem(areaRolagem);
  });
  areaRolagem.addEventListener("click", function (evento) {
    if (!ignorarClique) {
      return;
    }
    evento.preventDefault();
    evento.stopPropagation();
    ignorarClique = false;
  }, true);
  configurarInteracaoBarraRolagem(areaRolagem);
  atualizarBarraRolagem(areaRolagem);
}

function configurarInteracaoBarraRolagem(areaRolagem) {
  const barraRolagem = areaRolagem.parentElement.querySelector("[data-scrollbar]");
  const puxador = barraRolagem ? barraRolagem.querySelector("[data-scrollbar-thumb]") : null;
  if (!barraRolagem || !puxador) {
    return;
  }

  let arrastando = false;
  let ignorarClique = false;
  let toqueInicialY = 0;
  let scrollInicial = 0;

  barraRolagem.addEventListener("click", function (evento) {
    if (ignorarClique || evento.target === puxador) {
      ignorarClique = false;
      return;
    }

    const areaBarra = barraRolagem.getBoundingClientRect();
    const alturaPuxador = puxador.offsetHeight;
    const deslocamentoMaximo = Math.max(0, areaBarra.height - alturaPuxador);
    const rolagemMaxima = areaRolagem.scrollHeight - areaRolagem.clientHeight;
    const posicaoClique = evento.clientY - areaBarra.top - alturaPuxador / 2;
    const proporcao = deslocamentoMaximo
      ? Math.max(0, Math.min(1, posicaoClique / deslocamentoMaximo))
      : 0;
    areaRolagem.scrollTop = proporcao * rolagemMaxima;
  });

  barraRolagem.addEventListener("pointerdown", function (evento) {
    if (evento.target !== puxador) {
      return;
    }
    arrastando = true;
    toqueInicialY = evento.clientY;
    scrollInicial = areaRolagem.scrollTop;
    puxador.classList.add("totem-scrollbar-thumb-dragging");
    if (barraRolagem.setPointerCapture) {
      barraRolagem.setPointerCapture(evento.pointerId);
    }
    evento.preventDefault();
  });

  barraRolagem.addEventListener("pointermove", function (evento) {
    if (!arrastando) {
      return;
    }

    const alturaDisponivel = barraRolagem.clientHeight - puxador.offsetHeight;
    const rolagemMaxima = areaRolagem.scrollHeight - areaRolagem.clientHeight;
    if (alturaDisponivel <= 0 || rolagemMaxima <= 0) {
      return;
    }

    const deslocamento = evento.clientY - toqueInicialY;
    areaRolagem.scrollTop = scrollInicial + (deslocamento / alturaDisponivel) * rolagemMaxima;
    evento.preventDefault();
  });

  function finalizarArraste() {
    if (!arrastando) {
      return;
    }
    arrastando = false;
    ignorarClique = true;
    puxador.classList.remove("totem-scrollbar-thumb-dragging");
    setTimeout(function () {
      ignorarClique = false;
    }, 200);
  }

  barraRolagem.addEventListener("pointerup", finalizarArraste);
  barraRolagem.addEventListener("pointercancel", finalizarArraste);
}

function atualizarBarraRolagem(areaRolagem) {
  if (!areaRolagem) {
    return;
  }

  const barraRolagem = areaRolagem.parentElement.querySelector("[data-scrollbar]");
  if (!barraRolagem) {
    return;
  }

  const puxador = barraRolagem.querySelector("[data-scrollbar-thumb]");
  const alturaVisivel = areaRolagem.clientHeight;
  const alturaConteudo = areaRolagem.scrollHeight;
  if (!puxador || alturaConteudo <= alturaVisivel) {
    barraRolagem.hidden = true;
    return;
  }

  barraRolagem.hidden = false;
  const alturaBarra = barraRolagem.clientHeight;
  const alturaPuxador = Math.max(36, alturaBarra * (alturaVisivel / alturaConteudo));
  const deslocamentoMaximo = Math.max(0, alturaBarra - alturaPuxador);
  const rolagemMaxima = alturaConteudo - alturaVisivel;
  const deslocamento = (areaRolagem.scrollTop / rolagemMaxima) * deslocamentoMaximo;
  puxador.style.height = alturaPuxador + "px";
  puxador.style.transform = "translateY(" + deslocamento + "px)";
}
