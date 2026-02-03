// modais.js

// ===============================
// Funções principais de abrir/fechar
// ===============================
let sugestaoEnviada = false;

if (typeof emailjs !== "undefined") {
  emailjs.init("bxRBe2QaHTRxFT15J");
}

function abrirModal(tipo) {
  const modal = document.getElementById("modal-" + tipo);
  if (modal) {
    modal.style.display = "flex";

    const content = modal.querySelector(".modal-content");
    if (content) {
      if (tipo === "alerta") {
        content.classList.add("small");
        content.classList.remove("large");
      } else {
        content.classList.add("large");
        content.classList.remove("small");
      }
    }

    // ===============================
    // FORÇA contador sempre visível
    // ===============================
    if (tipo === "sugestoes") {
      const textarea = document.getElementById("texto-sugestao");
      const contador = document.getElementById("contador-sugestao");

      if (textarea && contador) {
        contador.textContent = `${textarea.value.length} / 600`;
        contador.style.display = "block";
      }

      // 🔒 desabilita o botão Sugestões ao abrir
      const btn = document.getElementById("btn-sugestoes");
      if (btn) btn.disabled = true;
    }
  }
}

function fecharModal(tipo) {
  const modal = document.getElementById("modal-" + tipo);
  if (modal) {
    modal.style.display = "none";
    resetarCamposModal(modal); // <<< limpa os campos ao fechar
  }

  // 🔹 Reabilita o botão de sugestões se o usuário saiu sem enviar
  if (tipo === "sugestoes") {
    const btnSugestoes = document.getElementById("btn-sugestoes");

    // 🔓 só reabilita se NÃO tiver enviado
    if (btnSugestoes && !sugestaoEnviada) {
      btnSugestoes.disabled = false;
    }
  }
}

// Fecha modal ao clicar fora do conteúdo
window.addEventListener("click", function (event) {
  const modalSugestoes = document.getElementById("modal-sugestoes");

  if (event.target === modalSugestoes) {
    fecharModal("sugestoes");
  }
});

// Fecha modal ao clicar fora
window.onclick = function (event) {
  const modais = document.getElementsByClassName("modal");
  for (let i = 0; i < modais.length; i++) {
    if (event.target == modais[i]) {
      modais[i].style.display = "none";
      resetarCamposModal(modais[i]); // <<< limpa também ao clicar fora
    }
  }
};

function mostrarMensagem(texto) {
  const modal = document.getElementById("modal-mensagem");
  const textoModal = document.getElementById("texto-mensagem");

  if (modal && textoModal) {
    textoModal.innerText = texto;
    modal.style.display = "block";

    // ⏱ fecha automaticamente após 2 segundos
    setTimeout(() => {
      modal.style.display = "none";
    }, 2500);
  }
}

// ===============================
// Retornos dos modais + desabilitar botões
// ===============================

// Alerta
function retornoAlerta() {
  fecharModal("alerta");
  document.getElementById("retorno-alerta").innerText =
    "Usuário confirmou que leu o alerta.";
  desabilitarBotao("alerta");
}

// Confirmação
function confirmarAcao() {
  fecharModal("confirmacao");
  document.getElementById("retorno-confirmacao").innerText =
    "Usuário confirmou a ação com senha válida!";
  desabilitarBotao("confirmacao");
}

function cancelarAcao() {
  fecharModal("confirmacao");
  document.getElementById("retorno-confirmacao").innerText =
    "Usuário cancelou a ação.";
  desabilitarBotao("confirmacao");
}

// Sucesso
function retornoSucesso() {
  fecharModal("sucesso");
  const feedback = document.getElementById("feedback-sucesso").value;
  const retorno = feedback
    ? `Usuário fechou o modal de sucesso e comentou: "${feedback}"`
    : "Usuário fechou o modal de sucesso sem comentário.";
  document.getElementById("retorno-sucesso").innerText = retorno;
  desabilitarBotao("sucesso");
}

// Erro (com shake contextual)
function retornoErro() {
  const justificativa = document
    .getElementById("justificativa-erro")
    .value.trim();
  const modalContent = document.querySelector("#modal-erro .modal-content");

  if (!justificativa) {
    document.getElementById("erro-msg").innerText =
      "Por favor, descreva o que estava fazendo.";
    // Aplica shake
    modalContent.classList.add("shake-effect");
    setTimeout(() => {
      modalContent.classList.remove("shake-effect");
    }, 400);
    return;
  }

  fecharModal("erro");
  document.getElementById("retorno-erro").innerText =
    `Usuário relatou: "${justificativa}"`;
  desabilitarBotao("erro");
}

// ===============================
// Funções auxiliares
// ===============================
function desabilitarBotao(tipo) {
  const btn = document.querySelector(`button[onclick="abrirModal('${tipo}')"]`);
  if (btn) {
    btn.disabled = true;
    btn.classList.add("btn-disabled");
    verificarTodosDesabilitados(); // <<< nova regra
  }
}

function verificarTodosDesabilitados() {
  const botoes = document.querySelectorAll(".demo-actions button");
  const btnLimpar = document.querySelector("button.resetar");

  if (btnLimpar) {
    const todosDesabilitados = Array.from(botoes).every((btn) => btn.disabled);
    btnLimpar.disabled = !todosDesabilitados;
    if (todosDesabilitados) {
      btnLimpar.classList.remove("btn-disabled");
    } else {
      btnLimpar.classList.add("btn-disabled");
    }
  }
}

