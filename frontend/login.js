// Função para exibir modal
function mostrarModal(mensagem) {
  const modalTexto = document.getElementById("modalTexto");
  modalTexto.innerHTML = mensagem.replace(/\n/g, "<br>");
  document.getElementById("modalMensagem").style.display = "flex";
}

// Eventos de fechar modal
document.getElementById("modalFechar").onclick = function () {
  document.getElementById("modalMensagem").style.display = "none";
};

document.getElementById("modalOk").onclick = function () {
  document.getElementById("modalMensagem").style.display = "none";
};

window.onclick = function (event) {
  const modal = document.getElementById("modalMensagem");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

// Função principal de login
function executarLogin(event) {
  event.preventDefault();

  const usuario = document.getElementById("usuario").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const captcha = document.getElementById("captcha").checked;

  // Valida campos obrigatórios primeiro
  if (!usuario) {
    mostrarModal("Preencher corretamente o campo Usuário!");
    return;
  }
  if (!senha) {
    mostrarModal("Preencher corretamente o campo Senha!");
    return;
  }

  // Valida captcha
  if (!captcha) {
    mostrarModal("Marque o captcha para continuar!");
    return;
  }

  // Recupera cadastro salvo (usa a mesma chave do cadastro.js)
  const usuarioSalvo = JSON.parse(localStorage.getItem("qaplayground_usuario"));

  // Valida se existe cadastro
  if (!usuarioSalvo) {
    mostrarModal(
      "Nenhum cadastro encontrado. Realize o cadastro antes de fazer login."
    );
    return;
  }

  // Valida usuário e senha
  if (usuario === usuarioSalvo.email && senha === usuarioSalvo.senha) {
    mostrarModal("Login realizado com sucesso!");
    // limpa os campos após sucesso
    document.querySelector(".form-container").reset();
  } else {
    mostrarModal("Usuário ou senha inválidos. Tente novamente.");
  }
}

// Disponibiliza no escopo global para o HTML encontrar
window.executarLogin = executarLogin;

// --- Toggle de visibilidade da senha ---
(function () {
  const btn = document.getElementById("toggleSenha");
  const input = document.getElementById("senha");

  if (btn && input) {
    btn.addEventListener("click", () => {
      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";
      btn.textContent = isPassword ? "🙈" : "👁️";
      btn.setAttribute(
        "aria-label",
        isPassword ? "Ocultar senha" : "Mostrar senha"
      );
      // devolve o foco ao campo para permitir edição imediata
      input.focus();
    });
  }
})();
