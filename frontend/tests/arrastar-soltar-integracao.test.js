/**
 * @jest-environment jsdom
 *
 * Testes de integração para arrastar-soltar.js
 */

beforeEach(() => {
  document.body.innerHTML = `
    <div id="movimentos"></div>
    <div id="acertos"></div>
    <div id="erros"></div>
    <div id="mensagem-final"></div>
    <div id="modal-mensagem" style="display:none"></div>
    <button id="reiniciar"></button>

    <!-- Slots de imagem -->
    <div class="item-slot" data-tipo="cachorro"></div>
    <div class="item-slot" data-tipo="gato"></div>

    <!-- Palavras -->
    <span class="tag-palavra" data-tipo="cachorro">Cachorro</span>
    <span class="tag-palavra" data-tipo="gato">Gato</span>
  `;

  // Resetar variáveis globais
  global.movimentos = 0;
  global.acertos = 0;
  global.erros = 0;
  global.TOTAL_PARES = 2;
});

function loadModule() {
  let mod;
  jest.isolateModules(() => {
    mod = require("../arrastar-soltar");
  });
  return mod;
}

describe("Fluxo de integração arrastar-soltar", () => {
  test("arrastar e soltar correto deve incrementar acertos e atualizar HUD", () => {
    const { _state } = loadModule();

    const palavra = document.querySelector(
      ".tag-palavra[data-tipo='cachorro']"
    );
    const slot = document.querySelector(".item-slot[data-tipo='cachorro']");

    // Simula evento de drop correto
    const event = new Event("drop", { bubbles: true });
    event.preventDefault = jest.fn();
    event.dataTransfer = {
      getData: (key) => (key === "tipo" ? "cachorro" : "Cachorro"),
    };

    slot.dispatchEvent(event);

    expect(_state.getMovimentos()).toBe(1);
    expect(_state.getAcertos()).toBe(1);
    expect(document.getElementById("movimentos").textContent).toBe("1");
    expect(document.getElementById("acertos").textContent).toBe("1");
  });

  test("arrastar e soltar errado deve incrementar erros e atualizar HUD", () => {
    const { _state } = loadModule();

    const slot = document.querySelector(".item-slot[data-tipo='cachorro']");

    const event = new Event("drop", { bubbles: true });
    event.preventDefault = jest.fn();
    event.dataTransfer = {
      getData: (key) => (key === "tipo" ? "gato" : "Gato"),
    };

    slot.dispatchEvent(event);

    expect(_state.getMovimentos()).toBe(1);
    expect(_state.getErros()).toBe(1);
    expect(document.getElementById("erros").textContent).toBe("1");
  });

  test("reiniciar deve resetar HUD e limpar slots", () => {
    const { _state } = loadModule();

    // Simula estado avançado
    _state.setMovimentos(5);
    _state.setAcertos(2);
    _state.setErros(3);

    // Dispara clique no botão reiniciar
    document.getElementById("reiniciar").click();

    expect(_state.getMovimentos()).toBe(0);
    expect(_state.getAcertos()).toBe(0);
    expect(_state.getErros()).toBe(0);
    expect(document.getElementById("movimentos").textContent).toBe("0");
    expect(document.getElementById("acertos").textContent).toBe("0");
    expect(document.getElementById("erros").textContent).toBe("0");
    expect(document.getElementById("mensagem-final").innerHTML).toBe("");
  });
});
