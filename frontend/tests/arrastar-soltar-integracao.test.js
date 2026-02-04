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

    <!-- elementos usados pelo mostrarModal -->
    <div id="modalMensagem" style="display:none"></div>
    <div id="modalTitulo"></div>
    <div id="modalTexto"></div>
    <button id="reiniciar"></button>

    <!-- elementos de erro necessários -->
    <div id="modalMensagemErro" style="display:none"></div>
    <div id="modalTextoErro"></div>
    <button id="modalFecharErro"></button>
    <button id="modalOkErro"></button>

    <!-- Slots -->
    <div class="item-slot" data-tipo="cachorro">
      <img src="img/cachorro.jpg" />
    </div>
    <div class="item-slot" data-tipo="gato">
      <img src="img/gato.jpg" />
    </div>

    <!-- Palavras -->
    <span class="tag-palavra" data-tipo="cachorro">Cachorro</span>
    <span class="tag-palavra" data-tipo="gato">Gato</span>
  `;
});

function loadModule() {
  let mod;
  jest.isolateModules(() => {
    mod = require("../js/arrastar-soltar.js");
  });
  return mod;
}

// Helper para simular drag & drop
function simulateDragDrop(palavra, slot, tipo, texto) {
  const dragStart = new Event("dragstart", { bubbles: true });
  dragStart.dataTransfer = {
    setData: jest.fn(),
    getData: (key) => (key === "tipo" ? tipo : texto),
  };
  palavra.dispatchEvent(dragStart);

  const dragOver = new Event("dragover", { bubbles: true });
  dragOver.preventDefault = jest.fn();
  slot.dispatchEvent(dragOver);

  const drop = new Event("drop", { bubbles: true });
  drop.preventDefault = jest.fn();
  drop.dataTransfer = dragStart.dataTransfer;
  slot.dispatchEvent(drop);
}

describe("Integração arrastar-soltar", () => {
  test("soltar palavra correta incrementa acertos, mantém imagem e bloqueia palavra", () => {
    const { _state } = loadModule();

    const palavra = document.querySelector(
      ".tag-palavra[data-tipo='cachorro']",
    );
    const slot = document.querySelector(".item-slot[data-tipo='cachorro']");

    simulateDragDrop(palavra, slot, "cachorro", "Cachorro");

    // Estado
    expect(_state.getMovimentos()).toBe(1);
    expect(_state.getAcertos()).toBe(1);
    expect(_state.getErros()).toBe(0);

    // Slot
    expect(slot.querySelector("img")).not.toBeNull();
    expect(slot.textContent).toContain("✔ Cachorro");
    expect(slot.querySelectorAll("p").length).toBe(1);

    // Palavra bloqueada
    expect(palavra.getAttribute("draggable")).toBe("false");
    expect(palavra.style.opacity).toBe("0.5");

    // HUD
    expect(document.getElementById("movimentos").textContent).toBe("1");
    expect(document.getElementById("acertos").textContent).toBe("1");
    expect(document.getElementById("erros").textContent).toBe("0");
  });

  test("soltar palavra errada incrementa erros e mostra feedback visual", () => {
    const { _state } = loadModule();

    const palavra = document.querySelector(".tag-palavra[data-tipo='gato']");
    const slot = document.querySelector(".item-slot[data-tipo='cachorro']");

    simulateDragDrop(palavra, slot, "gato", "Gato");

    // Estado
    expect(_state.getMovimentos()).toBe(1);
    expect(_state.getAcertos()).toBe(0);
    expect(_state.getErros()).toBe(1);

    // Slot mostra erro (uma única vez)
    expect(slot.textContent).toContain("✖ Gato");
    expect(slot.querySelectorAll("p").length).toBe(1);

    // HUD
    expect(document.getElementById("movimentos").textContent).toBe("1");
    expect(document.getElementById("acertos").textContent).toBe("0");
    expect(document.getElementById("erros").textContent).toBe("1");
  });

  test("botão reiniciar reseta HUD, slots e palavras", () => {
    const { _state } = loadModule();

    _state.setMovimentos(3);
    _state.setAcertos(1);
    _state.setErros(2);

    const slot = document.querySelector(".item-slot[data-tipo='cachorro']");
    slot.classList.add("correto");
    slot.innerHTML += "<p>✔ Cachorro</p>";

    const palavra = document.querySelector(
      ".tag-palavra[data-tipo='cachorro']",
    );
    palavra.setAttribute("draggable", "false");
    palavra.style.opacity = "0.5";

    document.getElementById("reiniciar").click();

    // Estado
    expect(_state.getMovimentos()).toBe(0);
    expect(_state.getAcertos()).toBe(0);
    expect(_state.getErros()).toBe(0);

    // HUD
    expect(document.getElementById("movimentos").textContent).toBe("0");
    expect(document.getElementById("acertos").textContent).toBe("0");
    expect(document.getElementById("erros").textContent).toBe("0");
    expect(document.getElementById("mensagem-final").innerHTML).toBe("");

    // Slot limpo (imagem mantida)
    expect(slot.classList.contains("correto")).toBe(false);
    expect(slot.classList.contains("errado")).toBe(false);
    expect(slot.querySelector("img")).not.toBeNull();
    expect(slot.querySelector("p")).toBeNull();

    // Palavra liberada
    expect(palavra.getAttribute("draggable")).toBe("true");
    expect(palavra.style.opacity).toBe("1");
  });
});
