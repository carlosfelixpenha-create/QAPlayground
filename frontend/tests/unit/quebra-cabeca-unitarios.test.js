/**
 * @jest-environment jsdom
 *
 * Testes unitários para quebra-cabeca.js
 */

beforeEach(() => {
  document.body.innerHTML = `
    <div id="tabuleiro"></div>
    <div id="referencia"></div>
    <div id="mensagem"></div>
    <div class="referencia-container"></div>

    <!-- Modal real usado no sistema -->
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

    const modal = document.getElementById("modalMensagem");

    expect(modal.textContent).toBe("Teste de mensagem");
    expect(modal.style.color).toBe("red");
    expect(modal.style.display).toBe("block");

    jest.advanceTimersByTime(3000);
    expect(modal.style.display).toBe("none");
  });
});

describe("Função iniciarJogo", () => {
  test("deve iniciar jogo com 4 peças e grid 2 colunas", () => {
    const { iniciarJogo } = loadModule();

    iniciarJogo(4);

    const tabuleiro = document.getElementById("tabuleiro");

    expect(tabuleiro.style.display).toBe("grid");
    expect(tabuleiro.style.gridTemplateColumns).toBe("repeat(2, 1fr)");
    expect(tabuleiro.children.length).toBe(4);

    const referencia = document.getElementById("referencia");
    expect(referencia.innerHTML).toContain("robo4pcs.png");
  });

  test("deve iniciar jogo com 32 peças e aplicar classes específicas", () => {
    const { iniciarJogo } = loadModule();

    iniciarJogo(32);

    const tabuleiro = document.getElementById("tabuleiro");
    const refContainer = document.querySelector(".referencia-container");

    expect(tabuleiro.classList.contains("tabuleiro-32pcs")).toBe(true);
    expect(refContainer.classList.contains("referencia32pcs")).toBe(true);
    expect(tabuleiro.children.length).toBe(32);
  });
});

describe("Função verificarVitoria", () => {
  test("deve mostrar mensagem de vitória e habilitar botão embaralhar quando peças estão corretas", () => {
    const { iniciarJogo, verificarVitoria } = loadModule();

    iniciarJogo(4);

    const tabuleiro = document.getElementById("tabuleiro");

    // força estado de vitória
    Array.from(tabuleiro.children).forEach((p, idx) => {
      p.dataset.index = idx;
    });

    verificarVitoria();

    const modal = document.getElementById("modalMensagem");
    const embaralharBtn = document.getElementById("embaralhar");

    expect(modal.textContent).toContain("Parabéns");
    expect(embaralharBtn.disabled).toBe(false);
  });

  test("não deve mostrar mensagem nem habilitar botão se peças estão fora de ordem", () => {
    const { iniciarJogo, verificarVitoria } = loadModule();

    iniciarJogo(4);

    const tabuleiro = document.getElementById("tabuleiro");

    // força erro
    Array.from(tabuleiro.children).forEach((p, idx) => {
      p.dataset.index = idx + 1;
    });

    verificarVitoria();

    const modal = document.getElementById("modalMensagem");
    const embaralharBtn = document.getElementById("embaralhar");

    expect(modal.textContent).toBe("");
    expect(embaralharBtn.disabled).toBe(true);
  });
});
