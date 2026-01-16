/**
 * @jest-environment jsdom
 *
 * Testes de integração para cadastro.js
 * Validam o fluxo completo de cadastro, persistência e modais
 */

// Cria o DOM ANTES de importar cadastro.js
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
    <input id="nome" />
    <input id="email" />
    <input id="senha" />
    <input id="confirmarSenha" />
    <button id="btnCadastrar"></button>
  </form>
  <button id="btnVerUsuario" style="display:none"></button>
  <button id="btnLimparCadastro" style="display:none"></button>
`;

// Só depois importa o cadastro.js
const {
  executarCadastro,
  verUsuarioSalvo,
  limparCadastro,
} = require("../js/cadastro.js");

// Reset do DOM e mocks antes de cada teste
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
      <input id="nome" />
      <input id="email" />
      <input id="senha" />
      <input id="confirmarSenha" />
      <button id="btnCadastrar"></button>
    </form>
    <button id="btnVerUsuario" style="display:none"></button>
    <button id="btnLimparCadastro" style="display:none"></button>
  `;

  // Mock localStorage
  const store = {};
  global.localStorage = {
    getItem: (key) => (key in store ? store[key] : null),
    setItem: (key, value) => (store[key] = value),
    removeItem: (key) => delete store[key],
    clear: () => Object.keys(store).forEach((key) => delete store[key]),
  };

  // Mock alert
  global.alert = jest.fn();

  // Limpa storage antes de cada teste
  localStorage.clear();
});

describe("Fluxo de integração - cadastro", () => {
  test("usuário realiza cadastro válido", () => {
    document.getElementById("nome").value = "Carlos Silva";
    document.getElementById("email").value = "carlos@teste.com";
    document.getElementById("senha").value = "Senha1!";
    document.getElementById("confirmarSenha").value = "Senha1!";

    const event = { preventDefault: jest.fn() };
    executarCadastro(event);

    const modalTexto = document.getElementById("modalTexto").innerHTML;
    expect(modalTexto).toContain("Cadastro realizado com sucesso!");

    const usuario = JSON.parse(localStorage.getItem("qaplayground_usuario"));
    expect(usuario.nome).toBe("Carlos Silva");
    expect(usuario.email).toBe("carlos@teste.com");

    expect(document.getElementById("btnVerUsuario").style.display).toBe(
      "inline-block"
    );
    expect(document.getElementById("btnLimparCadastro").style.display).toBe(
      "inline-block"
    );
  });

  test("usuário tenta cadastrar com email inválido", () => {
    document.getElementById("nome").value = "Carlos Silva";
    document.getElementById("email").value = "email-invalido";
    document.getElementById("senha").value = "Senha1!";
    document.getElementById("confirmarSenha").value = "Senha1!";

    const event = { preventDefault: jest.fn() };
    executarCadastro(event);

    const modalTextoErro = document.getElementById("modalTextoErro").innerHTML;
    expect(modalTextoErro).toContain("Preencher corretamente o campo E-mail");
    expect(localStorage.getItem("qaplayground_usuario")).toBeNull();
  });

  test("usuário tenta cadastrar com senhas diferentes", () => {
    document.getElementById("nome").value = "Carlos Silva";
    document.getElementById("email").value = "carlos@teste.com";
    document.getElementById("senha").value = "Senha1!";
    document.getElementById("confirmarSenha").value = "Senha2!";

    const event = { preventDefault: jest.fn() };
    executarCadastro(event);

    const modalTextoErro = document.getElementById("modalTextoErro").innerHTML;
    expect(modalTextoErro).toContain("As senhas não conferem");
    expect(localStorage.getItem("qaplayground_usuario")).toBeNull();
  });
});

describe("Fluxo de integração - ver e limpar usuário", () => {
  test("usuário visualiza cadastro salvo", () => {
    localStorage.setItem(
      "qaplayground_usuario",
      JSON.stringify({
        nome: "Carlos Silva",
        email: "carlos@teste.com",
        senha: "Senha1!",
      })
    );

    verUsuarioSalvo();

    const modalTexto = document.getElementById("modalTexto").innerHTML;
    expect(modalTexto).toContain("Usuário salvo:");
    expect(modalTexto).toContain("Carlos Silva");
    expect(modalTexto).toContain("carlos@teste.com");
  });

  test("usuário limpa cadastro", () => {
    localStorage.setItem(
      "qaplayground_usuario",
      JSON.stringify({
        nome: "Carlos Silva",
        email: "carlos@teste.com",
        senha: "Senha1!",
      })
    );

    limparCadastro();

    expect(localStorage.getItem("qaplayground_usuario")).toBeNull();
    const modalTexto = document.getElementById("modalTexto").innerHTML;
    expect(modalTexto).toContain("Cadastro removido do armazenamento local.");
    expect(document.getElementById("btnVerUsuario").style.display).toBe("none");
    expect(document.getElementById("btnLimparCadastro").style.display).toBe(
      "none"
    );
  });
});
