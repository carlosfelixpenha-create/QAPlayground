// --- Modal ---
function mostrarModal(mensagem) {
  const modalTexto = document.getElementById("modalTexto");
  modalTexto.innerHTML = mensagem.replace(/\n/g, "<br>");
  const modal = document.getElementById("modalMensagem");
  modal.style.display = "flex";
}

function mostrarModalErro(mensagem) {
  const modalTextoErro = document.getElementById("modalTextoErro");
  modalTextoErro.innerHTML = mensagem.replace(/\n/g, "<br>");
  const modalErro = document.getElementById("modalMensagemErro");
  modalErro.style.display = "flex";
}

// --- Função principal de login ---
function executarLogin(event) {
  event.preventDefault();

  const usuario = document.getElementById("usuario").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const captcha = document.getElementById("captcha").checked;

  // Valida campos obrigatórios primeiro
  if (!usuario) {
    mostrarModalErro("Preencher corretamente o campo Usuário!");
    return;
  }
  if (!senha) {
    mostrarModalErro("Preencher corretamente o campo Senha!");
    return;
  }

  // Valida captcha
  if (!captcha) {
    mostrarModalErro("Marque o captcha para continuar!");
    return;
  }

  // Recupera cadastro salvo (usa a mesma chave do cadastro.js)
  const usuarioSalvo = JSON.parse(localStorage.getItem("qaplayground_usuario"));

  // Valida se existe cadastro
  if (!usuarioSalvo) {
    mostrarModalErro(
      "Nenhum cadastro encontrado. Realize o cadastro antes de fazer login."
    );
    return;
  }

  // Valida usuário e senha
  if (usuario === usuarioSalvo.email && senha === usuarioSalvo.senha) {
    mostrarModal("Login realizado com sucesso!");
    // limpa os campos após sucesso
    const form = document.querySelector(".form-container");
    if (form && typeof form.reset === "function") {
      form.reset();
    }
  } else {
    mostrarModalErro("Usuário ou senha inválidos. Tente novamente.");
  }
}

// Disponibiliza no escopo global para o HTML encontrar
window.executarLogin = executarLogin;

// --- Inicialização dos listeners ---
function inicializarLogin() {
  const modal = document.getElementById("modalMensagem");
  const modalErro = document.getElementById("modalMensagemErro");
  const btnFechar = document.getElementById("modalFechar");
  const btnOk = document.getElementById("modalOk");
  const btnFecharErro = document.getElementById("modalFecharErro");
  const btnOkErro = document.getElementById("modalOkErro");

  // Fechar pelo X
  if (btnFechar) {
    btnFechar.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }
  if (btnFecharErro) {
    btnFecharErro.addEventListener("click", () => {
      modalErro.style.display = "none";
    });
  }

  // Fechar pelo OK
  if (btnOk) {
    btnOk.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }
  if (btnOkErro) {
    btnOkErro.addEventListener("click", () => {
      modalErro.style.display = "none";
    });
  }

  // Fechar ao clicar fora (overlay)
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
    if (event.target === modalErro) {
      modalErro.style.display = "none";
    }
  });

  // Toggle de visibilidade da senha
  const btn = document.getElementById("toggleSenha");
  const input = document.getElementById("senha");

  if (btn && input) {
    btn.addEventListener("click", () => {
      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";
      btn.textContent = isPassword ? "👁️" : "🙈";
      btn.setAttribute(
        "aria-label",
        isPassword ? "Mostrar senha" : "Ocultar senha"
      );
      input.focus();
    });
  }
}

// Chama a inicialização quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", inicializarLogin);

// Exporta funções para os testes unitários
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    executarLogin,
    mostrarModal,
    mostrarModalErro,
    inicializarLogin,
  };
}
