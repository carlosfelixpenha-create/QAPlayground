/**
 * @jest-environment jsdom
 *
 * Testes de integração para formulario-3.js
 */

const { executarFormulario3 } = require("../../js/formulario-3.js");

/**
 * Helpers
 */
function setArquivo(id, nome, tipo) {
  const file = new File(["conteudo"], nome, { type: tipo });
  Object.defineProperty(document.getElementById(id), "files", {
    value: [file],
    configurable: true,
  });
}

function preencherLocalizacaoCompleta() {
  document.getElementById("pais").value = "brasil";
  document.getElementById("estado").value = "sp";
  document.getElementById("cidade").value = "campinas";
}

function preencherTodosArquivosValidos() {
  setArquivo("arquivoPdf", "teste.pdf", "application/pdf");
  setArquivo(
    "arquivoDocx",
    "teste.docx",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  );
  setArquivo("arquivoJpg", "teste.jpg", "image/jpeg");
  setArquivo(
    "arquivoXlsx",
    "teste.xlsx",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
  setArquivo("arquivoTxt", "teste.txt", "text/plain");
}

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

    <form>
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
        <option value="sp">São Paulo</option>
      </select>

      <select id="cidade">
        <option value="">Selecione...</option>
        <option value="campinas">Campinas</option>
      </select>
    </form>
  `;
});

describe("Formulário 3 - Fluxos inválidos", () => {
  test("Erro parcial - nenhum arquivo selecionado", () => {
    executarFormulario3({ preventDefault: jest.fn() });

    expect(document.getElementById("modalMensagemErro").style.display).not.toBe(
      "none",
    );

    expect(document.getElementById("modalTextoErro").textContent).toMatch(
      /inválidos/i,
    );
  });

  test("Erro parcial - localização incompleta", () => {
    document.getElementById("pais").value = "brasil";

    executarFormulario3({ preventDefault: jest.fn() });

    expect(document.getElementById("modalMensagemErro").style.display).not.toBe(
      "none",
    );
  });
});

describe("Formulário 3 - Fluxo válido completo", () => {
  test("Sucesso total com todos os dados válidos", () => {
    preencherLocalizacaoCompleta();
    preencherTodosArquivosValidos();

    executarFormulario3({ preventDefault: jest.fn() });

    expect(document.getElementById("modalMensagem").style.display).not.toBe(
      "none",
    );

    expect(document.getElementById("modalTexto").textContent).toMatch(
      /sucesso/i,
    );
  });
});

describe("Formulário 3 - Estado após envio bem-sucedido", () => {
  test("Campos devem ser resetados corretamente", () => {
    preencherLocalizacaoCompleta();
    preencherTodosArquivosValidos();

    executarFormulario3({ preventDefault: jest.fn() });

    expect(document.getElementById("arquivoPdf").value).toBe("");
    expect(document.getElementById("pais").value).toBe("");
    expect(document.getElementById("estado").innerHTML).toContain("Selecione");
    expect(document.getElementById("cidade").innerHTML).toContain("Selecione");
  });
});
