/**
 * @jest-environment jsdom
 *
 * Testes unitários para cadastro.js
 * Usando Jest + JSDOM para simular o DOM
 */

// Cria o DOM ANTES de importar cadastro.js
document.body.innerHTML = `
  <div id="modalMensagem" style="display:none"></div>
  <div id="modalTexto"></div>
  <button id="modalFechar"></button>
  <button id="modalOk"></button>
  <form class="form-container"></form>
  <input id="nome" />
  <input id="email" />
  <input id="senha" />
  <input id="confirmarSenha" />
  <button id="btnCadastrar"></button>
  <button id="btnVerUsuario"></button>
  <button id="btnLimparCadastro"></button>
`;

// Só depois importa o cadastro.js
const {
  validarNome,
  validarEmail,
  validarSenha,
  validarConfirmarSenha,
  salvarUsuarioLocal,
  desabilitarCamposCadastro,
  habilitarCamposCadastro,
  executarCadastro,
  verUsuarioSalvo,
  limparCadastro,
  mostrarModal,
} = require("../cadastro");

// Reset do DOM e mocks antes de cada teste
beforeEach(() => {
  document.body.innerHTML = `
    <div id="modalMensagem" style="display:none"></div>
    <div id="modalTexto"></div>
    <button id="modalFechar"></button>
    <button id="modalOk"></button>
    <form class="form-container"></form>
    <input id="nome" />
    <input id="email" />
    <input id="senha" />
    <input id="confirmarSenha" />
    <button id="btnCadastrar"></button>
    <button id="btnVerUsuario"></button>
    <button id="btnLimparCadastro"></button>
  `;

  // Mock para localStorage
  const store = {};
  global.localStorage = {
    getItem: (key) => store[key],
    setItem: (key, value) => (store[key] = value),
    removeItem: (key) => delete store[key],
    clear: () => Object.keys(store).forEach((key) => delete store[key]),
  };

  // Mock para alert
  global.alert = jest.fn();
});

describe("Funções de validação", () => {
  test("validarNome deve aceitar nome válido", () => {
    expect(validarNome("Carlos Silva")).toBe(true);
  });

  test("validarNome deve rejeitar nome inválido", () => {
    expect(validarNome("Carlos")).toBe(false);
    expect(validarNome("Ca Si")).toBe(false);
    expect(validarNome("Carlos123 Silva")).toBe(false);
  });

  test("validarEmail deve aceitar email válido", () => {
    expect(validarEmail("teste@dominio.com")).toBe(true);
  });

  test("validarEmail deve rejeitar email inválido", () => {
    expect(validarEmail("")).toBe(false);
    expect(validarEmail("teste.com")).toBe(false);
    expect(validarEmail("teste@dominio")).toBe(false);
  });

  test("validarSenha deve aceitar senha válida", () => {
    expect(validarSenha("Teste1!")).toBe(true);
  });

  test("validarSenha deve rejeitar senha inválida", () => {
    expect(validarSenha("teste")).toBe(false);
    expect(validarSenha("Teste123")).toBe(false);
    expect(validarSenha("teste1!")).toBe(false);
  });

  test("validarConfirmarSenha deve aceitar confirmação correta", () => {
    expect(validarConfirmarSenha("Teste1!", "Teste1!")).toBe(true);
  });

  test("validarConfirmarSenha deve rejeitar confirmação incorreta", () => {
    expect(validarConfirmarSenha("Teste1!", "Teste2!")).toBe(false);
    expect(validarConfirmarSenha("Teste1!", "")).toBe(false);
  });
});

describe("Persistência", () => {
  test("salvarUsuarioLocal deve salvar usuário corretamente", () => {
    salvarUsuarioLocal(" Carlos Silva ", " teste@dominio.com ", "Senha1!");
    const usuario = JSON.parse(localStorage.getItem("qaplayground_usuario"));
    expect(usuario.nome).toBe("Carlos Silva");
    expect(usuario.email).toBe("teste@dominio.com");
    expect(usuario.senha).toBe("Senha1!");
  });
});

describe("Controle de campos", () => {
  test("desabilitarCamposCadastro deve desabilitar todos os campos", () => {
    desabilitarCamposCadastro();
    expect(document.getElementById("nome").disabled).toBe(true);
    expect(document.getElementById("email").disabled).toBe(true);
    expect(document.getElementById("senha").disabled).toBe(true);
    expect(document.getElementById("confirmarSenha").disabled).toBe(true);
    expect(document.getElementById("btnCadastrar").disabled).toBe(true);
  });

  test("habilitarCamposCadastro deve habilitar todos os campos", () => {
    desabilitarCamposCadastro();
    habilitarCamposCadastro();
    expect(document.getElementById("nome").disabled).toBe(false);
    expect(document.getElementById("email").disabled).toBe(false);
    expect(document.getElementById("senha").disabled).toBe(false);
    expect(document.getElementById("confirmarSenha").disabled).toBe(false);
    expect(document.getElementById("btnCadastrar").disabled).toBe(false);
  });
});
