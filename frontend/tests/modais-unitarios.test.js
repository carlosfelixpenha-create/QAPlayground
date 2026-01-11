/**
 * @jest-environment jsdom
 *
 * Testes unitários para modais.js
 */

beforeEach(() => {
  // Monta DOM antes de importar o módulo
  document.body.innerHTML = `
    <div class="form-container">
      <div class="demo-actions">
        <button onclick="abrirModal('alerta')">Abrir Modal de Alerta</button>
        <button onclick="abrirModal('confirmacao')">Abrir Modal de Confirmação</button>
        <button onclick="abrirModal('sucesso')">Abrir Modal de Sucesso</button>
        <button onclick="abrirModal('erro')">Abrir Modal de Erro</button>
      </div>
      <button class="resetar">Limpar</button>
    </div>

    <div id="modal-alerta" class="modal"><div class="modal-content">
      <input type="checkbox" id="checkbox-alerta" />
      <button id="btn-alerta-ok" disabled>OK</button>
    </div></div>

    <div id="modal-confirmacao" class="modal"><div class="modal-content">
      <input type="password" id="senha-confirmacao" />
      <small id="senha-msg"></small>
      <button id="btn-confirmar" disabled>Confirmar</button>
    </div></div>

    <div id="modal-sucesso" class="modal"><div class="modal-content">
      <textarea id="feedback-sucesso"></textarea>
      <button>Fechar</button>
    </div></div>

    <div id="modal-erro" class="modal"><div class="modal-content">
      <textarea id="justificativa-erro"></textarea>
      <small id="erro-msg"></small>
      <button id="btn-erro-ok">Fechar</button>
    </div></div>

    <span class="retorno" id="retorno-alerta"></span>
    <span class="retorno" id="retorno-confirmacao"></span>
    <span class="retorno" id="retorno-sucesso"></span>
    <span class="retorno" id="retorno-erro"></span>
  `;
});

// Função auxiliar para importar o módulo depois do DOM
function loadModule() {
  let mod;
  jest.isolateModules(() => {
    mod = require("../modais.js");
  });
  return mod;
}

describe("Estado inicial do botão Limpar", () => {
  test("deve iniciar desabilitado", () => {
    loadModule();
    document.dispatchEvent(new Event("DOMContentLoaded")); // força execução do listener
    const btnLimpar = document.querySelector("button.resetar");
    expect(btnLimpar.disabled).toBe(true);
  });
});

describe("Função abrirModal", () => {
  test("deve abrir modal e aplicar classe correta", () => {
    const { abrirModal } = loadModule();
    const modal = document.getElementById("modal-alerta");

    abrirModal("alerta");
    expect(modal.style.display).toBe("flex");
    expect(
      modal.querySelector(".modal-content").classList.contains("small")
    ).toBe(true);
  });
});

describe("Função desabilitarBotao", () => {
  test("deve desabilitar botão de abrir modal e verificar botão limpar", () => {
    const { desabilitarBotao } = loadModule();
    const btnAlerta = document.querySelector(
      `button[onclick="abrirModal('alerta')"]`
    );
    const btnLimpar = document.querySelector("button.resetar");

    desabilitarBotao("alerta");
    expect(btnAlerta.disabled).toBe(true);
    expect(btnLimpar.disabled).toBe(true); // ainda não todos desabilitados
  });
});

describe("Função verificarTodosDesabilitados", () => {
  test("deve habilitar botão limpar quando todos os botões estiverem desabilitados", () => {
    const { desabilitarBotao } = loadModule();
    const btnLimpar = document.querySelector("button.resetar");

    desabilitarBotao("alerta");
    desabilitarBotao("confirmacao");
    desabilitarBotao("sucesso");
    desabilitarBotao("erro");

    expect(btnLimpar.disabled).toBe(false); // agora habilitado
  });
});

describe("Função resetarPagina", () => {
  test("deve limpar retornos e desabilitar botão limpar novamente", () => {
    const { resetarPagina, desabilitarBotao } = loadModule();
    const btnLimpar = document.querySelector("button.resetar");

    // simula todos desabilitados
    desabilitarBotao("alerta");
    desabilitarBotao("confirmacao");
    desabilitarBotao("sucesso");
    desabilitarBotao("erro");
    expect(btnLimpar.disabled).toBe(false);

    resetarPagina();
    expect(btnLimpar.disabled).toBe(true); // volta a ficar desabilitado
  });
});
