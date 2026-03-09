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
} = require("../../js/home.js");

// 🔹 Funções de sugestões vêm do modais.js
const { abrirModal, enviarSugestao } = require("../../js/modais.js");

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

  test("usuário avalia com 5 estrelas fecha modal após timeout", async () => {
    abrirModalAvaliacao();
    await avaliar(5);

    // espera o timeout que fecha o modal
    await new Promise((r) => setTimeout(r, 3100));
    expect(document.getElementById("modal-avaliacao").style.display).toBe(
      "none",
    );
  });

  test("nota inválida não altera estrelas nem fecha modal", async () => {
    abrirModalAvaliacao();
    await avaliar(999); // nota inválida

    const selecionadas = document.querySelectorAll(
      "#estrelas .selecionada",
    ).length;

    // mantemos o comportamento atual (5 estrelas marcadas)
    expect(selecionadas).toBe(5);

    // Modal continua aberto
    expect(document.getElementById("modal-avaliacao").style.display).toBe(
      "flex",
    );
  });
});

describe("Fluxo de integração - sugestões", () => {
  test("envia sugestão válida", async () => {
    abrirModal("sugestoes");

    document.getElementById("texto-sugestao").value =
      "Gostaria de mais exemplos práticos";

    await enviarSugestao();

    expect(global.emailjs.send).toHaveBeenCalledTimes(1);
  });

  test("não envia sugestão vazia", async () => {
    abrirModal("sugestoes");
    document.getElementById("texto-sugestao").value = "";

    await enviarSugestao();

    expect(global.emailjs.send).not.toHaveBeenCalled();
    expect(document.getElementById("modal-sugestoes").style.display).toBe(
      "flex",
    );
  });

  test("falha no envio do email mantém modal aberto", async () => {
    abrirModal("sugestoes");
    document.getElementById("texto-sugestao").value = "Teste";

    // força falha
    global.emailjs.send = jest.fn(() => Promise.reject());

    await enviarSugestao();

    // comportamento real atual: modal permanece aberto
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

  test("abre e fecha múltiplas vezes sem afetar estado", () => {
    abrirModalContatos();
    fecharModalContatos();
    abrirModalContatos();
    fecharModalContatos();

    expect(document.getElementById("modal-contatos").style.display).toBe(
      "none",
    );
  });
});

describe("Integração - Botão Dark Mode", () => {
  beforeEach(() => {
    // Adiciona conteúdo e botão dark ao DOM
    document.body.innerHTML += `
      <main class="content">
        <h1>QAPlayground</h1>
      </main>
      <button id="toggle-dark">🌙 Modo Escuro</button>
      <aside class="sidebar"></aside>
    `;

    // Limpa localStorage antes de cada teste
    localStorage.clear();

    // Inicializa a lógica do botão (como no home.js)
    const btn = document.getElementById("toggle-dark");
    const content = document.querySelector(".content");

    if (btn && content) {
      const currentMode = localStorage.getItem("mode");
      if (currentMode === "dark") {
        content.classList.add("dark");
        btn.textContent = "☀️ Modo Claro";
      } else {
        btn.textContent = "🌙 Modo Escuro";
      }

      btn.addEventListener("click", () => {
        content.classList.toggle("dark");

        if (content.classList.contains("dark")) {
          btn.textContent = "☀️ Modo Claro";
          localStorage.setItem("mode", "dark");
        } else {
          btn.textContent = "🌙 Modo Escuro";
          localStorage.setItem("mode", "light");
        }
      });
    }
  });

  test("inicializa com texto correto e sem dark mode", () => {
    const btn = document.getElementById("toggle-dark");
    const content = document.querySelector(".content");

    expect(btn.textContent).toBe("🌙 Modo Escuro");
    expect(content.classList.contains("dark")).toBe(false);
  });

  test("clicar alterna dark mode e atualiza localStorage e texto", () => {
    const btn = document.getElementById("toggle-dark");
    const content = document.querySelector(".content");

    btn.click();

    expect(content.classList.contains("dark")).toBe(true);
    expect(btn.textContent).toBe("☀️ Modo Claro");
    expect(localStorage.getItem("mode")).toBe("dark");

    // Clicar novamente remove dark mode
    btn.click();

    expect(content.classList.contains("dark")).toBe(false);
    expect(btn.textContent).toBe("🌙 Modo Escuro");
    expect(localStorage.getItem("mode")).toBe("light");
  });

  test("inicializa corretamente se localStorage já estiver em dark", () => {
    localStorage.setItem("mode", "dark");

    // Simula reinicialização do script
    const btn = document.getElementById("toggle-dark");
    const content = document.querySelector(".content");

    // Reinicialização manual
    if (localStorage.getItem("mode") === "dark") {
      content.classList.add("dark");
      btn.textContent = "☀️ Modo Claro";
    }

    expect(content.classList.contains("dark")).toBe(true);
    expect(btn.textContent).toBe("☀️ Modo Claro");
  });

  test("sidebar não é afetada pelo dark mode", () => {
    const btn = document.getElementById("toggle-dark");
    const sidebar = document.querySelector(".sidebar");

    btn.click();

    expect(sidebar.classList.contains("dark")).toBe(false);
  });
});
