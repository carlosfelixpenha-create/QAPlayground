/**
 * @jest-environment jsdom
 *
 * Testes unitários para arrastar-soltar.js
 */

beforeEach(() => {
  // Monta DOM antes de importar o módulo
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

    <!-- Slots de imagem -->
    <div class="item-slot" data-tipo="cachorro"></div>
    <div class="item-slot" data-tipo="gato"></div>
    <div class="item-slot" data-tipo="peixe"></div>
    <div class="item-slot" data-tipo="passaro"></div>
    <div class="item-slot" data-tipo="cavalo"></div>
    <div class="item-slot" data-tipo="vaca"></div>
    <div class="item-slot" data-tipo="ovelha"></div>

    <!-- Palavras -->
    <span class="tag-palavra" data-tipo="cachorro">Cachorro</span>
    <span class="tag-palavra" data-tipo="gato">Gato</span>
    <span class="tag-palavra" data-tipo="peixe">Peixe</span>
    <span class="tag-palavra" data-tipo="passaro">Pássaro</span>
    <span class="tag-palavra" data-tipo="cavalo">Cavalo</span>
    <span class="tag-palavra" data-tipo="vaca">Vaca</span>
    <span class="tag-palavra" data-tipo="ovelha">Ovelha</span>
  `;
});

// Função auxiliar para importar o módulo depois do DOM
function loadModule() {
  let mod;
  jest.isolateModules(() => {
    mod = require("../arrastar-soltar");
  });
  return mod;
}

describe("Função updateHUD", () => {
  test("deve atualizar HUD com valores atuais", () => {
    const { updateHUD, _state } = loadModule();

    _state.setMovimentos(5);
    _state.setAcertos(3);
    _state.setErros(2);

    updateHUD();

    expect(document.getElementById("movimentos").textContent).toBe("5");
    expect(document.getElementById("acertos").textContent).toBe("3");
    expect(document.getElementById("erros").textContent).toBe("2");
  });
});

describe("Função mostrarModal", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  test("deve exibir mensagem no modal e ocultar após timeout", () => {
    const { mostrarModal } = loadModule();

    mostrarModal("Título teste", "Teste de mensagem", "red");

    const modal = document.getElementById("modalMensagem");
    expect(document.getElementById("modalTitulo").textContent).toBe(
      "Título teste"
    );
    expect(document.getElementById("modalTexto").textContent).toBe(
      "Teste de mensagem"
    );
    expect(document.getElementById("modalTexto").style.color).toBe("red");
    expect(modal.style.display).toBe("block");

    jest.advanceTimersByTime(3000);
    expect(modal.style.display).toBe("none");
  });
});

describe("Função finalizarSeConcluido", () => {
  test("deve mostrar título Uhuuuuuuu!!! Sucesso✨ quando movimentos = 7", () => {
    const { finalizarSeConcluido, _state } = loadModule();
    _state.setAcertos(7);
    _state.setMovimentos(7);

    finalizarSeConcluido();

    expect(document.getElementById("mensagem-final").innerHTML).toContain(
      "Uhuuuuuuu!!! Sucesso✨"
    );
  });

  test("deve mostrar título Sucesso 🎉 quando movimentos = 8", () => {
    const { finalizarSeConcluido, _state } = loadModule();
    _state.setAcertos(7);
    _state.setMovimentos(8);

    finalizarSeConcluido();

    expect(document.getElementById("mensagem-final").innerHTML).toContain(
      "Sucesso 🎉"
    );
  });

  test("deve mostrar título Parabéns 👏 quando movimentos = 9", () => {
    const { finalizarSeConcluido, _state } = loadModule();
    _state.setAcertos(7);
    _state.setMovimentos(9);

    finalizarSeConcluido();

    expect(document.getElementById("mensagem-final").innerHTML).toContain(
      "Parabéns 👏"
    );
  });

  test("deve mostrar título Boa! quando movimentos > 9", () => {
    const { finalizarSeConcluido, _state } = loadModule();
    _state.setAcertos(7);
    _state.setMovimentos(12);

    finalizarSeConcluido();

    expect(document.getElementById("mensagem-final").innerHTML).toContain(
      "Boa!"
    );
  });

  test("não deve finalizar se acertos < TOTAL_PARES", () => {
    const { finalizarSeConcluido, _state } = loadModule();
    _state.setAcertos(5);
    _state.setMovimentos(7);

    finalizarSeConcluido();

    expect(document.getElementById("mensagem-final").innerHTML).toBe("");
  });
});
