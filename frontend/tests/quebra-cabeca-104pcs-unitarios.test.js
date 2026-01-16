/**
 * @jest-environment jsdom
 *
 * Testes unitários para quebra-cabeca-104pcs.js
 */

beforeEach(() => {
  document.body.innerHTML = `
    <div id="tabuleiro104pcs"></div>
    <div id="referencia"></div>
    <div id="modal-mensagem" style="display:none"></div>
    <button id="embaralhar"></button>
  `;
});

function loadModule() {
  let mod;
  jest.isolateModules(() => {
    mod = require("../js/quebra-cabeca-104pcs.js");
  });
  return mod;
}

describe("Função mostrarModalMensagem", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  test("deve exibir mensagem no modal e ocultar após timeout", () => {
    const { mostrarModalMensagem } = loadModule();

    mostrarModalMensagem("Teste de mensagem", "red");

    const modal = document.getElementById("modal-mensagem");
    expect(modal.textContent).toBe("Teste de mensagem");
    expect(modal.style.color).toBe("red");
    expect(modal.style.display).toBe("block");

    jest.advanceTimersByTime(3000);
    expect(modal.style.display).toBe("none");
  });
});

describe("Função iniciarJogo104", () => {
  test("deve iniciar jogo com 104 peças e desabilitar botão embaralhar", () => {
    const { iniciarJogo104 } = loadModule();

    iniciarJogo104();

    const tabuleiro = document.getElementById("tabuleiro104pcs");
    expect(tabuleiro.children.length).toBe(104);

    const referencia = document.getElementById("referencia");
    expect(referencia.innerHTML).toContain("robo104pcs.png");

    const embaralharBtn = document.getElementById("embaralhar");
    expect(embaralharBtn.disabled).toBe(true);
  });
});

describe("Função verificarConclusao", () => {
  test("deve mostrar mensagem de vitória quando peças estão na ordem correta", () => {
    const { iniciarJogo104, verificarConclusao } = loadModule();

    iniciarJogo104();

    const tabuleiro = document.getElementById("tabuleiro104pcs");
    Array.from(tabuleiro.children).forEach((p, idx) => {
      p.dataset.index = idx; // força ordem correta
    });

    verificarConclusao();

    const modal = document.getElementById("modal-mensagem");
    expect(modal.textContent).toContain("Parabéns");
    expect(document.getElementById("embaralhar").disabled).toBe(false);
  });

  test("não deve mostrar mensagem se peças estão fora de ordem", () => {
    const { iniciarJogo104, verificarConclusao } = loadModule();

    iniciarJogo104();

    const tabuleiro = document.getElementById("tabuleiro104pcs");
    Array.from(tabuleiro.children).forEach((p, idx) => {
      p.dataset.index = idx + 1; // força erro
    });

    verificarConclusao();

    const modal = document.getElementById("modal-mensagem");
    expect(modal.textContent).toBe("");
    expect(document.getElementById("embaralhar").disabled).toBe(true);
  });
});
