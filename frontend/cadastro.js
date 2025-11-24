function executarCadastro(event) {
  event.preventDefault(); // evita recarregar a página
  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;
  const confirmarSenha = document.getElementById('confirmarSenha').value;

  if (nome && email && senha && confirmarSenha) {
    if (senha === confirmarSenha) {
      alert(`Cadastro realizado com sucesso!\nNome: ${nome}\nE-mail: ${email}`);
    } else {
      alert("As senhas não conferem. Por favor, digite novamente.");
    }
  } else {
    alert("Por favor, preencha todos os campos.");
  }
}