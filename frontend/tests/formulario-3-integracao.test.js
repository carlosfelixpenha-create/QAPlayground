/**
 * @jest-environment jsdom
 *
 * Testes de integração para formulario-3.js
 */

const { executarFormulario3, mostrarModal } = require("../formulario-3");

beforeEach(() => {
  document.body.innerHTML = `
    <div id="modalMensagem" style="display:none"></div>
    <div id="modalTexto"></div>
    <button id="modalFechar"></button>
    <button id="modalOk"></button>
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

describe("Integração completa do Formulário 3", () => {
  test("Cenário 1 - Erro parcial (nenhum arquivo selecionado)", () => {
    const event = { preventDefault: jest.fn() };
    executarFormulario3(event);

    expect(document.getElementById("modalTexto").textContent).toContain(
      "Existem campos inválidos"
    );
    expect(
      document.getElementById("arquivoPdf").classList.contains("erro")
    ).toBe(true);
  });

  test("Cenário 2 - Erro parcial (localização incompleta)", () => {
    document.getElementById("pais").value = "brasil";

    const event = { preventDefault: jest.fn() };
    executarFormulario3(event);

    expect(document.getElementById("modalTexto").textContent).toContain(
      "Existem campos inválidos"
    );
    expect(document.getElementById("pais").classList.contains("sucesso")).toBe(
      true
    );
    expect(document.getElementById("estado").classList.contains("erro")).toBe(
      true
    );
    expect(document.getElementById("cidade").classList.contains("erro")).toBe(
      true
    );
  });

  test("Cenário 3 - Sucesso total", () => {
    document.getElementById("pais").value = "brasil";
    document.getElementById("estado").value = "sp";
    document.getElementById("cidade").value = "campinas";

    // Simula arquivos válidos
    const fakePdf = new File(["conteudo"], "teste.pdf", {
      type: "application/pdf",
    });
    Object.defineProperty(document.getElementById("arquivoPdf"), "files", {
      value: [fakePdf],
    });

    const fakeDocx = new File(["conteudo"], "teste.docx", {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    Object.defineProperty(document.getElementById("arquivoDocx"), "files", {
      value: [fakeDocx],
    });

    const fakeJpg = new File(["conteudo"], "teste.jpg", { type: "image/jpeg" });
    Object.defineProperty(document.getElementById("arquivoJpg"), "files", {
      value: [fakeJpg],
    });

    const fakeXlsx = new File(["conteudo"], "teste.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    Object.defineProperty(document.getElementById("arquivoXlsx"), "files", {
      value: [fakeXlsx],
    });

    const fakeTxt = new File(["conteudo"], "teste.txt", { type: "text/plain" });
    Object.defineProperty(document.getElementById("arquivoTxt"), "files", {
      value: [fakeTxt],
    });

    const event = { preventDefault: jest.fn() };
    executarFormulario3(event);

    expect(document.getElementById("modalTexto").textContent).toContain(
      "Formulário enviado com sucesso"
    );
  });

  test("Cenário 4 - Reset após envio", () => {
    document.getElementById("pais").value = "brasil";
    document.getElementById("estado").value = "sp";
    document.getElementById("cidade").value = "campinas";

    const fakePdf = new File(["conteudo"], "teste.pdf", {
      type: "application/pdf",
    });
    Object.defineProperty(document.getElementById("arquivoPdf"), "files", {
      value: [fakePdf],
    });

    const fakeDocx = new File(["conteudo"], "teste.docx", {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    Object.defineProperty(document.getElementById("arquivoDocx"), "files", {
      value: [fakeDocx],
    });

    const fakeJpg = new File(["conteudo"], "teste.jpg", { type: "image/jpeg" });
    Object.defineProperty(document.getElementById("arquivoJpg"), "files", {
      value: [fakeJpg],
    });

    const fakeXlsx = new File(["conteudo"], "teste.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    Object.defineProperty(document.getElementById("arquivoXlsx"), "files", {
      value: [fakeXlsx],
    });

    const fakeTxt = new File(["conteudo"], "teste.txt", { type: "text/plain" });
    Object.defineProperty(document.getElementById("arquivoTxt"), "files", {
      value: [fakeTxt],
    });

    const event = { preventDefault: jest.fn() };
    executarFormulario3(event);

    // Após envio, campos devem ser resetados
    expect(document.getElementById("arquivoPdf").value).toBe("");
    expect(document.getElementById("pais").value).toBe("");
    expect(document.getElementById("estado").innerHTML).toContain(
      "Selecione..."
    );
    expect(document.getElementById("cidade").innerHTML).toContain(
      "Selecione..."
    );
  });
});
