/**
 * @jest-environment jsdom
 *
 * Testes unitários para acessibilidade.js
 * Usando Jest + JSDOM para simular o DOM
 */

let validarSenhaLocal;
let atualizarRegrasSenha;
let validarSenhaAcessibilidade;
let resetarPagina;
let inicializarAcessibilidade;
let inicializarToggleSenhaAcessibilidade;

beforeEach(() => {
  document.body.innerHTML = `
    <input id="senha" type="password" />

    <button
      id="toggleSenhaAcessibilidade"
      aria-label="Mostrar senha"
    >
      👁️
    </button>

    <button class="btn-validar"></button>

    <span id="retorno-senha"></span>

    <ul class="regras-senha">
      <li id="regra-maiuscula"><span class="check">☐</span></li>
      <li id="regra-numero"><span class="check">☐</span></li>
      <li id="regra-simbolo"><span class="check">☐</span></li>
      <li id="regra-tamanho"><span class="check">☐</span></li>
    </ul>
  `;

  jest.resetModules();
  const acessibilidade = require("../../js/acessibilidade.js");

  validarSenhaLocal = acessibilidade.validarSenhaLocal;
  atualizarRegrasSenha = acessibilidade.atualizarRegrasSenha;
  validarSenhaAcessibilidade = acessibilidade.validarSenhaAcessibilidade;
  resetarPagina = acessibilidade.resetarPagina;
  inicializarAcessibilidade = acessibilidade.inicializarAcessibilidade;
  inicializarToggleSenhaAcessibilidade =
    acessibilidade.inicializarToggleSenhaAcessibilidade;

  // inicializa listeners explicitamente (controle total no teste)
  inicializarAcessibilidade();
  inicializarToggleSenhaAcessibilidade();
});

describe("Funções de validação de senha", () => {
  test("validarSenhaLocal aceita senha válida", () => {
    expect(validarSenhaLocal("Teste1!")).toBe(true);
  });

  test("validarSenhaLocal rejeita senha inválida", () => {
    expect(validarSenhaLocal("teste")).toBe(false);
    expect(validarSenhaLocal("Teste123")).toBe(false);
    expect(validarSenhaLocal("teste1!")).toBe(false);
    expect(validarSenhaLocal("T1!")).toBe(false);
  });
});

describe("Atualização dinâmica das regras", () => {
  test("marca regra de maiúscula como válida", () => {
    document.getElementById("senha").value = "Teste";
    atualizarRegrasSenha();
    expect(document.getElementById("regra-maiuscula").className).toBe("valida");
  });

  test("mantém regra de número como inválida", () => {
    document.getElementById("senha").value = "Teste";
    atualizarRegrasSenha();
    expect(document.getElementById("regra-numero").className).toBe("");
  });
});

describe("Validação final", () => {
  test("marca senha válida corretamente", () => {
    document.getElementById("senha").value = "Teste1!";
    validarSenhaAcessibilidade();

    expect(document.getElementById("retorno-senha").textContent).toContain(
      "Senha válida",
    );
    expect(document.querySelector(".btn-validar").disabled).toBe(true);
  });

  test("marca senha inválida corretamente", () => {
    document.getElementById("senha").value = "teste";
    validarSenhaAcessibilidade();

    expect(document.getElementById("retorno-senha").textContent).toContain(
      "Senha inválida",
    );
  });
});

describe("Reset da página", () => {
  test("limpa campo, feedback e regras", () => {
    const campoSenha = document.getElementById("senha");
    const retorno = document.getElementById("retorno-senha");
    const btnValidar = document.querySelector(".btn-validar");

    campoSenha.value = "Teste1!";
    retorno.textContent = "Senha inválida!";
    retorno.style.color = "red";
    btnValidar.disabled = true;

    document.getElementById("regra-maiuscula").className = "valida";
    document
      .getElementById("regra-maiuscula")
      .querySelector(".check").textContent = "✔";

    resetarPagina();

    expect(campoSenha.value).toBe("");
    expect(retorno.textContent).toBe("");
    expect(retorno.style.color).toBe("");
    expect(btnValidar.disabled).toBe(false);
    expect(document.getElementById("regra-maiuscula").className).toBe("");
    expect(
      document.getElementById("regra-maiuscula").querySelector(".check")
        .textContent,
    ).toBe("☐");
  });
});

describe("Toggle de visibilidade da senha", () => {
  test("alterna de password para text", () => {
    const campoSenha = document.getElementById("senha");
    const toggleBtn = document.getElementById("toggleSenhaAcessibilidade");

    // força estado inicial password
    campoSenha.type = "password";
    toggleBtn.textContent = "👁️";
    toggleBtn.setAttribute("aria-label", "Mostrar senha");

    toggleBtn.click(); // mostrar senha

    expect(campoSenha.type).toBe("text");
    expect(toggleBtn.textContent.trim()).toBe("🙈");
    expect(toggleBtn.getAttribute("aria-label")).toBe("Ocultar senha");
  });

  test("alterna de text para password", () => {
    const campoSenha = document.getElementById("senha");
    const toggleBtn = document.getElementById("toggleSenhaAcessibilidade");

    // força estado inicial text
    campoSenha.type = "text";
    toggleBtn.textContent = "🙈";
    toggleBtn.setAttribute("aria-label", "Ocultar senha");

    toggleBtn.click(); // voltar para password

    expect(campoSenha.type).toBe("password");
    expect(toggleBtn.textContent.trim()).toBe("👁️");
    expect(toggleBtn.getAttribute("aria-label")).toBe("Mostrar senha");
  });
});
