// Estrutura de dados: País -> Estados -> Cidades
const dadosLocalizacao = {
  brasil: {
    pr: { label: "Paraná", cidades: ["Curitiba", "Matinhos"] },
    sp: { label: "São Paulo", cidades: ["São Paulo", "Campinas", "Santos"] },
    rj: { label: "Rio de Janeiro", cidades: ["Rio de Janeiro", "Niterói"] },
  },
  portugal: {
    lisboa: { label: "Lisboa", cidades: ["Lisboa", "Sintra"] },
    porto: { label: "Porto", cidades: ["Porto", "Gaia"] },
  },
  eua: {
    ny: { label: "Nova Iorque", cidades: ["Nova Iorque", "Buffalo"] },
    ca: { label: "Califórnia", cidades: ["Los Angeles", "San Francisco"] },
  },
};

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
  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
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
  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
    if (event.target === modalErro) {
      modalErro.style.display = "none";
    }
  };
}

// Validação imediata ao selecionar arquivo (erro = vermelho, sucesso = verde)
function validarArquivo(input, tipoEsperado, mensagemErro) {
  input.addEventListener("change", () => {
    const arquivo = input.files[0];
    if (arquivo && arquivo.type !== tipoEsperado) {
      mostrarModalErro(mensagemErro);
      input.classList.add("erro");
      input.classList.remove("sucesso");
    } else if (arquivo && arquivo.type === tipoEsperado) {
      mostrarModal("Arquivo selecionado corretamente!");
      input.classList.add("sucesso");
      input.classList.remove("erro");
    } else {
      input.classList.remove("erro");
      input.classList.remove("sucesso");
    }
  });
}

// Nova função para validar localização imediatamente
function validarLocalizacao() {
  const paisSelect = document.getElementById("pais");
  const estadoSelect = document.getElementById("estado");
  const cidadeSelect = document.getElementById("cidade");

  [paisSelect, estadoSelect, cidadeSelect].forEach((select) => {
    if (!select.value) {
      select.classList.add("erro");
      select.classList.remove("sucesso");
    } else {
      select.classList.add("sucesso");
      select.classList.remove("erro");
    }
  });

  // Se todos preenchidos corretamente → modal de sucesso
  if (paisSelect.value && estadoSelect.value && cidadeSelect.value) {
    mostrarModal("Localização selecionada corretamente!");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const paisSelect = document.getElementById("pais");
  const estadoSelect = document.getElementById("estado");
  const cidadeSelect = document.getElementById("cidade");

  // Quando muda País -> popular Estados
  paisSelect.addEventListener("change", () => {
    const pais = paisSelect.value;
    estadoSelect.innerHTML = '<option value="">Selecione...</option>';
    cidadeSelect.innerHTML = '<option value="">Selecione...</option>';

    if (pais && dadosLocalizacao[pais]) {
      Object.entries(dadosLocalizacao[pais]).forEach(
        ([estadoKey, estadoObj]) => {
          const opt = document.createElement("option");
          opt.value = estadoKey;
          opt.textContent = estadoObj.label;
          estadoSelect.appendChild(opt);
        }
      );
    }

    validarLocalizacao();
  });

  // Quando muda Estado -> popular Cidades
  estadoSelect.addEventListener("change", () => {
    const pais = paisSelect.value;
    const estado = estadoSelect.value;
    cidadeSelect.innerHTML = '<option value="">Selecione...</option>';

    if (pais && estado && dadosLocalizacao[pais][estado]) {
      dadosLocalizacao[pais][estado].cidades.forEach((cidade) => {
        const opt = document.createElement("option");
        opt.value = cidade.toLowerCase().replace(/\s+/g, "-");
        opt.textContent = cidade;
        cidadeSelect.appendChild(opt);
      });
    }

    validarLocalizacao();
  });

  // Quando muda Cidade -> validar localização
  cidadeSelect.addEventListener("change", () => {
    validarLocalizacao();
  });

  // Configura validação imediata para cada campo
  validarArquivo(
    document.getElementById("arquivoPdf"),
    "application/pdf",
    "Campo para arquivo PDF, dúvidas entrar em requisitos!"
  );
  validarArquivo(
    document.getElementById("arquivoDocx"),
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "Campo para arquivo DOCX, dúvidas entrar em requisitos!"
  );
  validarArquivo(
    document.getElementById("arquivoJpg"),
    "image/jpeg",
    "Campo para arquivo JPG, dúvidas entrar em requisitos!"
  );
  validarArquivo(
    document.getElementById("arquivoXlsx"),
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "Campo para arquivo XLSX, dúvidas entrar em requisitos!"
  );
  validarArquivo(
    document.getElementById("arquivoTxt"),
    "text/plain",
    "Campo para arquivo TXT, dúvidas entrar em requisitos!"
  );
});

// Validação e envio
function executarFormulario3(event) {
  event.preventDefault();

  const campos = [
    { id: "arquivoPdf", tipo: "application/pdf" },
    {
      id: "arquivoDocx",
      tipo: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    },
    { id: "arquivoJpg", tipo: "image/jpeg" },
    {
      id: "arquivoXlsx",
      tipo: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
    { id: "arquivoTxt", tipo: "text/plain" },
  ];

  let erros = [];

  // Validação dos uploads
  campos.forEach(({ id, tipo }) => {
    const input = document.getElementById(id);
    const arquivo = input.files[0];
    if (!arquivo || arquivo.type !== tipo) {
      input.classList.add("erro");
      input.classList.remove("sucesso");
      erros.push(id);
    } else {
      input.classList.add("sucesso");
      input.classList.remove("erro");
    }
  });

  // Validação da localização (cada campo individual)
  const paisSelect = document.getElementById("pais");
  const estadoSelect = document.getElementById("estado");
  const cidadeSelect = document.getElementById("cidade");

  [paisSelect, estadoSelect, cidadeSelect].forEach((select) => {
    if (!select.value) {
      select.classList.add("erro");
      select.classList.remove("sucesso");
      erros.push(select.id);
    } else {
      select.classList.add("sucesso");
      select.classList.remove("erro");
    }
  });

  // Se todos preenchidos corretamente → modal de sucesso da localização
  if (paisSelect.value && estadoSelect.value && cidadeSelect.value) {
    mostrarModal("Localização selecionada corretamente!");
  }

  // Se houver erros → modal de aviso
  if (erros.length > 0) {
    return mostrarModalErro(
      "Existem campos inválidos. Revalide os campos destacados em vermelho."
    );
  }

  // Se passou em todas as verificações → sucesso geral
  mostrarModal("Formulário enviado com sucesso!");

  // Limpar os campos após sucesso
  document.querySelectorAll("input[type='file']").forEach((input) => {
    input.value = "";
    input.classList.remove("erro");
    input.classList.remove("sucesso");
  });
  paisSelect.value = "";
  estadoSelect.innerHTML = '<option value="">Selecione...</option>';
  cidadeSelect.innerHTML = '<option value="">Selecione...</option>';
  paisSelect.classList.remove("erro", "sucesso");
  estadoSelect.classList.remove("erro", "sucesso");
  cidadeSelect.classList.remove("erro", "sucesso");
}

// Exporta funções para uso nos testes unitários
module.exports = {
  executarFormulario3,
  mostrarModal,
};