// Resetar campos de uma modal específica
function resetarCamposModal(modal) {
  // Zera inputs e textareas
  const inputs = modal.querySelectorAll("input, textarea");
  inputs.forEach((el) => {
    if (el.type === "checkbox" || el.type === "radio") {
      el.checked = false;
    } else {
      el.value = "";
    }
  });

  // Desabilita botões dependentes
  const btnAlertaOk = modal.querySelector("#btn-alerta-ok");
  if (btnAlertaOk) btnAlertaOk.disabled = true;
  const btnConfirmar = modal.querySelector("#btn-confirmar");
  if (btnConfirmar) btnConfirmar.disabled = true;

  // Limpa mensagens auxiliares
  const msgs = modal.querySelectorAll("small, span.retorno");
  msgs.forEach((msg) => (msg.textContent = ""));
}

function resetarPagina() {
  // Limpa todos os retornos
  const retornos = document.getElementsByClassName("retorno");
  for (let i = 0; i < retornos.length; i++) {
    retornos[i].innerText = "";
  }

  // Fecha todos os modais abertos
  const modais = document.getElementsByClassName("modal");
  for (let i = 0; i < modais.length; i++) {
    modais[i].style.display = "none";
    resetarCamposModal(modais[i]); // <<< limpa cada modal
  }

  // Reabilita todos os botões
  const botoes = document.querySelectorAll(".demo-actions button");
  botoes.forEach((btn) => {
    btn.disabled = false;
    btn.classList.remove("btn-disabled");
  });

  // Desabilita novamente o botão limpar
  const btnLimpar = document.querySelector("button.resetar");
  if (btnLimpar) {
    btnLimpar.disabled = true;
    btnLimpar.classList.add("btn-disabled");
  }

  // Feedback visual na página
  const resetInfo = document.createElement("p");
  resetInfo.className = "retorno";
  resetInfo.innerText = "Página de modais limpa!";
  document.querySelector(".form-container").appendChild(resetInfo);

  setTimeout(() => resetInfo.remove(), 3000);
}

// ===============================
// Lógicas específicas de validação
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  // Botão limpar começa desabilitado
  const btnLimpar = document.querySelector("button.resetar");
  if (btnLimpar) {
    btnLimpar.disabled = true;
    btnLimpar.classList.add("btn-disabled");
  }

  // Checkbox do alerta
  const checkboxAlerta = document.getElementById("checkbox-alerta");
  const btnAlertaOk = document.getElementById("btn-alerta-ok");
  if (checkboxAlerta && btnAlertaOk) {
    checkboxAlerta.addEventListener("change", () => {
      btnAlertaOk.disabled = !checkboxAlerta.checked;
    });
  }

  // Validação da senha no modal de confirmação
  const senhaInput = document.getElementById("senha-confirmacao");
  const btnConfirmar = document.getElementById("btn-confirmar");
  const msg = document.getElementById("senha-msg");
  if (senhaInput && btnConfirmar) {
    senhaInput.addEventListener("input", () => {
      const senha = senhaInput.value;
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,8}$/;
      if (regex.test(senha)) {
        btnConfirmar.disabled = false;
        msg.innerText = "";
      } else {
        btnConfirmar.disabled = true;
        msg.innerText =
          "Senha inválida! Deve ter 6-8 caracteres, incluir maiúscula, minúscula e especial.";
      }
    });
  }
});

// ===============================
// ENVIO DE SUGESTÃO (simples)
// ===============================
function enviarSugestao() {
  const texto = document.getElementById("texto-sugestao").value.trim();

  // ⏱️ Delay mínimo entre envios (ex: 5 minutos)
  const ultimoEnvio = localStorage.getItem("ultimoEnvioSugestao");
  const agora = Date.now();
  const delay = 5 * 60 * 1000;

  if (ultimoEnvio && agora - ultimoEnvio < delay) {
    mostrarMensagem(
      "Você já enviou uma sugestão recentemente. Aguarde alguns minutos.",
    );
    return;
  }

  if (!texto) {
    mostrarMensagem("Digite sua sugestão antes de enviar.");
    return;
  }

  const params = {
    message: texto,
    time: new Date().toLocaleString("pt-BR"),
  };

  emailjs
    .send("service_eze6jpu", "template_1hgswqi", params)
    .then(() => {
      localStorage.setItem("ultimoEnvioSugestao", Date.now()); // 👈 grava o envio

      mostrarMensagem("Sua sugestão foi enviada com sucesso!");
      sugestaoEnviada = true;
      fecharModal("sugestoes");
    })
    .catch(() => {
      mostrarMensagem("Erro ao enviar sugestão. Tente novamente.");
    });
}

// ===============================
// Exporta funções para testes unitários
// ===============================
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    abrirModal,
    fecharModal,
    retornoAlerta,
    confirmarAcao,
    cancelarAcao,
    retornoSucesso,
    retornoErro,
    desabilitarBotao,
    verificarTodosDesabilitados,
    resetarCamposModal,
    resetarPagina,
    enviarSugestao,
    abrirModal,
  };
}
