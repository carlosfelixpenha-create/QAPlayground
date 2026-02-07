/**
 * @jest-environment jsdom
 *
 * Testes de integração para acessibilidade.js
 * Validam o fluxo completo de senha acessível: regras, validação, reset e toggle
 */

// Cria o DOM ANTES de importar acessibilidade.js
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

const {
  validarSenhaLocal,
  atualizarRegrasSenha,
  validarSenhaAcessibilidade,
  resetarPagina,
  inicializarAcessibilidade,
} = require("../js/acessibilidade.js");

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

  // Inicializa listeners
  inicializarAcessibilidade();
});

describe("Fluxo de integração - regras e validação", () => {
  test("senha válida deve marcar todas as regras e retorno positivo", () => {
    const campoSenha = document.getElementById("senha");
    campoSenha.value = "Senha1!";

    atualizarRegrasSenha();
    validarSenhaAcessibilidade();

    expect(document.getElementById("regra-maiuscula").className).toBe("valida");
    expect(document.getElementById("regra-numero").className).toBe("valida");
    expect(document.getElementById("regra-simbolo").className).toBe("valida");
    expect(document.getElementById("regra-tamanho").className).toBe("valida");

    expect(document.getElementById("retorno-senha").textContent).toContain(
      "Senha válida",
    );
    expect(document.querySelector(".btn-validar").disabled).toBe(true);
  });

  test("senha inválida deve marcar regras faltantes como inválidas e retorno negativo", () => {
    const campoSenha = document.getElementById("senha");
    campoSenha.value = "abc";

    atualizarRegrasSenha();
    validarSenhaAcessibilidade();

    expect(document.getElementById("regra-maiuscula").className).toBe(
      "invalida",
    );
    expect(document.getElementById("regra-numero").className).toBe("invalida");
    expect(document.getElementById("regra-simbolo").className).toBe("invalida");
    expect(document.getElementById("regra-tamanho").className).toBe("invalida");

    expect(document.getElementById("retorno-senha").textContent).toContain(
      "Senha inválida",
    );
    expect(document.querySelector(".btn-validar").disabled).toBe(true);
  });
});

describe("Fluxo de integração - reset", () => {
  test("resetarPagina deve limpar campo, feedback e regras", () => {
    const campoSenha = document.getElementById("senha");
    const retorno = document.getElementById("retorno-senha");
    const btnValidar = document.querySelector(".btn-validar");

    campoSenha.value = "Senha1!";
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

//describe("Fluxo de integração - toggle", () => {
//test("toggle de senha deve alternar entre password e text", () => {
// const btn = document.getElementById("toggleSenhaAcessibilidade");
// const input = document.getElementById("senha");

// expect(input.type).toBe("password");
// btn.click();
// expect(input.type).toBe("text");
// btn.click();
// expect(input.type).toBe("password");
// });
//});
