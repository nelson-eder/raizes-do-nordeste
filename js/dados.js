const unidades = [
  {
    id: "recife-centro",
    nome: "Recife, Centro",
    endereco: "Rua da Aurora, 120",
    horario: "07h às 21h",
    retiradaRapida: true,
    formato: "Unidade completa",
    cozinha: "Cozinha própria"
  },
  {
    id: "olinda-carmo",
    nome: "Olinda, Carmo",
    endereco: "Rua do Amparo, 48",
    horario: "07h às 20h",
    retiradaRapida: true,
    formato: "Unidade compacta",
    cozinha: "Produção reduzida"
  },
  {
    id: "joao-pessoa-tambau",
    nome: "João Pessoa, Tambaú",
    endereco: "Avenida Almirante, 305",
    horario: "06h30 às 22h",
    retiradaRapida: true,
    formato: "Unidade completa",
    cozinha: "Cozinha própria"
  }
];

const produtos = [
  {
    id: "tapioca-carne-sol",
    nome: "Tapioca de carne de sol",
    categoria: "Tapiocas",
    descricao: "Tapioca macia recheada com carne de sol, queijo coalho e cebola dourada.",
    imagem: "assets/imagens/fotos/tapioca-carne-sol.jpg",
    tags: ["Regional"],
    precos: {
      "recife-centro": 18.9,
      "olinda-carmo": 17.9,
      "joao-pessoa-tambau": 19.9
    },
    disponibilidade: {
      "recife-centro": true,
      "olinda-carmo": true,
      "joao-pessoa-tambau": true
    }
  },
  {
    id: "cuscuz-junino",
    nome: "Cuscuz recheado junino",
    categoria: "Cuscuz",
    descricao: "Cuscuz de milho com queijo coalho, frango desfiado e manteiga de garrafa.",
    imagem: "assets/imagens/fotos/cuscuz-junino.jpg",
    tags: ["Sazonal", "Junino"],
    precos: {
      "recife-centro": 16.5,
      "olinda-carmo": 15.5,
      "joao-pessoa-tambau": 17.5
    },
    disponibilidade: {
      "recife-centro": true,
      "olinda-carmo": false,
      "joao-pessoa-tambau": true
    }
  },
  {
    id: "cafe-coado",
    nome: "Café coado na hora",
    categoria: "Cafés",
    descricao: "Café passado na hora, servido quente para acompanhar seu pedido.",
    imagem: "assets/imagens/fotos/cafe-coado.jpg",
    tags: ["Clássico"],
    precos: {
      "recife-centro": 5.5,
      "olinda-carmo": 5,
      "joao-pessoa-tambau": 5.5
    },
    disponibilidade: {
      "recife-centro": true,
      "olinda-carmo": true,
      "joao-pessoa-tambau": true
    }
  },
  {
    id: "bolo-macaxeira",
    nome: "Bolo de macaxeira",
    categoria: "Doces",
    descricao: "Fatia de bolo de macaxeira com textura cremosa e sabor caseiro.",
    imagem: "assets/imagens/fotos/bolo-macaxeira.jpg",
    tags: ["Caseiro"],
    precos: {
      "recife-centro": 8.5,
      "olinda-carmo": 8,
      "joao-pessoa-tambau": 9
    },
    disponibilidade: {
      "recife-centro": true,
      "olinda-carmo": true,
      "joao-pessoa-tambau": false
    }
  },
  {
    id: "tapioca-queijo-coalho",
    nome: "Tapioca de queijo coalho",
    categoria: "Tapiocas",
    descricao: "Tapioca dourada recheada com queijo coalho derretido e orégano.",
    imagem: "assets/imagens/fotos/tapioca-queijo-coalho.jpg",
    tags: ["Regional", "Vegetariano"],
    precos: {
      "recife-centro": 15.9,
      "olinda-carmo": 14.9,
      "joao-pessoa-tambau": 16.9
    },
    disponibilidade: {
      "recife-centro": true,
      "olinda-carmo": true,
      "joao-pessoa-tambau": true
    }
  },
  {
    id: "baiao-de-dois",
    nome: "Baião de dois da casa",
    categoria: "Pratos",
    descricao: "Arroz, feijão-verde, queijo coalho e carne de sol em uma combinação bem nordestina.",
    imagem: "assets/imagens/fotos/baiao-de-dois.jpg",
    tags: ["Regional", "Casa"],
    precos: {
      "recife-centro": 24.9,
      "olinda-carmo": 23.9,
      "joao-pessoa-tambau": 25.9
    },
    disponibilidade: {
      "recife-centro": true,
      "olinda-carmo": true,
      "joao-pessoa-tambau": true
    }
  },
  {
    id: "escondidinho-carne-sol",
    nome: "Escondidinho de carne de sol",
    categoria: "Pratos",
    descricao: "Purê de macaxeira cremoso, carne de sol desfiada e queijo gratinado.",
    imagem: "assets/imagens/fotos/escondidinho-carne-sol.jpg",
    tags: ["Regional"],
    precos: {
      "recife-centro": 26.9,
      "olinda-carmo": 25.9,
      "joao-pessoa-tambau": 27.9
    },
    disponibilidade: {
      "recife-centro": true,
      "olinda-carmo": false,
      "joao-pessoa-tambau": true
    }
  },
  {
    id: "queijo-coalho-grelhado",
    nome: "Queijo coalho grelhado",
    categoria: "Lanches",
    descricao: "Espetinho de queijo coalho grelhado, servido com melaço de cana.",
    imagem: "assets/imagens/fotos/queijo-coalho-grelhado.jpg",
    tags: ["Petisco", "Regional"],
    precos: {
      "recife-centro": 14.5,
      "olinda-carmo": 13.5,
      "joao-pessoa-tambau": 15.5
    },
    disponibilidade: {
      "recife-centro": true,
      "olinda-carmo": true,
      "joao-pessoa-tambau": false
    }
  },
  {
    id: "suco-caja",
    nome: "Suco de cajá",
    categoria: "Bebidas",
    descricao: "Suco gelado de cajá, preparado com polpa de fruta nordestina.",
    imagem: "assets/imagens/fotos/suco-caja.jpg",
    tags: ["Natural"],
    precos: {
      "recife-centro": 8.5,
      "olinda-carmo": 8,
      "joao-pessoa-tambau": 9
    },
    disponibilidade: {
      "recife-centro": true,
      "olinda-carmo": true,
      "joao-pessoa-tambau": true
    }
  },
  {
    id: "cafe-com-leite",
    nome: "Café com leite",
    categoria: "Cafés",
    descricao: "Café coado misturado com leite quente para começar bem o dia.",
    imagem: "assets/imagens/fotos/cafe-com-leite.jpg",
    tags: ["Clássico"],
    precos: {
      "recife-centro": 7.5,
      "olinda-carmo": 7,
      "joao-pessoa-tambau": 7.5
    },
    disponibilidade: {
      "recife-centro": true,
      "olinda-carmo": true,
      "joao-pessoa-tambau": true
    }
  },
  {
    id: "cartola-nordestina",
    nome: "Cartola nordestina",
    categoria: "Doces",
    descricao: "Banana dourada, queijo coalho, canela e um toque de açúcar.",
    imagem: "assets/imagens/fotos/cartola-nordestina.jpg",
    tags: ["Regional", "Doce"],
    precos: {
      "recife-centro": 13.5,
      "olinda-carmo": 12.5,
      "joao-pessoa-tambau": 14
    },
    disponibilidade: {
      "recife-centro": true,
      "olinda-carmo": false,
      "joao-pessoa-tambau": true
    }
  },
  {
    id: "bolo-de-rolo",
    nome: "Bolo de rolo",
    categoria: "Doces",
    descricao: "Fatias finas de bolo de rolo com recheio de goiabada.",
    imagem: "assets/imagens/fotos/bolo-de-rolo.jpg",
    tags: ["Pernambucano", "Doce"],
    precos: {
      "recife-centro": 9.5,
      "olinda-carmo": 9,
      "joao-pessoa-tambau": 10
    },
    disponibilidade: {
      "recife-centro": true,
      "olinda-carmo": true,
      "joao-pessoa-tambau": true
    }
  }
];

const promocoes = [
  {
    id: "cafe-da-manha",
    nome: "Café da manhã da casa",
    descricao: "Café coado com bolo de macaxeira por um preço especial.",
    desconto: 10,
    unidades: ["recife-centro", "olinda-carmo"],
    publicoAlvo: "Clientes que pedem pela manhã"
  }
];

const beneficios = [
  {
    id: "desconto-fidelidade",
    nome: "R$ 5 de desconto",
    descricao: "Use seus pontos para ganhar desconto neste pedido.",
    pontosNecessarios: 100,
    desconto: 5
  },
  {
    id: "desconto-fidelidade-plus",
    nome: "R$ 10 de desconto",
    descricao: "Para clientes mais frequentes, com uma recompensa maior.",
    pontosNecessarios: 200,
    desconto: 10
  }
];

const usuarioTotemDemo = {
  nome: "Cliente demonstrativo",
  pontos: 120
};
