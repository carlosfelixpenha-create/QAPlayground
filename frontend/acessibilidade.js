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
  regraMaiuscula.className = /[A-Z]/.test(senha) ? "valida" : "";
  regraMaiuscula.querySelector(".check").textContent = /[A-Z]/.test(senha)
    ? "✔"
    : "☐";

  const regraNumero = document.getElementById("regra-numero");
  regraNumero.className = /[0-9]/.test(senha) ? "valida" : "";
  regraNumero.querySelector(".check").textContent = /[0-9]/.test(senha)
    ? "✔"
    : "☐";

  const regraSimbolo = document.getElementById("regra-simbolo");
  regraSimbolo.className = /[!@#$%^&*(),.?":{}|<>_\-+=/~[\]\\;']/.test(senha)
    ? "valida"
    : "";
  regraSimbolo.querySelector(".check").textContent =
    /[!@#$%^&*(),.?":{}|<>_\-+=/~[\]\\;']/.test(senha) ? "✔" : "☐";

  const regraTamanho = document.getElementById("regra-tamanho");
  regraTamanho.className =
    senha.length >= 6 && senha.length <= 12 ? "valida" : "";
  regraTamanho.querySelector(".check").textContent =
    senha.length >= 6 && senha.length <= 12 ? "✔" : "☐";
}

// --- Validação final ao clicar em Validar ---
function validarSenhaAcessibilidade() {
  const senha = document.getElementById("senha").value;
  const retorno = document.getElementById("retorno-senha");
  const btnValidar = document.querySelector(".btn-validar");

  const fnGlobal =
    typeof window.validarSenha === "function" ? window.validarSenha : null;
  const valida = fnGlobal ? fnGlobal(senha) : validarSenhaLocal(senha);

  document.querySelectorAll(".regras-senha li").forEach((li) => {
    if (!li.classList.contains("valida")) {
      li.className = "invalida";
      li.querySelector(".check").textContent = "✖";
    }
  });

  if (valida) {
    retorno.textContent = "Senha válida!";
    retorno.style.color = "green";
  } else {
    retorno.textContent =
      "Senha inválida! A senha deve ter entre 6 e 12 caracteres, incluir número, letra maiúscula e símbolo.";
    retorno.style.color = "red";
  }

  btnValidar.disabled = true;
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

// --- Inicializa listeners (igual ao login.js) ---
function inicializarAcessibilidade() {
  const campoSenha = document.getElementById("senha");
  const toggleBtn = document.getElementById("toggleSenhaAcessibilidade");

  if (campoSenha) {
    campoSenha.addEventListener("input", atualizarRegrasSenha);
  }

  if (toggleBtn && campoSenha) {
    toggleBtn.addEventListener("click", () => {
      const isPassword = campoSenha.type === "password";
      campoSenha.type = isPassword ? "text" : "password";
      toggleBtn.textContent = isPassword ? "🙈" : "👁️";
      toggleBtn.setAttribute(
        "aria-label",
        isPassword ? "Ocultar senha" : "Mostrar senha"
      );
      campoSenha.focus();
    });
  }
}

// Disponibiliza no escopo global (opcional, se o HTML usar diretamente)
window.validarSenhaLocal = validarSenhaLocal;
window.atualizarRegrasSenha = atualizarRegrasSenha;
window.validarSenhaAcessibilidade = validarSenhaAcessibilidade;
window.resetarPagina = resetarPagina;
window.inicializarAcessibilidade = inicializarAcessibilidade;

// Exporta funções para os testes unitários (Jest)
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    validarSenhaLocal,
    atualizarRegrasSenha,
    validarSenhaAcessibilidade,
    resetarPagina,
    inicializarAcessibilidade,
  };
}
