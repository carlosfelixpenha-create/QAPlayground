/**
 * @jest-environment jsdom
 *
 * Testes de integração para login.js
 * Validam o fluxo completo de login, persistência e modais
 */

// Cria o DOM ANTES de importar login.js
document.body.innerHTML = `
  <div id="modalMensagem" style="display:none"></div>
  <div id="modalTexto"></div>
  <button id="modalFechar"></button>
  <button id="modalOk"></button>
  <form class="form-container">
    <input id="usuario" />
    <input id="senha" type="password" />
    <input id="captcha" type="checkbox" />
    <button id="btnLogin"></button>
  </form>
  <button id="toggleSenha"></button>
`;

const { executarLogin, inicializarLogin } = require("../login");

beforeEach(() => {
  document.body.innerHTML = `
    <div id="modalMensagem" style="display:none"></div>
    <div id="modalTexto"></div>
    <button id="modalFechar"></button>
    <button id="modalOk"></button>
    <form class="form-container">
      <input id="usuario" />
      <input id="senha" type="password" />
      <input id="captcha" type="checkbox" />
      <button id="btnLogin"></button>
    </form>
    <button id="toggleSenha"></button>
  `;

  // Mock localStorage
  const store = {};
  global.localStorage = {
    getItem: (key) => (key in store ? store[key] : null),
    setItem: (key, value) => (store[key] = value),
    removeItem: (key) => delete store[key],
    clear: () => Object.keys(store).forEach((key) => delete store[key]),
  };

  localStorage.clear();

  // Inicializa listeners
  inicializarLogin();
});

describe("Fluxo de integração - login", () => {
  test("usuário tenta logar sem preencher usuário", () => {
    document.getElementById("usuario").value = "";
    document.getElementById("senha").value = "Senha1!";
    document.getElementById("captcha").checked = true;

    const event = { preventDefault: jest.fn() };
    executarLogin(event);

    expect(document.getElementById("modalTexto").innerHTML).toContain(
      "Usuário"
    );
  });

  test("usuário tenta logar sem preencher senha", () => {
    document.getElementById("usuario").value = "carlos@teste.com";
    document.getElementById("senha").value = "";
    document.getElementById("captcha").checked = true;

    const event = { preventDefault: jest.fn() };
    executarLogin(event);

    expect(document.getElementById("modalTexto").innerHTML).toContain("Senha");
  });

  test("usuário tenta logar sem marcar captcha", () => {
    document.getElementById("usuario").value = "carlos@teste.com";
    document.getElementById("senha").value = "Senha1!";
    document.getElementById("captcha").checked = false;

    const event = { preventDefault: jest.fn() };
    executarLogin(event);

    expect(document.getElementById("modalTexto").innerHTML).toContain(
      "captcha"
    );
  });

  test("usuário tenta logar sem cadastro salvo", () => {
    document.getElementById("usuario").value = "carlos@teste.com";
    document.getElementById("senha").value = "Senha1!";
    document.getElementById("captcha").checked = true;

    const event = { preventDefault: jest.fn() };
    executarLogin(event);

    expect(document.getElementById("modalTexto").innerHTML).toContain(
      "Nenhum cadastro encontrado"
    );
  });

  test("usuário tenta logar com credenciais incorretas", () => {
    localStorage.setItem(
      "qaplayground_usuario",
      JSON.stringify({
        nome: "Carlos Silva",
        email: "carlos@teste.com",
        senha: "Senha1!",
      })
    );

    document.getElementById("usuario").value = "carlos@teste.com";
    document.getElementById("senha").value = "SenhaErrada";
    document.getElementById("captcha").checked = true;

    const event = { preventDefault: jest.fn() };
    executarLogin(event);

    expect(document.getElementById("modalTexto").innerHTML).toContain(
      "inválidos"
    );
  });

  test("usuário loga com credenciais corretas", () => {
    localStorage.setItem(
      "qaplayground_usuario",
      JSON.stringify({
        nome: "Carlos Silva",
        email: "carlos@teste.com",
        senha: "Senha1!",
      })
    );

    document.getElementById("usuario").value = "carlos@teste.com";
    document.getElementById("senha").value = "Senha1!";
    document.getElementById("captcha").checked = true;

    const event = { preventDefault: jest.fn() };
    executarLogin(event);

    expect(document.getElementById("modalTexto").innerHTML).toContain(
      "sucesso"
    );
    // formulário deve ser resetado
    expect(document.getElementById("usuario").value).toBe("");
    expect(document.getElementById("senha").value).toBe("");
    expect(document.getElementById("captcha").checked).toBe(false);
  });
});

describe("Fluxo de integração - modal e toggle", () => {
  test("clicar em modalFechar deve esconder o modal", () => {
    document.getElementById("modalMensagem").style.display = "flex";
    document.getElementById("modalFechar").click();
    expect(document.getElementById("modalMensagem").style.display).toBe("none");
  });

  test("clicar em modalOk deve esconder o modal", () => {
    document.getElementById("modalMensagem").style.display = "flex";
    document.getElementById("modalOk").click();
    expect(document.getElementById("modalMensagem").style.display).toBe("none");
  });

  test("toggle de senha deve alternar entre password e text", () => {
    const btn = document.getElementById("toggleSenha");
    const input = document.getElementById("senha");

    expect(input.type).toBe("password");
    btn.click();
    expect(input.type).toBe("text");
    btn.click();
    expect(input.type).toBe("password");
  });
});
