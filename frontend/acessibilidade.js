// acessibilidade.js

// Função para falar texto em áudio (Web Speech API)
function falar(texto) {
  const utterance = new SpeechSynthesisUtterance(texto);
  speechSynthesis.speak(utterance);
}

// Validação de senha com feedback textual e visual
function validarSenha() {
  const senha = document.getElementById('senha').value;
  const retorno = document.getElementById('retorno-senha');

  if (senha === "1234") {
    retorno.textContent = "Senha válida!";
    retorno.style.color = "green";
  } else {
    retorno.textContent = "Senha inválida!";
    retorno.style.color = "red";
  }
}

// Resetar a página (recarregar)
function resetarPagina() {
  location.reload();
}