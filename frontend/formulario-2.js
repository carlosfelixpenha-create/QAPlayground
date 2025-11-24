function executarFormulario2(event) {
  event.preventDefault();

  const sexo = document.querySelector('input[name="sexo"]:checked')?.value;
  const interesses = [];
  document.querySelectorAll('input[type="checkbox"]:checked').forEach(el => interesses.push(el.value));

  const dataNascimento = document.getElementById('dataNascimento').value;
  const telefone = document.getElementById('telefone').value;
  const cpf = document.getElementById('cpf').value;

  if (sexo && dataNascimento && telefone && cpf) {
    alert(`Formulário enviado!\nSexo: ${sexo}\nInteresses: ${interesses.join(", ")}\nData: ${dataNascimento}\nTelefone: ${telefone}\nCPF: ${cpf}`);
  } else {
    alert("Por favor, preencha todos os campos obrigatórios.");
  }
}