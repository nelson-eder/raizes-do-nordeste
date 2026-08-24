const nomeCache = "raizes-pwa-v4";
const arquivosParaCache = [
  "./",
  "./index.html",
  "./acesso.html",
  "./ajuda.html",
  "./aplicativo.html",
  "./beneficios.html",
  "./cardapio.html",
  "./carrinho.html",
  "./checkout.html",
  "./franquias.html",
  "./pagamento.html",
  "./pedido.html",
  "./perfil.html",
  "./privacidade.html",
  "./produto.html",
  "./quem-somos.html",
  "./totem.html",
  "./css/estilos.css",
  "./css/responsivo.css",
  "./css/totem.css",
  "./manifest.webmanifest",
  "./sw.js",
  "./js/acesso.js",
  "./js/cardapio.js",
  "./js/carrinho.js",
  "./js/checkout.js",
  "./js/comum.js",
  "./js/componentes.js",
  "./js/dados.js",
  "./js/index.js",
  "./js/pagamento.js",
  "./js/pedido.js",
  "./js/perfil.js",
  "./js/pwa.js",
  "./js/produto.js",
  "./js/rolagem.js",
  "./js/totem.js",
  "./assets/logos/logo.png",
  "./assets/logos/logotipo.png",
  "./assets/logos/pwa-192.png",
  "./assets/logos/pwa-512.png",
  "./assets/imagens/backIcon.svg",
  "./assets/imagens/cartIcon.svg",
  "./assets/imagens/homeIcon.svg",
  "./assets/imagens/shieldIcon.svg",
  "./assets/imagens/fotos/baiao-de-dois.jpg",
  "./assets/imagens/fotos/bolo-de-rolo.jpg",
  "./assets/imagens/fotos/bolo-macaxeira.jpg",
  "./assets/imagens/fotos/cafe-coado.jpg",
  "./assets/imagens/fotos/cafe-com-leite.jpg",
  "./assets/imagens/fotos/cartola-nordestina.jpg",
  "./assets/imagens/fotos/cuscuz-junino.jpg",
  "./assets/imagens/fotos/escondidinho-carne-sol.jpg",
  "./assets/imagens/fotos/queijo-coalho-grelhado.jpg",
  "./assets/imagens/fotos/suco-caja.jpg",
  "./assets/imagens/fotos/tapioca-carne-sol.jpg",
  "./assets/imagens/fotos/tapioca-queijo-coalho.jpg"
];

self.addEventListener("install", function (evento) {
  evento.waitUntil(
    caches.open(nomeCache).then(function (cache) {
      return cache.addAll(arquivosParaCache);
    })
  );
});

self.addEventListener("activate", function (evento) {
  evento.waitUntil(
    caches.keys().then(function (nomesCache) {
      return Promise.all(nomesCache.map(function (nome) {
        if (nome !== nomeCache) {
          return caches.delete(nome);
        }
        return null;
      }));
    })
  );
});

self.addEventListener("fetch", function (evento) {
  if (evento.request.method !== "GET") {
    return;
  }

  evento.respondWith(
    caches.match(evento.request).then(function (respostaEmCache) {
      return respostaEmCache || fetch(evento.request).then(function (respostaDaRede) {
        const copiaDaResposta = respostaDaRede.clone();
        caches.open(nomeCache).then(function (cache) {
          cache.put(evento.request, copiaDaResposta);
        });
        return respostaDaRede;
      });
    })
  );
});
