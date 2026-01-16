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

beforeEach(() => {
  document.body.innerHTML = `
    <input id="senha" type="password" />
    <button id="toggleSenhaAcessibilidade"></button>
    <button class="btn-validar"></button>
    <span id="retorno-senha"></span>
    <ul class="regras-senha">
      <li id="regra-maiuscula"><span class="check">☐</span></li>
      <li id="regra-numero"><span class="check">☐</span></li>
      <li id="regra-simbolo"><span class="check">☐</span></li>
      <li id="regra-tamanho"><span class="check">☐</span></li>
    </ul>
  `;

  // limpa cache e reimporta o módulo para registrar listeners com o DOM já montado
  jest.resetModules();
  const acessibilidade = require("../js/acessibilidade.js");
  validarSenhaLocal = acessibilidade.validarSenhaLocal;
  atualizarRegrasSenha = acessibilidade.atualizarRegrasSenha;
  validarSenhaAcessibilidade = acessibilidade.validarSenhaAcessibilidade;
  resetarPagina = acessibilidade.resetarPagina;
  inicializarAcessibilidade = acessibilidade.inicializarAcessibilidade;

  // 🔑 Inicializa os listeners após recriar o DOM
  if (inicializarAcessibilidade) {
    inicializarAcessibilidade();
  }
});

describe("Funções de validação de senha", () => {
  test("validarSenhaLocal deve aceitar senha válida", () => {
    expect(validarSenhaLocal("Teste1!")).toBe(true);
  });

  test("validarSenhaLocal deve rejeitar senha inválida", () => {
    expect(validarSenhaLocal("teste")).toBe(false);
    expect(validarSenhaLocal("Teste123")).toBe(false);
    expect(validarSenhaLocal("teste1!")).toBe(false);
    expect(validarSenhaLocal("T1!")).toBe(false);
  });
});

describe("Atualização dinâmica das regras", () => {
  test("atualizarRegrasSenha deve marcar regra de maiúscula como válida", () => {
    document.getElementById("senha").value = "Teste";
    atualizarRegrasSenha();
    expect(document.getElementById("regra-maiuscula").className).toBe("valida");
  });

  test("atualizarRegrasSenha deve marcar regra de número como inválida", () => {
    document.getElementById("senha").value = "Teste";
    atualizarRegrasSenha();
    expect(document.getElementById("regra-numero").className).toBe("");
  });
});

describe("Validação final", () => {
  test("validarSenhaAcessibilidade deve marcar senha válida", () => {
    document.getElementById("senha").value = "Teste1!";
    validarSenhaAcessibilidade();
    expect(document.getElementById("retorno-senha").textContent).toContain(
      "Senha válida"
    );
    expect(document.querySelector(".btn-validar").disabled).toBe(true);
  });

  test("validarSenhaAcessibilidade deve marcar senha inválida", () => {
    document.getElementById("senha").value = "teste";
    validarSenhaAcessibilidade();
    expect(document.getElementById("retorno-senha").textContent).toContain(
      "Senha inválida"
    );
  });
});

describe("Reset da página", () => {
  test("resetarPagina deve limpar campo, feedback e regras", () => {
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
      .querySelector(".check").textContent = "✅";

    resetarPagina();

    expect(campoSenha.value).toBe("");
    expect(retorno.textContent).toBe("");
    expect(retorno.style.color).toBe("");
    expect(btnValidar.disabled).toBe(false);
    expect(document.getElementById("regra-maiuscula").className).toBe("");
    expect(
      document.getElementById("regra-maiuscula").querySelector(".check")
        .textContent
    ).toBe("☐");
  });
});

describe("Toggle de visibilidade da senha", () => {
  test("deve alternar de password para text ao clicar", () => {
    const campoSenha = document.getElementById("senha");
    const toggleBtn = document.getElementById("toggleSenhaAcessibilidade");

    toggleBtn.click();

    expect(campoSenha.type).toBe("text");
    expect(toggleBtn.textContent).toBe("🙈");
    expect(toggleBtn.getAttribute("aria-label")).toBe("Ocultar senha");
  });

  test("deve alternar de text para password ao clicar novamente", () => {
    const campoSenha = document.getElementById("senha");
    const toggleBtn = document.getElementById("toggleSenhaAcessibilidade");

    campoSenha.type = "text";
    toggleBtn.textContent = "🙈";
    toggleBtn.setAttribute("aria-label", "Ocultar senha");

    toggleBtn.click();

    expect(campoSenha.type).toBe("password");
    expect(toggleBtn.textContent).toBe("👁️");
    expect(toggleBtn.getAttribute("aria-label")).toBe("Mostrar senha");
  });
});
