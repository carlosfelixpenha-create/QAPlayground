/**
 * @jest-environment jsdom
 */

const formulario3 = require("../../js/formulario-3.js");

const {
  executarFormulario3,
  mostrarModal,
  mostrarModalErro,
  validarArquivo,
  validarLocalizacao,
  dadosLocalizacao,
} = formulario3;

beforeEach(() => {
  document.body.innerHTML = `
    <div id="modalMensagem" style="display:none"></div>
    <div id="modalTexto"></div>
    <button id="modalFechar"></button>
    <button id="modalOk"></button>

    <div id="modalMensagemErro" style="display:none"></div>
    <div id="modalTextoErro"></div>
    <button id="modalFecharErro"></button>
    <button id="modalOkErro"></button>

    <input type="file" id="arquivoPdf" />
    <input type="file" id="arquivoDocx" />
    <input type="file" id="arquivoJpg" />
    <input type="file" id="arquivoXlsx" />
    <input type="file" id="arquivoTxt" />

    <select id="pais">
      <option value="">Selecione...</option>
      <option value="brasil">Brasil</option>
    </select>
    <select id="estado">
      <option value="">Selecione...</option>
    </select>
    <select id="cidade">
      <option value="">Selecione...</option>
    </select>
  `;

  document.dispatchEvent(new Event("DOMContentLoaded"));
});

describe("mostrarModalErro", () => {
  test("deve exibir modal de erro corretamente", () => {
    mostrarModalErro("Erro teste");
    expect(document.getElementById("modalTextoErro").textContent).toBe(
      "Erro teste",
    );
    expect(document.getElementById("modalMensagemErro").style.display).toBe(
      "flex",
    );
  });

  test("deve fechar modal de erro ao clicar em OK", () => {
    mostrarModalErro("Erro teste");
    document.getElementById("modalOkErro").click();
    expect(document.getElementById("modalMensagemErro").style.display).toBe(
      "none",
    );
  });
});

describe("validarArquivo", () => {
  test("arquivo inválido deve marcar erro", () => {
    const input = document.getElementById("arquivoPdf");

    validarArquivo(input, "application/pdf", "Erro PDF");

    const fakeFile = new File(["x"], "teste.txt", { type: "text/plain" });
    Object.defineProperty(input, "files", { value: [fakeFile] });

    input.dispatchEvent(new Event("change"));

    expect(input.classList.contains("erro")).toBe(true);
  });

  test("arquivo válido deve marcar sucesso", () => {
    const input = document.getElementById("arquivoPdf");

    validarArquivo(input, "application/pdf", "Erro PDF");

    const fakeFile = new File(["x"], "teste.pdf", {
      type: "application/pdf",
    });
    Object.defineProperty(input, "files", { value: [fakeFile] });

    input.dispatchEvent(new Event("change"));

    expect(input.classList.contains("sucesso")).toBe(true);
  });
});

describe("Localização dinâmica", () => {
  test("dadosLocalizacao deve conter brasil", () => {
    expect(dadosLocalizacao.brasil).toBeDefined();
    expect(dadosLocalizacao.brasil.sp.label).toBe("São Paulo");
  });

  test("validarLocalizacao marca erro quando vazio", () => {
    validarLocalizacao();

    expect(document.getElementById("pais").classList.contains("erro")).toBe(
      true,
    );
    expect(document.getElementById("estado").classList.contains("erro")).toBe(
      true,
    );
    expect(document.getElementById("cidade").classList.contains("erro")).toBe(
      true,
    );
  });

  test("validarLocalizacao marca sucesso quando preenchido", () => {
    document.getElementById("pais").value = "brasil";
    document.getElementById("estado").value = "sp";
    document.getElementById("cidade").value = "campinas";

    validarLocalizacao();

    expect(document.getElementById("pais").classList.contains("sucesso")).toBe(
      true,
    );
  });

  test("deve popular estados ao selecionar país", () => {
    const pais = document.getElementById("pais");
    const estado = document.getElementById("estado");

    pais.value = "brasil";
    pais.dispatchEvent(new Event("change"));

    expect(estado.options.length).toBeGreaterThan(1);
  });

  test("deve popular cidades ao selecionar estado", () => {
    const pais = document.getElementById("pais");
    const estado = document.getElementById("estado");
    const cidade = document.getElementById("cidade");

    pais.value = "brasil";
    pais.dispatchEvent(new Event("change"));

    estado.value = "pr";
    estado.dispatchEvent(new Event("change"));

    expect(cidade.options.length).toBeGreaterThan(1);
  });
});

describe("executarFormulario3", () => {
  test("deve falhar sem arquivos", () => {
    executarFormulario3({ preventDefault: jest.fn() });
    expect(document.getElementById("modalMensagemErro").style.display).toBe(
      "flex",
    );
  });

  test("deve enviar com sucesso com tudo válido", () => {
    document.getElementById("pais").value = "brasil";

    document.getElementById("estado").innerHTML +=
      '<option value="sp">São Paulo</option>';
    document.getElementById("estado").value = "sp";

    document.getElementById("cidade").innerHTML +=
      '<option value="campinas">Campinas</option>';
    document.getElementById("cidade").value = "campinas";

    const arquivos = [
      ["arquivoPdf", "teste.pdf", "application/pdf"],
      [
        "arquivoDocx",
        "teste.docx",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
      ["arquivoJpg", "teste.jpg", "image/jpeg"],
      [
        "arquivoXlsx",
        "teste.xlsx",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ],
      ["arquivoTxt", "teste.txt", "text/plain"],
    ];

    arquivos.forEach(([id, nome, tipo]) => {
      const file = new File(["x"], nome, { type: tipo });
      Object.defineProperty(document.getElementById(id), "files", {
        value: [file],
      });
    });

    executarFormulario3({ preventDefault: jest.fn() });

    // valida reset dos selects
    const pais = document.getElementById("pais");
    const estado = document.getElementById("estado");
    const cidade = document.getElementById("cidade");

    expect(pais.value).toBe("");
    expect(estado.innerHTML).toContain("Selecione...");
    expect(cidade.innerHTML).toContain("Selecione...");

    expect(pais.classList.contains("erro")).toBe(false);
    expect(estado.classList.contains("erro")).toBe(false);
    expect(cidade.classList.contains("erro")).toBe(false);

    expect(pais.classList.contains("sucesso")).toBe(false);
    expect(estado.classList.contains("sucesso")).toBe(false);
    expect(cidade.classList.contains("sucesso")).toBe(false);

    // 🔎 Verificações reais de sucesso
    arquivos.forEach(([id]) => {
      const input = document.getElementById(id);
      expect(input.value).toBe("");
      expect(input.classList.contains("erro")).toBe(false);
      //expect(input.classList.contains("sucesso")).toBe(false);
    });
  });
});
