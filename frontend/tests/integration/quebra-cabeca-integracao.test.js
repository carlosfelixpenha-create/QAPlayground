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

    <!-- Modal real -->
    <div id="modalMensagem" style="display:none"></div>

    <!-- Botão embaralhar inicia desabilitado -->
    <button id="embaralhar" disabled></button>

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
    mod = require("../../js/quebra-cabeca.js");
  });
  return mod;
}

describe("Fluxo de integração quebra-cabeça", () => {
  test("iniciar jogo deve criar peças e desabilitar botão embaralhar", () => {
    const { iniciarJogo } = loadModule();

    iniciarJogo(4);

    const tabuleiro = document.getElementById("tabuleiro");
    const embaralharBtn = document.getElementById("embaralhar");

    expect(tabuleiro.children.length).toBe(4);
    expect(embaralharBtn.disabled).toBe(true);
  });

  test("arrastar e soltar deve trocar peças de posição no DOM", () => {
    const { iniciarJogo } = loadModule();

    iniciarJogo(4);

    const tabuleiro = document.getElementById("tabuleiro");
    const peca1 = tabuleiro.children[0];
    const peca2 = tabuleiro.children[1];

    // Simula dragstart
    peca1.dispatchEvent(new Event("dragstart", { bubbles: true }));

    // Simula drop
    const dropEvent = new Event("drop", { bubbles: true });
    dropEvent.preventDefault = jest.fn();
    peca2.dispatchEvent(dropEvent);

    // Valida troca real no DOM (não dataset)
    expect(tabuleiro.children[0]).not.toBe(peca1);
    expect(tabuleiro.children[1]).not.toBe(peca2);
  });

  test("verificar vitória deve habilitar botão embaralhar e mostrar mensagem", () => {
    const { iniciarJogo, verificarVitoria } = loadModule();

    iniciarJogo(4);

    const tabuleiro = document.getElementById("tabuleiro");

    // Força estado de vitória
    Array.from(tabuleiro.children).forEach((p, idx) => {
      p.dataset.index = idx;
    });

    verificarVitoria();

    const modal = document.getElementById("modalMensagem");
    const embaralharBtn = document.getElementById("embaralhar");

    expect(embaralharBtn.disabled).toBe(false);
    expect(modal.textContent).toContain("Parabéns");
  });

  test("clicar em embaralhar deve reorganizar peças e mostrar mensagem", () => {
    const { iniciarJogo } = loadModule();

    iniciarJogo(4);

    const embaralharBtn = document.getElementById("embaralhar");
    const modal = document.getElementById("modalMensagem");

    // Simula vitória
    embaralharBtn.disabled = false;

    embaralharBtn.click();

    expect(embaralharBtn.disabled).toBe(true);
    expect(modal.textContent).toContain("Tabuleiro embaralhado!");
  });
});
