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

// Função genérica para mostrar modal
function mostrarModal(mensagem) {
  const modal = document.getElementById("modalMensagem");
  const modalTexto = document.getElementById("modalTexto");
  modalTexto.textContent = mensagem;
  modal.style.display = "block";

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

// Validação imediata ao selecionar arquivo
function validarArquivo(input, tipoEsperado, mensagemErro) {
  input.addEventListener("change", () => {
    const arquivo = input.files[0];
    if (arquivo && arquivo.type !== tipoEsperado) {
      mostrarModal(mensagemErro);
      input.classList.add("erro"); // marca campo com erro
    } else {
      input.classList.remove("erro"); // remove erro se corrigido
    }
  });
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

  campos.forEach(({ id, tipo }) => {
    const input = document.getElementById(id);
    const arquivo = input.files[0];
    if (!arquivo || arquivo.type !== tipo) {
      input.classList.add("erro");
      erros.push(id);
    } else {
      input.classList.remove("erro");
    }
  });

  const paisSelect = document.getElementById("pais");
  const estadoSelect = document.getElementById("estado");
  const cidadeSelect = document.getElementById("cidade");

  if (!paisSelect.value || !estadoSelect.value || !cidadeSelect.value) {
    erros.push("localizacao");
  }

  if (erros.length > 0) {
    return mostrarModal(
      "Existem campos inválidos. Revalide os campos destacados em vermelho."
    );
  }

  // Se passou em todas as verificações → sucesso
  mostrarModal("Formulário enviado com sucesso!");

  // Limpar os campos após sucesso
  document.querySelectorAll("input[type='file']").forEach((input) => {
    input.value = "";
    input.classList.remove("erro");
  });
  paisSelect.value = "";
  estadoSelect.innerHTML = '<option value="">Selecione...</option>';
  cidadeSelect.innerHTML = '<option value="">Selecione...</option>';
}
