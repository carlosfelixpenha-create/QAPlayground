function executarFormulario2(event) {
  event.preventDefault();

  const sexo = document.querySelector('input[name="sexo"]:checked')?.value;
  const interesses = [];
  document
    .querySelectorAll('input[type="checkbox"]:checked')
    .forEach((el) => interesses.push(el.value));

  const dataNascimento = document.getElementById("dataNascimento").value.trim();
  const telefone = document.getElementById("telefone").value.trim();
  const cpf = document.getElementById("cpf").value.trim();

  // Verificação de obrigatórios
  if (!sexo) {
    return mostrarModalErro(
      "Preencher corretamente o campo Sexo, dúvida entrar em requisitos!",
    );
  }
  if (interesses.length === 0) {
    return mostrarModalErro(
      "Selecione ao menos uma opção em Interesses, dúvida entrar em requisitos!",
    );
  }
  if (!dataNascimento) {
    return mostrarModalErro(
      "Preencher corretamente o campo Data de Nascimento, dúvida entrar em requisitos!",
    );
  }
  if (!telefone) {
    return mostrarModalErro(
      "Preencher corretamente o campo Telefone, dúvida entrar em requisitos!",
    );
  }
  if (!cpf) {
    return mostrarModalErro(
      "Preencher corretamente o campo CPF, dúvida entrar em requisitos!",
    );
  }

  // Validação da idade mínima (16 anos) e evitar datas futuras
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);

  if (nascimento > hoje) {
    return mostrarModalErro("Data de Nascimento não pode ser futura!");
  }

  const idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();
  const dia = hoje.getDate() - nascimento.getDate();

  let idadeFinal = idade;
  if (mes < 0 || (mes === 0 && dia < 0)) {
    idadeFinal--; // ainda não fez aniversário este ano
  }

  if (idadeFinal < 16) {
    return mostrarModalErro("Idade mínima permitida é de 16 anos!");
  }

  // Se passou em todas as verificações
  mostrarModal("Formulário enviado com sucesso!");

  // Limpar os campos após sucesso
  document.querySelectorAll("input").forEach((input) => {
    if (input.type === "radio" || input.type === "checkbox") {
      input.checked = false;
    } else {
      input.value = "";
    }
  });
}

// Função genérica para mostrar modal de sucesso/rápida
function mostrarModal(mensagem) {
  const modal = document.getElementById("modalMensagem");
  const modalTexto = document.getElementById("modalTexto");
  modalTexto.textContent = mensagem;
  modal.style.display = "flex";

  document.getElementById("modalOk").onclick = () => {
    modal.style.display = "none";
  };
  document.getElementById("modalFechar").onclick = () => {
    modal.style.display = "none";
  };
}

// Função genérica para mostrar modal de erro/detalhada
function mostrarModalErro(mensagem) {
  const modal = document.getElementById("modalMensagemErro");
  const modalTexto = document.getElementById("modalTextoErro");
  modalTexto.textContent = mensagem;
  modal.style.display = "flex";

  document.getElementById("modalOkErro").onclick = () => {
    modal.style.display = "none";
  };
  document.getElementById("modalFecharErro").onclick = () => {
    modal.style.display = "none";
  };
}

// Exporta funções para os testes
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    executarFormulario2,
    mostrarModal,
    mostrarModalErro,
  };
}
