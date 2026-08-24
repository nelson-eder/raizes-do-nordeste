# Raízes do Nordeste

Projeto front-end desenvolvido para representar o sistema da rede fictícia Raízes do Nordeste.

A proposta é manter uma experiência padronizada entre as unidades, respeitando diferenças de cardápio, preço, disponibilidade e promoções. O projeto possui uma versão web responsiva, uma PWA instalável e um modo de autoatendimento para totem.

## Tecnologias

- HTML;
- CSS com Flexbox;
- JavaScript;
- Local Storage;
- PWA com manifesto e service worker.

Não há back-end, banco de dados ou dependências para instalar. Os dados utilizados na demonstração são simulados no próprio front-end.

## Como executar

O site começa em:

```text
./index.html
```

Para testar o projeto, abra a pasta no Visual Studio Code e execute esse arquivo com o Live Server.

Também é possível publicar diretamente o conteúdo na Vercel, Netlify ou em outro serviço de hospedagem estática. Não existe comando de build.

## Funcionamento do site

Na página inicial, o cliente pode selecionar uma unidade ou consultar o cardápio completo. Cada unidade possui seus próprios preços e produtos disponíveis.

O fluxo principal funciona da seguinte forma:

1. seleção da unidade;
2. consulta ao cardápio;
3. adição dos produtos ao carrinho;
4. conferência do pedido;
5. identificação opcional por CPF;
6. simulação do pagamento;
7. acompanhamento até a retirada.

Se houver produtos de unidades diferentes no carrinho, o pedido não poderá continuar até que a divergência seja corrigida.

O acesso de usuário também é demonstrativo. Qualquer e-mail válido e senha com pelo menos seis caracteres podem ser usados para testar a conta, os consentimentos de privacidade, os pontos e os benefícios.

## Modo totem

Antes de ser utilizado pelos clientes, o totem precisa ser configurado por um funcionário.

Para abrir a configuração, acesse:

```text
./totem.html?configuracao=1
```

Utilize o PIN demonstrativo:

```text
2026
```

Depois, selecione a unidade em que o equipamento está instalado e salve a configuração.

A unidade fica armazenada no navegador. Por isso, ela não precisa ser escolhida novamente a cada atendimento e também não pode ser alterada pelo cliente durante o pedido.

Após a configuração, o endereço utilizado pelos clientes é:

```text
./totem.html
```

No totem, o cliente pode:

- consultar somente o cardápio da unidade configurada;
- alterar a quantidade dos produtos;
- voltar para etapas anteriores ou cancelar o atendimento;
- informar o CPF usando o teclado virtual;
- utilizar benefícios;
- simular o pagamento;
- conferir o número do pedido.

Depois da confirmação, o totem aguarda 60 segundos e volta automaticamente para a tela inicial. Os dados do atendimento são apagados, mas a unidade configurada permanece salva.

Para trocar a unidade do equipamento, basta acessar novamente a página de configuração e informar o PIN.

## Aplicativo

O projeto também funciona como PWA. A instalação pode ser acessada pela página:

```text
./aplicativo.html
```

## Observação

Cadastro, CPF, benefícios, pagamento e acompanhamento de pedidos são simulações de front-end. Essas informações ficam somente no navegador e não são enviadas para um servidor.
