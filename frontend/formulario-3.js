// Estrutura de dados: País -> Estados -> Cidades
const dadosLocalizacao = {
  brasil: {
    pr: { label: "Paraná", cidades: ["Curitiba", "Matinhos"] },
    sp: { label: "São Paulo", cidades: ["São Paulo", "Campinas", "Santos"] },
    rj: { label: "Rio de Janeiro", cidades: ["Rio de Janeiro", "Niterói"] }
  },
  portugal: {
    lisboa: { label: "Lisboa", cidades: ["Lisboa", "Sintra"] },
    porto: { label: "Porto", cidades: ["Porto", "Gaia"] }
  },
  eua: {
    ny: { label: "Nova Iorque", cidades: ["Nova Iorque", "Buffalo"] },
    ca: { label: "Califórnia", cidades: ["Los Angeles", "San Francisco"] }
  }
};

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
      Object.entries(dadosLocalizacao[pais]).forEach(([estadoKey, estadoObj]) => {
        const opt = document.createElement("option");
        opt.value = estadoKey;
        opt.textContent = estadoObj.label;
        estadoSelect.appendChild(opt);
      });
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
});

// Validação e envio
function executarFormulario3(event) {
  event.preventDefault();

  const arquivoPdf = document.getElementById('arquivoPdf').files[0];
  const arquivoDocx = document.getElementById('arquivoDocx').files[0];
  const arquivoJpg = document.getElementById('arquivoJpg').files[0];

  if (!arquivoPdf || !arquivoDocx || !arquivoJpg) {
    alert("Todos os arquivos (PDF, DOCX e JPG) devem ser selecionados.");
    return;
  }

  if (arquivoPdf.type !== "application/pdf") {
    alert("Somente arquivos PDF são permitidos.");
    return;
  }
  if (arquivoDocx.type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    alert("Somente arquivos DOCX são permitidos.");
    return;
  }
  if (arquivoJpg.type !== "image/jpeg") {
    alert("Somente arquivos JPG são permitidos.");
    return;
  }

  const paisSelect = document.getElementById('pais');
  const estadoSelect = document.getElementById('estado');
  const cidadeSelect = document.getElementById('cidade');

  if (!paisSelect.value || !estadoSelect.value || !cidadeSelect.value) {
    alert("Preencha corretamente os campos de País, Estado e Cidade.");
    return;
  }

  // Aqui usamos o texto visível, não o value
  const pais = paisSelect.options[paisSelect.selectedIndex].text;
  const estado = estadoSelect.options[estadoSelect.selectedIndex].text;
  const cidade = cidadeSelect.options[cidadeSelect.selectedIndex].text;

  alert(
    `Formulário enviado com sucesso!\n\n` +
    `PDF: ${arquivoPdf.name}\n` +
    `DOCX: ${arquivoDocx.name}\n` +
    `JPG: ${arquivoJpg.name}\n` +
    `País: ${pais}\n` +
    `Estado: ${estado}\n` +
    `Cidade: ${cidade}`
  );
}