/**
 * @jest-environment jsdom
 *
 * Testes de integração para modais.js
 */

beforeEach(() => {
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
      <button id="btn-sucesso-ok">Fechar</button>
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

function loadModule() {
  let mod;
  jest.isolateModules(() => {
    mod = require("../js/modais.js");
  });
  return mod;
}

describe("Fluxo de integração modais", () => {
  test("alerta: abrir, marcar checkbox e confirmar deve desabilitar botão", () => {
    const { abrirModal, retornoAlerta } = loadModule();
    document.dispatchEvent(new Event("DOMContentLoaded"));

    abrirModal("alerta");
    document.getElementById("checkbox-alerta").checked = true;
    document.getElementById("btn-alerta-ok").disabled = false;

    retornoAlerta();

    expect(
      document.querySelector(`button[onclick="abrirModal('alerta')"]`).disabled
    ).toBe(true);
  });

  test("confirmação: abrir e cancelar deve desabilitar botão", () => {
    const { abrirModal, cancelarAcao } = loadModule();
    document.dispatchEvent(new Event("DOMContentLoaded"));

    abrirModal("confirmacao");
    cancelarAcao();

    expect(
      document.querySelector(`button[onclick="abrirModal('confirmacao')"]`)
        .disabled
    ).toBe(true);
  });

  test("sucesso: abrir, preencher feedback e fechar deve desabilitar botão", () => {
    const { abrirModal, retornoSucesso } = loadModule();
    document.dispatchEvent(new Event("DOMContentLoaded"));

    abrirModal("sucesso");
    document.getElementById("feedback-sucesso").value = "Comentário teste";
    retornoSucesso();

    expect(
      document.querySelector(`button[onclick="abrirModal('sucesso')"]`).disabled
    ).toBe(true);
  });

  test("erro: abrir sem justificativa deve manter botão habilitado", () => {
    const { abrirModal, retornoErro } = loadModule();
    document.dispatchEvent(new Event("DOMContentLoaded"));

    abrirModal("erro");
    document.getElementById("justificativa-erro").value = "";
    retornoErro();

    // Botão de abrir modal continua habilitado (não confirmou)
    expect(
      document.querySelector(`button[onclick="abrirModal('erro')"]`).disabled
    ).toBe(false);
  });

  test("erro: abrir com justificativa deve desabilitar botão", () => {
    const { abrirModal, retornoErro } = loadModule();
    document.dispatchEvent(new Event("DOMContentLoaded"));

    abrirModal("erro");
    document.getElementById("justificativa-erro").value = "Problema X";
    retornoErro();

    expect(
      document.querySelector(`button[onclick="abrirModal('erro')"]`).disabled
    ).toBe(true);
  });

  test("resetarPagina deve limpar retornos e desabilitar botão limpar novamente", () => {
    const { desabilitarBotao, resetarPagina } = loadModule();
    document.dispatchEvent(new Event("DOMContentLoaded"));

    desabilitarBotao("alerta");
    desabilitarBotao("confirmacao");
    desabilitarBotao("sucesso");
    desabilitarBotao("erro");

    const btnLimpar = document.querySelector("button.resetar");
    expect(btnLimpar.disabled).toBe(false);

    resetarPagina();
    expect(btnLimpar.disabled).toBe(true);
  });
});
