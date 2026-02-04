/**
 * Testes unitários para home.js
 * Usando Jest + JSDOM
 */

jest.useFakeTimers();

const {
  abrirModalAvaliacao,
  fecharModalAvaliacao,
  avaliar,
  enviarSugestao,
  abrirModalContatos,
  fecharModalContatos,
} = require("../js/home.js");

const { abrirModal } = require("../js/modais.js");

beforeEach(() => {
  document.body.innerHTML = `
    <div id="modal-avaliacao" style="display:none"></div>
    <div id="resultado"></div>
    <div id="feedback-extra" style="display:none"></div>

    <div id="estrelas">
      <span>☆</span>
      <span>☆</span>
      <span>☆</span>
      <span>☆</span>
      <span>☆</span>
    </div>

    <button onclick="abrirModalAvaliacao()">Avaliar</button>

    <div id="modal-contatos" style="display:none"></div>
    <button id="modalContatosOk"></button>
    <button id="btnContatos"></button>

    <input id="comentario-extra" value="Sugestão de teste" />

    <!-- Modal de sugestões -->
    <button id="btn-sugestoes"></button>
    <div id="modal-sugestoes" style="display:none">
      <textarea id="texto-sugestao"></textarea>
      <span id="contador-sugestao">0 / 600</span>
    </div>
  `;

  global.alert = jest.fn();

  const store = {};
  global.sessionStorage = {
    getItem: (key) => store[key],
    setItem: (key, value) => (store[key] = value),
    clear: () => Object.keys(store).forEach((k) => delete store[k]),
  };
});

describe("Modal de Avaliação", () => {
  test("abrirModalAvaliacao exibe o modal", () => {
    abrirModalAvaliacao();
    expect(document.getElementById("modal-avaliacao").style.display).toBe(
      "flex",
    );
  });

  test("fecharModalAvaliacao esconde o modal", () => {
    fecharModalAvaliacao();
    expect(document.getElementById("modal-avaliacao").style.display).toBe(
      "none",
    );
  });

  test("avaliar com nota 2 atualiza estrelas, mensagem e fecha modal após timeout", () => {
    abrirModalAvaliacao();
    avaliar(2);

    expect(document.getElementById("resultado").innerText).toContain(
      "2 estrelas",
    );

    expect(document.querySelectorAll("#estrelas .selecionada").length).toBe(2);

    expect(document.getElementById("modal-avaliacao").style.display).toBe(
      "flex",
    );

    jest.advanceTimersByTime(3000);

    expect(document.getElementById("modal-avaliacao").style.display).toBe(
      "none",
    );
  });

  test("avaliar com nota 5 salva sessão e desabilita botão de avaliar", () => {
    avaliar(5);

    expect(sessionStorage.getItem("avaliou")).toBe("true");

    const btnAvaliar = document.querySelector(
      "button[onclick='abrirModalAvaliacao()']",
    );
    expect(btnAvaliar.disabled).toBe(true);
  });
});

describe("Envio de sugestão", () => {
  test("nota baixa com comentário dispara alert", () => {
    avaliar(2);
    enviarSugestao();
    expect(global.alert).toHaveBeenCalled();
  });

  test("nota baixa sem comentário não dispara alert", () => {
    avaliar(2);
    document.getElementById("comentario-extra").value = "";
    enviarSugestao();
    expect(global.alert).not.toHaveBeenCalled();
  });
});

describe("Modal de Contatos", () => {
  test("abrirModalContatos exibe modal", () => {
    abrirModalContatos();
    expect(document.getElementById("modal-contatos").style.display).toBe(
      "flex",
    );
  });

  test("fecharModalContatos esconde modal", () => {
    fecharModalContatos();
    expect(document.getElementById("modal-contatos").style.display).toBe(
      "none",
    );
  });
});

describe("Modal de Sugestões", () => {
  test("abrir modal de sugestões exibe a modal", () => {
    abrirModal("sugestoes");
    expect(document.getElementById("modal-sugestoes").style.display).toBe(
      "flex",
    );
  });

  test("contador de caracteres atualiza ao digitar", () => {
    const textarea = document.getElementById("texto-sugestao");
    textarea.value = "Teste";

    // 🔑 evento nasce no textarea
    textarea.dispatchEvent(new Event("input", { bubbles: true }));

    expect(document.getElementById("contador-sugestao").textContent).toBe(
      "5 / 600",
    );
  });
});
