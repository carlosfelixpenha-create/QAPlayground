/**
 * @jest-environment jsdom
 *
 * Testes de integração para quebra-cabeca-104pcs.js
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

describe("Fluxo de integração quebra-cabeça 104 peças", () => {
  test("iniciar jogo deve criar 104 peças e desabilitar botão embaralhar", () => {
    const { iniciarJogo104 } = loadModule();

    iniciarJogo104();

    const tabuleiro = document.getElementById("tabuleiro104pcs");
    expect(tabuleiro.children.length).toBe(104);
    expect(document.getElementById("embaralhar").disabled).toBe(true);
  });

  test("arrastar e soltar deve trocar atributos das peças", () => {
    const { iniciarJogo104, _state } = loadModule();

    iniciarJogo104();

    const tabuleiro = document.getElementById("tabuleiro104pcs");
    const peca1 = tabuleiro.children[0];
    const peca2 = tabuleiro.children[1];

    const indexOriginal1 = peca1.dataset.index;
    const indexOriginal2 = peca2.dataset.index;

    // Simula dragstart em peca1
    peca1.dispatchEvent(new Event("dragstart", { bubbles: true }));
    _state.setPecaArrastada(peca1);

    // Simula drop em peca2
    const dropEvent = new Event("drop", { bubbles: true });
    dropEvent.preventDefault = jest.fn();
    peca2.dispatchEvent(dropEvent);

    // Agora os atributos devem ter sido trocados
    expect(peca1.dataset.index).toBe(indexOriginal2);
    expect(peca2.dataset.index).toBe(indexOriginal1);
  });

  test("verificarConclusao deve habilitar botão embaralhar e mostrar mensagem", () => {
    const { iniciarJogo104, verificarConclusao } = loadModule();

    iniciarJogo104();

    const tabuleiro = document.getElementById("tabuleiro104pcs");
    Array.from(tabuleiro.children).forEach((p, idx) => {
      p.dataset.index = idx; // força ordem correta
    });

    verificarConclusao();

    expect(document.getElementById("embaralhar").disabled).toBe(false);
    expect(document.getElementById("modal-mensagem").textContent).toContain(
      "Parabéns"
    );
  });

  test("clicar em embaralhar deve reorganizar peças e mostrar mensagem", () => {
    const { iniciarJogo104 } = loadModule();

    iniciarJogo104();

    const embaralharBtn = document.getElementById("embaralhar");
    embaralharBtn.disabled = false; // simula vitória

    embaralharBtn.click();

    expect(embaralharBtn.disabled).toBe(true);
    expect(document.getElementById("modal-mensagem").textContent).toContain(
      "Tabuleiro embaralhado!"
    );
  });
});
