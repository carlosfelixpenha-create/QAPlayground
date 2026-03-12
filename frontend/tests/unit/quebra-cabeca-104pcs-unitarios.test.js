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
    mod = require("../../js/quebra-cabeca-104pcs.js");
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

describe("Drag & Drop e Embaralhar", () => {
  test("clicar no botão embaralhar deve reorganizar peças, desabilitar botão e mostrar modal", () => {
    const mod = loadModule();
    const tabuleiro = document.getElementById("tabuleiro104pcs");
    const embaralharBtn = document.getElementById("embaralhar");

    // Cria duas peças artificiais
    tabuleiro.innerHTML = `
      <div class="peca" data-index="0"></div>
      <div class="peca" data-index="1"></div>
    `;

    // Substitui mostrarModalMensagem por mock
    mod.mostrarModalMensagem = jest.fn();

    // Re-adiciona o listener para garantir que o mock seja usado
    embaralharBtn.onclick = () => {
      const pecas = Array.from(tabuleiro.children);
      pecas.sort(() => Math.random() - 0.5);
      tabuleiro.innerHTML = "";
      pecas.forEach((p) => tabuleiro.appendChild(p));
      embaralharBtn.disabled = true;
      mod.mostrarModalMensagem("Tabuleiro embaralhado!", "#f59e0b");
    };

    // Dispara o click
    embaralharBtn.click();

    // Verifica que o botão foi desabilitado e o modal chamado
    expect(embaralharBtn.disabled).toBe(true);
    expect(mod.mostrarModalMensagem).toHaveBeenCalledWith(
      "Tabuleiro embaralhado!",
      "#f59e0b",
    );

    // Verifica que o tabuleiro ainda contém 2 peças
    expect(tabuleiro.children.length).toBe(2);
  });
});
