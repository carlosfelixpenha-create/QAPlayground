/**
 * @jest-environment jsdom
 *
 * Testes de integração para quebra-cabeca.js
 */

beforeEach(() => {
  document.body.innerHTML = `
    <div id="tabuleiro"></div>
    <div id="referencia"></div>
    <div id="mensagem"></div>
    <div class="referencia-container"></div>
    <div id="modal-mensagem" style="display:none"></div>
    <button id="embaralhar"></button>
    <div id="botoes-niveis">
      <button>4</button>
      <button>8</button>
      <button>16</button>
      <button>32</button>
    </div>
  `;
});

function loadModule() {
  let mod;
  jest.isolateModules(() => {
    mod = require("../quebra-cabeca");
  });
  return mod;
}

describe("Fluxo de integração quebra-cabeça", () => {
  test("iniciar jogo deve criar peças e desabilitar botão embaralhar", () => {
    const { iniciarJogo } = loadModule();

    iniciarJogo(4);

    const tabuleiro = document.getElementById("tabuleiro");
    expect(tabuleiro.children.length).toBe(4);
    expect(document.getElementById("embaralhar").disabled).toBe(true);
  });

  test("arrastar e soltar deve trocar peças de posição", () => {
    const { iniciarJogo, _state } = loadModule();

    iniciarJogo(4);

    const tabuleiro = document.getElementById("tabuleiro");
    const peca1 = tabuleiro.children[0];
    const peca2 = tabuleiro.children[1];

    // Simula dragstart em peca1
    peca1.dispatchEvent(new Event("dragstart", { bubbles: true }));
    _state.setDragged(peca1);

    // Simula drop em peca2
    const dropEvent = new Event("drop", { bubbles: true });
    dropEvent.preventDefault = jest.fn();
    peca2.dispatchEvent(dropEvent);

    // Após troca, as duas primeiras posições não devem ser iguais às originais
    const novoPeca1 = tabuleiro.children[0];
    const novoPeca2 = tabuleiro.children[1];
    expect(novoPeca1.dataset.index).not.toBe(peca1.dataset.index);
    expect(novoPeca2.dataset.index).not.toBe(peca2.dataset.index);
  });

  test("verificar vitória deve habilitar botão embaralhar e mostrar mensagem", () => {
    const { iniciarJogo, verificarVitoria } = loadModule();

    iniciarJogo(4);

    const tabuleiro = document.getElementById("tabuleiro");
    Array.from(tabuleiro.children).forEach((p, idx) => {
      p.dataset.index = idx; // força ordem correta
    });

    verificarVitoria();

    expect(document.getElementById("embaralhar").disabled).toBe(false);
    expect(document.getElementById("modal-mensagem").textContent).toContain(
      "Parabéns"
    );
  });

  test("clicar em embaralhar deve reorganizar peças e mostrar mensagem", () => {
    const { iniciarJogo } = loadModule();

    iniciarJogo(4);

    const embaralharBtn = document.getElementById("embaralhar");
    embaralharBtn.disabled = false; // simula vitória

    embaralharBtn.click();

    expect(embaralharBtn.disabled).toBe(true);
    expect(document.getElementById("modal-mensagem").textContent).toContain(
      "Tabuleiro embaralhado!"
    );
  });
});
