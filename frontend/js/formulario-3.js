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
  };
}

// Validação imediata ao selecionar arquivo
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

// Validação imediata da localização
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

  if (paisSelect.value && estadoSelect.value && cidadeSelect.value) {
    mostrarModal("Localização selecionada corretamente!");
  }
}

// DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  const paisSelect = document.getElementById("pais");
  const estadoSelect = document.getElementById("estado");
  const cidadeSelect = document.getElementById("cidade");

  // País → Estados
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
        },
      );
    }

    validarLocalizacao();
  });

  // Estado → Cidades
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

  // Cidade → validação final
  cidadeSelect.addEventListener("change", validarLocalizacao);

  // Validação dos arquivos
  validarArquivo(
    document.getElementById("arquivoPdf"),
    "application/pdf",
    "Campo para arquivo PDF, dúvidas entrar em requisitos!",
  );

  validarArquivo(
    document.getElementById("arquivoDocx"),
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "Campo para arquivo DOCX, dúvidas entrar em requisitos!",
  );

  validarArquivo(
    document.getElementById("arquivoJpg"),
    "image/jpeg",
    "Campo para arquivo JPG, dúvidas entrar em requisitos!",
  );

  validarArquivo(
    document.getElementById("arquivoXlsx"),
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "Campo para arquivo XLSX, dúvidas entrar em requisitos!",
  );

  validarArquivo(
    document.getElementById("arquivoTxt"),
    "text/plain",
    "Campo para arquivo TXT, dúvidas entrar em requisitos!",
  );
});

// Submit do formulário
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

  if (erros.length > 0) {
    return mostrarModalErro(
      "Existem campos inválidos. Revalide os campos destacados em vermelho.",
    );
  }

  mostrarModal("Formulário enviado com sucesso!");

  document.querySelectorAll("input[type='file']").forEach((input) => {
    input.value = "";
    input.classList.remove("erro", "sucesso");
  });

  paisSelect.value = "";
  estadoSelect.innerHTML = '<option value="">Selecione...</option>';
  cidadeSelect.innerHTML = '<option value="">Selecione...</option>';

  paisSelect.classList.remove("erro", "sucesso");
  estadoSelect.classList.remove("erro", "sucesso");
  cidadeSelect.classList.remove("erro", "sucesso");
}

// Exports APENAS para testes (não afeta browser)
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    executarFormulario3,
    mostrarModal,
    mostrarModalErro,
    validarArquivo,
    validarLocalizacao,
    dadosLocalizacao,
  };
}
