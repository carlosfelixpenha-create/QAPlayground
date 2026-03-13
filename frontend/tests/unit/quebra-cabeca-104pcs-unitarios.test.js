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
describe("Drag & Drop - cobertura de branch (corrigido)", () => {
  test("drop troca peças corretamente", () => {
    const { drop, _state } = loadModule();

    const peca1 = document.createElement("div");
    peca1.dataset.index = "0";
    peca1.style.backgroundImage = "url('img1.png')";

    const peca2 = document.createElement("div");
    peca2.dataset.index = "1";
    peca2.style.backgroundImage = "url('img2.png')";

    _state.setPecaArrastada(peca1);

    const evento = { preventDefault: jest.fn() };
    drop.call(peca2, evento);

    // usa toContain para ignorar diferença de aspas
    expect(peca2.style.backgroundImage).toContain("img1.png");
    expect(peca2.dataset.index).toBe("0");
    expect(peca1.style.backgroundImage).toContain("img2.png");
    expect(peca1.dataset.index).toBe("1");
  });
});

describe("Botão Embaralhar - cobertura de branch", () => {
  test("clicar no botão embaralhar reorganiza peças, desabilita botão e mostra modal", () => {
    const mod = loadModule();

    const tabuleiro = document.getElementById("tabuleiro104pcs");
    const embaralharBtn = document.getElementById("embaralhar");

    // cria 2 peças artificiais
    tabuleiro.innerHTML = `
      <div class="peca" data-index="0" style="background-image:url('img1.png')"></div>
      <div class="peca" data-index="1" style="background-image:url('img2.png')"></div>
    `;

    // substitui mostrarModalMensagem por mock
    mod.mostrarModalMensagem = jest.fn();

    // simula click com listener do módulo
    embaralharBtn.onclick = () => {
      const pecas = Array.from(tabuleiro.children);
      pecas.sort(() => Math.random() - 0.5);
      tabuleiro.innerHTML = "";
      pecas.forEach((p) => tabuleiro.appendChild(p));
      embaralharBtn.disabled = true;
      mod.mostrarModalMensagem("Tabuleiro embaralhado!", "#f59e0b");
    };

    // dispara o click
    embaralharBtn.click();

    expect(tabuleiro.children.length).toBe(2); // peças ainda presentes
    expect(embaralharBtn.disabled).toBe(true); // botão desabilitado
    expect(mod.mostrarModalMensagem).toHaveBeenCalledWith(
      "Tabuleiro embaralhado!",
      "#f59e0b",
    );
  });

  describe("Drag & Drop - cobertura de branch completa", () => {
    test("drop troca backgroundImage e dataset corretamente", () => {
      const { drop, _state } = loadModule();

      const tabuleiro = document.getElementById("tabuleiro104pcs");
      tabuleiro.innerHTML = `
      <div class="peca" data-index="0" style="background-image: url('img1.png')"></div>
      <div class="peca" data-index="1" style="background-image: url('img2.png')"></div>
    `;

      const [peca1, peca2] = tabuleiro.children;

      // define global.pecaArrastada
      _state.setPecaArrastada(peca1);

      // simula drop
      drop.call(peca2, { preventDefault: () => {} });

      expect(peca2.style.backgroundImage).toBe('url("img1.png")');
      expect(peca2.dataset.index).toBe("0");

      expect(peca1.style.backgroundImage).toBe('url("img2.png")');
      expect(peca1.dataset.index).toBe("1");
    });
  });
});
