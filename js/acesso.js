document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.querySelector("#login-form");
  const registerForm = document.querySelector("#register-form");

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.querySelector("#login-email").value.trim();
    const senha = document.querySelector("#login-password").value;
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!emailValido || senha.length < 6) {
      mostrarMensagem(document.querySelector("#login-message"), "Confira seu e-mail e informe uma senha com pelo menos 6 caracteres.", "erro");
      return;
    }

    salvarUsuario({
      nome: email.split("@")[0],
      email: email,
      pontos: 120
    });
    mostrarMensagem(document.querySelector("#login-message"), "Acesso realizado. Você já pode consultar seus benefícios.", "sucesso");
  });

  registerForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const nome = document.querySelector("#register-name").value.trim();
    const email = document.querySelector("#register-email").value.trim();
    const senha = document.querySelector("#register-password").value;
    const aceitaCampanhas = document.querySelector("#register-consent").checked;
    const aceitaFidelidade = document.querySelector("#register-loyalty").checked;
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!nome || !emailValido || senha.length < 6) {
      mostrarMensagem(document.querySelector("#register-message"), "Preencha os dados obrigatórios e use uma senha com pelo menos 6 caracteres.", "erro");
      return;
    }

    salvarUsuario({
      nome: nome,
      email: email,
      pontos: 0
    });
    salvarConsentimentos({
      campanhas: aceitaCampanhas,
      fidelidade: aceitaFidelidade
    });
    const mensagemCadastro = aceitaFidelidade
      ? "Conta criada. Seus pontos começarão a ser acumulados nos pedidos."
      : "Conta criada. Você poderá ativar a fidelidade depois nas preferências.";
    mostrarMensagem(document.querySelector("#register-message"), mensagemCadastro, "sucesso");
    registerForm.reset();
  });
});
