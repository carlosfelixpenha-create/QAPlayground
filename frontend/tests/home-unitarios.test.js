/**
 * Testes unitários para home.js
 * Usando Jest + JSDOM para simular o DOM
 */

const {
  abrirModalAvaliacao,
  fecharModalAvaliacao,
  avaliar,
  enviarSugestao,
  abrirModalContatos,
  fecharModalContatos,
} = require("../js/home.js");

// Simula o DOM com JSDOM
beforeEach(() => {
  document.body.innerHTML = `
    <div id="contador-container"></div>
    <div id="modal-avaliacao" style="display:none"></div>
    <div id="resultado"></div>
    <div id="feedback-extra" style="display:none"></div>
    <div id="estrelas">
      <span>☆</span><span>☆</span><span>☆</span><span>☆</span><span>☆</span>
    </div>
    <button onclick="abrirModalAvaliacao()">Avaliar</button>
    <div id="modal-contatos" style="display:none"></div>
    <button id="modalContatosOk"></button>
    <button id="btnContatos"></button>
    <input id="comentario-extra" value="Sugestão de teste" />
  `;

  // Mock para alert
  global.alert = jest.fn();

  // Mock para sessionStorage
  const store = {};
  global.sessionStorage = {
    getItem: (key) => store[key],
    setItem: (key, value) => (store[key] = value),
    clear: () => Object.keys(store).forEach((key) => delete store[key]),
  };
});

describe("Funções do modal de avaliação", () => {
  test("abrirModalAvaliacao deve exibir o modal", () => {
    abrirModalAvaliacao();
    expect(document.getElementById("modal-avaliacao").style.display).toBe(
      "flex",
    );
  });

  test("fecharModalAvaliacao deve esconder o modal", () => {
    fecharModalAvaliacao();
    expect(document.getElementById("modal-avaliacao").style.display).toBe(
      "none",
    );
  });

  test("avaliar com nota 2 deve mostrar mensagem de melhoria e manter feedback-extra oculto", async () => {
    await avaliar(2);
    expect(document.getElementById("resultado").innerText).toContain(
      "Você avaliou nossa plataforma com 2 estrelas",
    );
    expect(document.getElementById("feedback-extra").style.display).toBe(
      "none",
    );
  });

  test("avaliar com nota 5 deve mostrar mensagem positiva e manter feedback-extra oculto", async () => {
    await avaliar(5);
    expect(document.getElementById("resultado").innerText).toContain(
      "Você avaliou nossa plataforma com 5 estrelas",
    );
    expect(document.getElementById("feedback-extra").style.display).toBe(
      "none",
    );
  });
});

describe("Função enviarSugestao", () => {
  test("deve registrar sugestão quando comentário não está vazio", async () => {
    await enviarSugestao();
    expect(global.alert).toHaveBeenCalledWith(
      "Sugestão registrada com sucesso!",
    );
  });

  test("deve fechar modal quando comentário está vazio", async () => {
    document.getElementById("comentario-extra").value = "";
    await enviarSugestao();
    expect(document.getElementById("modal-avaliacao").style.display).toBe(
      "none",
    );
  });
});

describe("Funções do modal de contatos", () => {
  test("abrirModalContatos deve exibir o modal", () => {
    abrirModalContatos();
    expect(document.getElementById("modal-contatos").style.display).toBe(
      "flex",
    );
  });

  test("fecharModalContatos deve esconder o modal", () => {
    fecharModalContatos();
    expect(document.getElementById("modal-contatos").style.display).toBe(
      "none",
    );
  });
});
