// Lista de UFs válidas
const ufsValidas = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
];

// Função principal de cadastro de endereço
function executarEndereco(event) {
  if (event) event.preventDefault();

  const logradouro = document.getElementById("logradouro").value.trim();
  const numero = document.getElementById("numero").value.trim();
  const complemento = document.getElementById("complemento").value.trim();
  const bairro = document.getElementById("bairro").value.trim();
  const cidade = document.getElementById("cidade").value.trim();
  let estado = document.getElementById("estado").value.trim();
  let cep = document.getElementById("cep").value.trim();

  // Remove o traço para validar CEP
  const cepLimpo = cep.replace("-", "");

  // Verificação inicial de campos obrigatórios
  const obrigatorios = [
    { id: "logradouro", nome: "Logradouro", valor: logradouro },
    { id: "numero", nome: "Número", valor: numero },
    { id: "bairro", nome: "Bairro", valor: bairro },
    { id: "cidade", nome: "Cidade", valor: cidade },
    { id: "estado", nome: "Estado", valor: estado },
    { id: "cep", nome: "CEP", valor: cep },
  ];

  const vazio = obrigatorios.find((c) => !c.valor);
  if (vazio) {
    document.getElementById(vazio.id).focus();
    return mostrarModal(
      `Preencher corretamente o campo ${vazio.nome}, dúvida entrar em requisitos!`
    );
  }

  // Validações específicas conforme requisitos
  if (/^\d+$/.test(logradouro)) {
    document.getElementById("logradouro").focus();
    return mostrarModal(
      "Preencher corretamente o campo Logradouro, dúvida entrar em requisitos!"
    );
  }
  if (/\D/.test(numero)) {
    document.getElementById("numero").focus();
    return mostrarModal(
      "Preencher corretamente o campo Número, dúvida entrar em requisitos!"
    );
  }
  if (bairro.length < 3) {
    document.getElementById("bairro").focus();
    return mostrarModal(
      "Preencher corretamente o campo Bairro, dúvida entrar em requisitos!"
    );
  }
  if (cidade.length < 3) {
    document.getElementById("cidade").focus();
    return mostrarModal(
      "Preencher corretamente o campo Cidade, dúvida entrar em requisitos!"
    );
  }

  // Validação do Estado (UF)
  if (estado.length !== 2) {
    document.getElementById("estado").focus();
    return mostrarModal(
      "Preencher corretamente o campo Estado, dúvida entrar em requisitos!"
    );
  }
  const estadoUpper = estado.toUpperCase();
  if (!ufsValidas.includes(estadoUpper)) {
    document.getElementById("estado").focus();
    return mostrarModal(
      "UF inválida! Preencher corretamente o campo Estado, dúvida entrar em requisitos!"
    );
  }
  // Atualiza o campo com a versão maiúscula
  document.getElementById("estado").value = estadoUpper;

  // Validação do CEP
  if (!/^\d{8}$/.test(cepLimpo)) {
    document.getElementById("cep").focus();
    return mostrarModal(
      "Preencher corretamente o campo CEP, dúvida entrar em requisitos!"
    );
  }

  // Se passou nas validações, salvar no localStorage
  const endereco = {
    logradouro,
    numero,
    complemento,
    bairro,
    cidade,
    estado: estadoUpper,
    cep,
  };
  localStorage.setItem("endereco", JSON.stringify(endereco));

  mostrarModal("Endereço cadastrado com sucesso!");

  // Desabilitar e limpar campos + botão salvar
  document.querySelectorAll("input").forEach((input) => {
    input.disabled = true;
    input.value = ""; // limpa o conteúdo
  });
  document.getElementById("btnSalvar").disabled = true;

  // Mostrar botões de QA
  document.getElementById("btnVerEndereco").style.display = "inline-block";
  document.getElementById("btnLimparEndereco").style.display = "inline-block";
}

// Função para ver endereço salvo
function verEnderecoSalvo() {
  const enderecoSalvo = localStorage.getItem("endereco");
  if (enderecoSalvo) {
    const e = JSON.parse(enderecoSalvo);
    mostrarModal(
      `Endereço salvo:\n${e.logradouro}, ${e.numero} - ${e.bairro}, ${e.cidade}/${e.estado}\nCEP: ${e.cep}`
    );
  } else {
    mostrarModal("Nenhum endereço salvo.");
  }
}

// Função para limpar endereço
function limparEndereco() {
  localStorage.removeItem("endereco");

  // Reabilitar campos e botão salvar
  document.querySelectorAll("input").forEach((input) => {
    input.disabled = false;
    input.value = "";
  });
  document.getElementById("btnSalvar").disabled = false;

  // Ocultar botões de QA
  document.getElementById("btnVerEndereco").style.display = "none";
  document.getElementById("btnLimparEndereco").style.display = "none";

  mostrarModal("Cadastro de endereço limpo com sucesso!");
}

// Função genérica para mostrar modal
function mostrarModal(mensagem) {
  const modal = document.getElementById("modalMensagem");
  const modalTexto = document.getElementById("modalTexto");
  modalTexto.textContent = mensagem;
  modal.style.display = "block";

  // Botão OK fecha modal
  document.getElementById("modalOk").onclick = () => {
    modal.style.display = "none";
  };
  document.getElementById("modalFechar").onclick = () => {
    modal.style.display = "none";
  };
}

// Função de máscara para CEP
function mascaraCep(input) {
  let valor = input.value.replace(/\D/g, ""); // só números
  if (valor.length > 5) {
    input.value = valor.substring(0, 5) + "-" + valor.substring(5, 8);
  } else {
    input.value = valor;
  }
}
// Exporta funções para os testes
module.exports = {
  executarEndereco,
  verEnderecoSalvo,
  limparEndereco,
  mostrarModal,
  mascaraCep,
};
