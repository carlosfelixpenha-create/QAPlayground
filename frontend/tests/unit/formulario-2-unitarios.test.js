/**
 * @jest-environment jsdom
 *
 * Testes unitários para formulario-2.js
 */

// Cria o DOM ANTES de importar formulario-2.js
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

const {
  executarFormulario2,
  mostrarModal,
} = require("../../js/formulario-2.js");

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

describe("Função executarFormulario2", () => {
  test("deve mostrar erro se sexo não selecionado", () => {
    const event = { preventDefault: jest.fn() };
    executarFormulario2(event);
    expect(document.getElementById("modalTextoErro").textContent).toContain(
      "Sexo",
    );
  });

  test("deve mostrar erro se nenhum interesse marcado", () => {
    document.getElementById("sexoM").checked = true;
    const event = { preventDefault: jest.fn() };
    executarFormulario2(event);
    expect(document.getElementById("modalTextoErro").textContent).toContain(
      "Interesses",
    );
  });

  test("deve mostrar erro se data de nascimento vazia", () => {
    document.getElementById("sexoM").checked = true;
    document.getElementById("interesse1").checked = true;
    const event = { preventDefault: jest.fn() };
    executarFormulario2(event);
    expect(document.getElementById("modalTextoErro").textContent).toContain(
      "Data de Nascimento",
    );
  });

  test("deve mostrar erro se telefone vazio", () => {
    document.getElementById("sexoM").checked = true;
    document.getElementById("interesse1").checked = true;
    document.getElementById("dataNascimento").value = "2000-01-01";
    const event = { preventDefault: jest.fn() };
    executarFormulario2(event);
    expect(document.getElementById("modalTextoErro").textContent).toContain(
      "Telefone",
    );
  });

  test("deve mostrar erro se CPF vazio", () => {
    document.getElementById("sexoM").checked = true;
    document.getElementById("interesse1").checked = true;
    document.getElementById("dataNascimento").value = "2000-01-01";
    document.getElementById("telefone").value = "999999999";
    const event = { preventDefault: jest.fn() };
    executarFormulario2(event);
    expect(document.getElementById("modalTextoErro").textContent).toContain(
      "CPF",
    );
  });

  test("deve mostrar erro se data de nascimento futura", () => {
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

  test("deve mostrar erro se idade menor que 16", () => {
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

  test("deve mostrar sucesso se dados válidos", () => {
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

describe("Função mostrarModal", () => {
  test("deve exibir mensagem no modal", () => {
    mostrarModal("Teste de mensagem");
    expect(document.getElementById("modalTexto").textContent).toBe(
      "Teste de mensagem",
    );
    expect(document.getElementById("modalMensagem").style.display).toBe("flex"); // ajustado
  });

  test("deve fechar modal ao clicar em OK", () => {
    mostrarModal("Fechar teste");
    document.getElementById("modalOk").click();
    expect(document.getElementById("modalMensagem").style.display).toBe("none");
  });

  test("deve fechar modal ao clicar em Fechar", () => {
    mostrarModal("Fechar teste");
    document.getElementById("modalFechar").click();
    expect(document.getElementById("modalMensagem").style.display).toBe("none");
  });
});
