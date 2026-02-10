/**
 * @jest-environment jsdom
 *
 * Testes unitários para login.js
 * Usando Jest + JSDOM para simular o DOM
 */

const {
  executarLogin,
  mostrarModal,
  inicializarLogin,
} = require("../../js/login.js");

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

  // ✅ Inicializa os listeners manualmente (como no navegador)
  inicializarLogin();
});

describe("Função mostrarModal", () => {
  test("deve exibir mensagem no modal e substituir \\n por <br>", () => {
    mostrarModal("Linha1\nLinha2");
    expect(document.getElementById("modalTexto").innerHTML).toBe(
      "Linha1<br>Linha2",
    );
    expect(document.getElementById("modalMensagem").style.display).toBe("flex");
  });
});

describe("Eventos do modal", () => {
  test("clicar em modalFechar deve esconder o modal", () => {
    mostrarModal("Teste");
    document.getElementById("modalFechar").click();
    expect(document.getElementById("modalMensagem").style.display).toBe("none");
  });

  test("clicar em modalOk deve esconder o modal", () => {
    mostrarModal("Teste");
    document.getElementById("modalOk").click();
    expect(document.getElementById("modalMensagem").style.display).toBe("none");
  });

  test("clicar fora do modal deve esconder o modal", () => {
    const modal = document.getElementById("modalMensagem");
    mostrarModal("Teste");
    const clickEvent = new MouseEvent("click", { bubbles: true });
    Object.defineProperty(clickEvent, "target", { value: modal });
    window.dispatchEvent(clickEvent);
    expect(modal.style.display).toBe("none");
  });
});

describe("Função executarLogin", () => {
  test("deve mostrar erro se usuário vazio", () => {
    document.getElementById("usuario").value = "";
    document.getElementById("senha").value = "Senha1!";
    document.getElementById("captcha").checked = true;

    const event = { preventDefault: jest.fn() };
    executarLogin(event);

    expect(document.getElementById("modalTextoErro").innerHTML).toContain(
      "Usuário",
    );
  });

  test("deve mostrar erro se senha vazia", () => {
    document.getElementById("usuario").value = "carlos@teste.com";
    document.getElementById("senha").value = "";
    document.getElementById("captcha").checked = true;

    const event = { preventDefault: jest.fn() };
    executarLogin(event);

    expect(document.getElementById("modalTextoErro").innerHTML).toContain(
      "Senha",
    );
  });

  test("deve mostrar erro se captcha não marcado", () => {
    document.getElementById("usuario").value = "carlos@teste.com";
    document.getElementById("senha").value = "Senha1!";
    document.getElementById("captcha").checked = false;

    const event = { preventDefault: jest.fn() };
    executarLogin(event);

    expect(document.getElementById("modalTextoErro").innerHTML).toContain(
      "captcha",
    );
  });

  test("deve mostrar erro se não existe cadastro salvo", () => {
    document.getElementById("usuario").value = "carlos@teste.com";
    document.getElementById("senha").value = "Senha1!";
    document.getElementById("captcha").checked = true;

    const event = { preventDefault: jest.fn() };
    executarLogin(event);

    expect(document.getElementById("modalTextoErro").innerHTML).toContain(
      "Nenhum cadastro encontrado",
    );
  });

  test("deve mostrar erro se credenciais incorretas", () => {
    localStorage.setItem(
      "qaplayground_usuario",
      JSON.stringify({
        nome: "Carlos Silva",
        email: "carlos@teste.com",
        senha: "Senha1!",
      }),
    );

    document.getElementById("usuario").value = "carlos@teste.com";
    document.getElementById("senha").value = "SenhaErrada";
    document.getElementById("captcha").checked = true;

    const event = { preventDefault: jest.fn() };
    executarLogin(event);

    expect(document.getElementById("modalTextoErro").innerHTML).toContain(
      "inválidos",
    );
  });

  test("deve mostrar sucesso se credenciais corretas", () => {
    localStorage.setItem(
      "qaplayground_usuario",
      JSON.stringify({
        nome: "Carlos Silva",
        email: "carlos@teste.com",
        senha: "Senha1!",
      }),
    );

    document.getElementById("usuario").value = "carlos@teste.com";
    document.getElementById("senha").value = "Senha1!";
    document.getElementById("captcha").checked = true;

    const event = { preventDefault: jest.fn() };
    executarLogin(event);

    expect(document.getElementById("modalTexto").innerHTML).toContain(
      "sucesso",
    );
  });
});

describe("Toggle de senha", () => {
  test("deve alternar entre password e text", () => {
    const btn = document.getElementById("toggleSenha");
    const input = document.getElementById("senha");

    // Inicialmente password
    expect(input.type).toBe("password");

    btn.click();
    expect(input.type).toBe("text");
    expect(btn.getAttribute("aria-label")).toBe("Ocultar senha");

    btn.click();
    expect(input.type).toBe("password");
    expect(btn.getAttribute("aria-label")).toBe("Mostrar senha");
  });
});
