// --- Fallback local com os mesmos critérios de senha ---
function validarSenhaLocal(valor) {
  if (valor.length < 6 || valor.length > 12) return false;
  if (!/[0-9]/.test(valor)) return false;
  if (!/[A-Z]/.test(valor)) return false;
  const temSimbolo = /[!@#$%^&*(),.?":{}|<>_\-+=/~[\]\\;']/;
  if (!temSimbolo.test(valor)) return false;
  return true;
}

// --- Atualiza regras dinamicamente conforme o usuário digita ---
function atualizarRegrasSenha() {
  const senha = document.getElementById("senha").value;

  const regraMaiuscula = document.getElementById("regra-maiuscula");
  const regraNumero = document.getElementById("regra-numero");
  const regraSimbolo = document.getElementById("regra-simbolo");
  const regraTamanho = document.getElementById("regra-tamanho");

  if (/[A-Z]/.test(senha)) {
    regraMaiuscula.className = "valida";
    regraMaiuscula.querySelector(".check").textContent = "✔";
  } else {
    regraMaiuscula.className = "";
    regraMaiuscula.querySelector(".check").textContent = "☐";
  }

  if (/[0-9]/.test(senha)) {
    regraNumero.className = "valida";
    regraNumero.querySelector(".check").textContent = "✔";
  } else {
    regraNumero.className = "";
    regraNumero.querySelector(".check").textContent = "☐";
  }

  if (/[!@#$%^&*(),.?":{}|<>_\-+=/~[\]\\;']/.test(senha)) {
    regraSimbolo.className = "valida";
    regraSimbolo.querySelector(".check").textContent = "✔";
  } else {
    regraSimbolo.className = "";
    regraSimbolo.querySelector(".check").textContent = "☐";
  }

  if (senha.length >= 6 && senha.length <= 12) {
    regraTamanho.className = "valida";
    regraTamanho.querySelector(".check").textContent = "✔";
  } else {
    regraTamanho.className = "";
    regraTamanho.querySelector(".check").textContent = "☐";
  }
}

// --- Validação final ao clicar em Validar ---
function validarSenhaAcessibilidade() {
  const senha = document.getElementById("senha").value;
  const retorno = document.getElementById("retorno-senha");
  const btnValidar = document.querySelector(".btn-validar");

  const regrasFaltantes = [];

  if (!/[A-Z]/.test(senha))
    regrasFaltantes.push("ao menos uma letra maiúscula");
  if (!/[0-9]/.test(senha)) regrasFaltantes.push("ao menos um número");
  if (!/[!@#$%^&*(),.?":{}|<>_\-+=/~[\]\\;']/.test(senha))
    regrasFaltantes.push("ao menos um símbolo");
  if (!(senha.length >= 6 && senha.length <= 12))
    regrasFaltantes.push("entre 6 e 12 caracteres");

  // Marca regras não atendidas com ✖
  document.querySelectorAll(".regras-senha li").forEach((li) => {
    if (!li.classList.contains("valida")) {
      li.className = "invalida";
      li.querySelector(".check").textContent = "✖";
    }
  });

  if (regrasFaltantes.length === 0) {
    retorno.textContent = "Senha válida!";
    retorno.style.color = "green";
  } else {
    retorno.textContent =
      "Senha inválida! A senha deve conter " +
      regrasFaltantes.join(" e ") +
      ".";
    retorno.style.color = "red";
  }

  if (btnValidar) btnValidar.disabled = true;
}

// --- Resetar página (limpar campos e feedbacks) ---
function resetarPagina() {
  const campoSenha = document.getElementById("senha");
  const retorno = document.getElementById("retorno-senha");
  const btnValidar = document.querySelector(".btn-validar");

  if (campoSenha) campoSenha.value = "";
  if (retorno) {
    retorno.textContent = "";
    retorno.style.color = "";
  }
  if (btnValidar) btnValidar.disabled = false;

  document.querySelectorAll(".regras-senha li").forEach((li) => {
    li.className = "";
    const check = li.querySelector(".check");
    if (check) check.textContent = "☐";
  });
}

// --- Inicializa listeners do feedback visual ---
function inicializarAcessibilidade() {
  const campoSenha = document.getElementById("senha");

  if (campoSenha) {
    campoSenha.addEventListener("input", atualizarRegrasSenha);
  }
}
// Toggle de visibilidade da senha (Acessibilidade) corrigido
function inicializarToggleSenhaAcessibilidade() {
  const campoSenha = document.getElementById("senha");
  const toggleBtn = document.getElementById("toggleSenhaAcessibilidade");

  if (!campoSenha || !toggleBtn) return;

  toggleBtn.addEventListener("click", () => {
    // Invertido para bater com a tela de login
    const isPassword = campoSenha.type === "password";

    // Se estava password → clicou → mostra text → botão vira 🙈
    // Se estava text → clicou → volta password → botão vira 👁️
    campoSenha.type = isPassword ? "text" : "password";
    toggleBtn.textContent = isPassword ? "🙈" : "👁️";
    toggleBtn.setAttribute(
      "aria-label",
      isPassword ? "Ocultar senha" : "Mostrar senha",
    );

    campoSenha.focus();
  });
}

// --- Disponibiliza funções globalmente ---
window.validarSenhaLocal = validarSenhaLocal;
window.atualizarRegrasSenha = atualizarRegrasSenha;
window.validarSenhaAcessibilidade = validarSenhaAcessibilidade;
window.resetarPagina = resetarPagina;
window.inicializarAcessibilidade = inicializarAcessibilidade;

// --- Inicialização automática ---
document.addEventListener("DOMContentLoaded", () => {
  inicializarAcessibilidade();
  inicializarToggleSenhaAcessibilidade(); // 👈 só isso
});

// --- Exporta para testes unitários (Jest) ---
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    validarSenhaLocal,
    atualizarRegrasSenha,
    validarSenhaAcessibilidade,
    resetarPagina,
    inicializarAcessibilidade,
    inicializarToggleSenhaAcessibilidade,
  };
}
