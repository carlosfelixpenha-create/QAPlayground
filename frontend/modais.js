// modais.js

// ===============================
// Funções principais de abrir/fechar
// ===============================
function abrirModal(tipo) {
  const modal = document.getElementById("modal-" + tipo);
  if (modal) {
    modal.style.display = "block";
  }
}

function fecharModal(tipo) {
  const modal = document.getElementById("modal-" + tipo);
  if (modal) {
    modal.style.display = "none";
  }
}

// Fecha modal ao clicar fora
window.onclick = function(event) {
  const modais = document.getElementsByClassName("modal");
  for (let i = 0; i < modais.length; i++) {
    if (event.target == modais[i]) {
      modais[i].style.display = "none";
    }
  }
};

// ===============================
// Retornos dos modais + desabilitar botões
// ===============================

// Alerta
function retornoAlerta() {
  fecharModal("alerta");
  document.getElementById("retorno-alerta").innerText = "Usuário visualizou o alerta.";
  desabilitarBotao("alerta");
}

// Confirmação
function confirmarAcao() {
  fecharModal("confirmacao");
  document.getElementById("retorno-confirmacao").innerText = "Usuário confirmou a ação!";
  desabilitarBotao("confirmacao");
}

function cancelarAcao() {
  fecharModal("confirmacao");
  document.getElementById("retorno-confirmacao").innerText = "Usuário cancelou a ação.";
  desabilitarBotao("confirmacao");
}

// Sucesso
function retornoSucesso() {
  fecharModal("sucesso");
  document.getElementById("retorno-sucesso").innerText = "Usuário fechou o modal de sucesso.";
  desabilitarBotao("sucesso");
}

// Erro
function retornoErro() {
  fecharModal("erro");
  document.getElementById("retorno-erro").innerText = "Usuário fechou o modal de erro.";
  desabilitarBotao("erro");
}

// ===============================
// Funções auxiliares
// ===============================
function desabilitarBotao(tipo) {
  // pega o botão que abre o modal
  const btn = document.querySelector(`button[onclick="abrirModal('${tipo}')"]`);
  if (btn) {
    btn.disabled = true;
    btn.classList.add("btn-disabled");
  }
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
  }

  // Reabilita todos os botões
  const botoes = document.querySelectorAll(".demo-actions button");
  botoes.forEach(btn => {
    btn.disabled = false;
    btn.classList.remove("btn-disabled");
  });

  // Feedback visual na página
  const resetInfo = document.createElement("p");
  resetInfo.className = "retorno";
  resetInfo.innerText = "Página de modais resetada!";
  document.querySelector(".form-container").appendChild(resetInfo);

  // Remove mensagem após alguns segundos
  setTimeout(() => {
    resetInfo.remove();
  }, 3000);
}