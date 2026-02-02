/**
 * Testes de integração para home.js
 * Avaliação, sugestões e contatos
 */

// 🔹 Mock global do EmailJS
global.emailjs = {
  init: jest.fn(),
  send: jest.fn(() => Promise.resolve()),
};

const {
  avaliar,
  abrirModalAvaliacao,
  fecharModalAvaliacao,
  abrirModalContatos,
  fecharModalContatos,
} = require("../js/home.js");

// 🔹 Funções de sugestões vêm do modais.js
const { abrirModal, enviarSugestao } = require("../js/modais.js");

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

    <div id="modal-contatos" style="display:none"></div>
    <button id="modalContatosOk"></button>
    <button id="btnContatos"></button>

    <!-- 🔽 SUGESTÕES 🔽 -->
    <button id="btn-sugestoes"></button>
    <div id="modal-sugestoes" style="display:none">
      <textarea id="texto-sugestao"></textarea>
    </div>
  `;

  global.alert = jest.fn();
  localStorage.clear();
  jest.clearAllMocks();
});

describe("Fluxo de integração - avaliação", () => {
  test("usuário avalia com 2 estrelas", async () => {
    abrirModalAvaliacao();
    await avaliar(2);

    expect(document.getElementById("resultado").innerText).toContain(
      "Você avaliou nossa plataforma com 2 estrelas",
    );
  });

  test("usuário avalia com 5 estrelas", async () => {
    abrirModalAvaliacao();
    await avaliar(5);

    await new Promise((r) => setTimeout(r, 3100));
    expect(document.getElementById("modal-avaliacao").style.display).toBe(
      "none",
    );
  });
});

describe("Fluxo de integração - sugestões", () => {
  test("abre modal de sugestões e envia texto válido", async () => {
    abrirModal("sugestoes");

    document.getElementById("texto-sugestao").value =
      "Gostaria de mais exemplos práticos";

    await enviarSugestao();

    expect(global.emailjs.send).toHaveBeenCalledTimes(1);
  });

  test("não envia sugestão se textarea estiver vazio", async () => {
    abrirModal("sugestoes");
    document.getElementById("texto-sugestao").value = "";

    await enviarSugestao();

    expect(global.emailjs.send).not.toHaveBeenCalled();
    expect(document.getElementById("modal-sugestoes").style.display).toBe(
      "flex",
    );
  });
});

describe("Fluxo de integração - contatos", () => {
  test("abre e fecha modal de contatos", () => {
    abrirModalContatos();
    fecharModalContatos();

    expect(document.getElementById("modal-contatos").style.display).toBe(
      "none",
    );
  });
});
