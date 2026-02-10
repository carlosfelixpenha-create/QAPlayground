/**
 * @jest-environment jsdom
 *
 * Testes de integração para formulario-2.js
 * Validam o fluxo completo de envio do formulário
 */

const { executarFormulario2 } = require("../../js/formulario-2.js");

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
      <input type="radio" name="sexo" value="M" id="sexoM" />
      <input type="radio" name="sexo" value="F" id="sexoF" />
      <input type="checkbox" id="interesse1" value="Esporte" />
      <input type="checkbox" id="interesse2" value="Música" />
      <input id="dataNascimento" />
      <input id="telefone" />
      <input id="cpf" />
    </form>
  `;
});

describe("Fluxo de integração - envio do formulário 2", () => {
  test("usuário tenta enviar sem selecionar sexo", () => {
    const event = { preventDefault: jest.fn() };
    executarFormulario2(event);
    expect(document.getElementById("modalTextoErro").textContent).toContain(
      "Sexo",
    );
  });

  test("usuário tenta enviar sem marcar interesses", () => {
    document.getElementById("sexoM").checked = true;
    const event = { preventDefault: jest.fn() };
    executarFormulario2(event);
    expect(document.getElementById("modalTextoErro").textContent).toContain(
      "Interesses",
    );
  });

  test("usuário tenta enviar sem preencher data de nascimento", () => {
    document.getElementById("sexoM").checked = true;
    document.getElementById("interesse1").checked = true;
    const event = { preventDefault: jest.fn() };
    executarFormulario2(event);
    expect(document.getElementById("modalTextoErro").textContent).toContain(
      "Data de Nascimento",
    );
  });

  test("usuário tenta enviar com data futura", () => {
    document.getElementById("sexoM").checked = true;
    document.getElementById("interesse1").checked = true;
    document.getElementById("dataNascimento").value = "2999-01-01";
    document.getElementById("telefone").value = "999999999";
    document.getElementById("cpf").value = "12345678900";

    const event = { preventDefault: jest.fn() };
    executarFormulario2(event);
    expect(document.getElementById("modalTextoErro").textContent).toContain(
      "futura",
    );
  });

  test("usuário tenta enviar com idade menor que 16", () => {
    document.getElementById("sexoM").checked = true;
    document.getElementById("interesse1").checked = true;
    const hoje = new Date();
    const ano = hoje.getFullYear() - 10; // 10 anos
    document.getElementById("dataNascimento").value = `${ano}-01-01`;
    document.getElementById("telefone").value = "999999999";
    document.getElementById("cpf").value = "12345678900";

    const event = { preventDefault: jest.fn() };
    executarFormulario2(event);
    expect(document.getElementById("modalTextoErro").textContent).toContain(
      "16 anos",
    );
  });

  test("usuário envia com dados válidos", () => {
    document.getElementById("sexoM").checked = true;
    document.getElementById("interesse1").checked = true;
    document.getElementById("dataNascimento").value = "2000-01-01";
    document.getElementById("telefone").value = "999999999";
    document.getElementById("cpf").value = "12345678900";

    const event = { preventDefault: jest.fn() };
    executarFormulario2(event);

    expect(document.getElementById("modalTexto").textContent).toContain(
      "sucesso",
    );
    expect(document.getElementById("sexoM").checked).toBe(false);
    expect(document.getElementById("interesse1").checked).toBe(false);
    expect(document.getElementById("telefone").value).toBe("");
    expect(document.getElementById("cpf").value).toBe("");
  });
});
