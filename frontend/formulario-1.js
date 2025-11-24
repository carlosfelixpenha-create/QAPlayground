function executarEndereco(event) {
  event.preventDefault();
  const logradouro = document.getElementById('logradouro').value;
  const numero = document.getElementById('numero').value;
  const bairro = document.getElementById('bairro').value;
  const cidade = document.getElementById('cidade').value;
  const estado = document.getElementById('estado').value;
  const cep = document.getElementById('cep').value;

  if (logradouro && numero && bairro && cidade && estado && cep) {
    alert(`Endereço cadastrado com sucesso!\n${logradouro}, ${numero} - ${bairro}, ${cidade}/${estado}\nCEP: ${cep}`);
  } else {
    alert("Por favor, preencha todos os campos obrigatórios.");
  }
}