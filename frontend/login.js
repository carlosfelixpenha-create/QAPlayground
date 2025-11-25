function executarLogin(event) {
  event.preventDefault(); // evita recarregar a página

  const usuario = document.getElementById('usuario').value;
  const senha = document.getElementById('senha').value;
  const captcha = document.getElementById('captcha'); // pega o checkbox

  if (!usuario || !senha) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  if (!captcha.checked) {
    alert("Por favor, confirme que você é humano antes de continuar.");
    return;
  }

  // Se passou em todas as validações
  alert(`Login realizado com sucesso!\nUsuário: ${usuario}`);
}