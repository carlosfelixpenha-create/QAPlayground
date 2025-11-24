function executarLogin(event) {
  event.preventDefault(); // evita recarregar a página
  const usuario = document.getElementById('nome').value;
  const senha = document.getElementById('senha').value;

  if (usuario && senha) {
    alert(`Login realizado com sucesso!\nUsuário: ${usuario}`);
  } else {
    alert("Por favor, preencha todos os campos.");
  }
}