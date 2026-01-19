/**
 * Testes de integração para home.js
 * Validam o fluxo completo de avaliação, sugestão e contatos
 */

// Mock Firebase ANTES de importar home.js
global.firebase = {
  initializeApp: jest.fn(() => ({})),
  database: jest.fn(() => ({
    ref: jest.fn(() => ({
      transaction: jest.fn(),
      once: jest.fn(() => Promise.resolve({ val: () => 10 })), // retorna 10 para soma/total
      on: jest.fn((_, cb) => cb({ val: () => 10 })), // retorna 10 para visitas
    })),
  })),
  analytics: jest.fn(),
};

const {
  avaliar,
  enviarSugestao,
  abrirModalAvaliacao,
  fecharModalAvaliacao,
  abrirModalContatos,
  fecharModalContatos,
} = require("../js/home.js");

beforeEach(() => {
  document.body.innerHTML = `
    <div id="modal-avaliacao" style="display:none"></div>
    <div id="resultado"></div>
    <div id="feedback-extra" style="display:none"></div>
    <div id="estrelas">
      <span>☆</span><span>☆</span><span>☆</span><span>☆</span><span>☆</span>
    </div>
    <button onclick="abrirModalAvaliacao()">Avaliar</button>
    <input id="comentario-extra" value="" />
    <div id="media-avaliacao"></div>
    <div id="media-container"></div>
    <div id="modal-contatos" style="display:none"></div>
    <button id="modalContatosOk"></button>
    <button id="btnContatos"></button>
  `;

  global.alert = jest.fn();
});

describe("Fluxo de integração - avaliação e sugestão", () => {
  test("usuário avalia com 2 estrelas e envia sugestão", async () => {
    abrirModalAvaliacao();
    await avaliar(2);

    expect(document.getElementById("resultado").innerHTML).toContain(
      "Você avaliou nossa plataforma com 2 estrelas",
    );
    expect(document.getElementById("feedback-extra").style.display).toBe(
      "block",
    );

    document.getElementById("comentario-extra").value =
      "Gostaria de mais exemplos práticos";
    await enviarSugestao();

    expect(global.alert).toHaveBeenCalledWith(
      "Sugestão registrada com sucesso!",
    );
    expect(document.getElementById("modal-avaliacao").style.display).toBe(
      "none",
    );
  });

  test("usuário avalia com 2 estrelas mas não escreve sugestão", async () => {
    abrirModalAvaliacao();
    await avaliar(2);

    document.getElementById("comentario-extra").value = "";
    await enviarSugestao();

    // Modal deve fechar sem alert
    expect(global.alert).not.toHaveBeenCalled();
    expect(document.getElementById("modal-avaliacao").style.display).toBe(
      "none",
    );
  });

  test("usuário avalia com 5 estrelas (sem sugestão)", async () => {
    abrirModalAvaliacao();
    await avaliar(5);

    expect(document.getElementById("resultado").innerText).toContain(
      "Você avaliou nossa plataforma com 5 estrelas",
    );
    expect(document.getElementById("feedback-extra").style.display).toBe(
      "none",
    );

    // modal deve fechar automaticamente após timeout
    await new Promise((resolve) => setTimeout(resolve, 3100));
    expect(document.getElementById("modal-avaliacao").style.display).toBe(
      "none",
    );
  });

  test("usuário avalia com 4 estrelas (sem sugestão)", async () => {
    abrirModalAvaliacao();
    await avaliar(4);

    expect(document.getElementById("resultado").innerText).toContain(
      "Você avaliou nossa plataforma com 4 estrelas",
    );
    expect(document.getElementById("feedback-extra").style.display).toBe(
      "none",
    );

    await new Promise((resolve) => setTimeout(resolve, 3100));
    expect(document.getElementById("modal-avaliacao").style.display).toBe(
      "none",
    );
  });
});

describe("Fluxo de integração - contatos", () => {
  test("usuário abre e fecha modal de contatos pelo botão OK", () => {
    abrirModalContatos();
    expect(document.getElementById("modal-contatos").style.display).toBe(
      "flex",
    );

    fecharModalContatos();
    expect(document.getElementById("modal-contatos").style.display).toBe(
      "none",
    );
  });

  test("usuário fecha modal de contatos clicando fora", () => {
    const modal = document.getElementById("modal-contatos");
    abrirModalContatos();

    // Simula clique fora do modal
    const clickEvent = new MouseEvent("click", { bubbles: true });
    Object.defineProperty(clickEvent, "target", { value: modal });
    window.dispatchEvent(clickEvent);

    expect(modal.style.display).toBe("none");
  });
});
