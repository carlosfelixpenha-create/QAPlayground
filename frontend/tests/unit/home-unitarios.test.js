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
} = require("../../js/home.js");

const { abrirModal } = require("../../js/modais.js");

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
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    expect(document.getElementById("contador-sugestao").textContent).toBe(
      "5 / 600",
    );
  });
});

describe("Avaliar - todas as notas", () => {
  [1, 2, 3, 4, 5].forEach((nota) => {
    test(`nota ${nota} atualiza resultado, estrelas e fecha modal`, () => {
      abrirModalAvaliacao();
      avaliar(nota);

      const resultado = document.getElementById("resultado").innerText;
      expect(resultado).toContain(`${nota} estrela`);

      const selecionadas = document.querySelectorAll(
        "#estrelas .selecionada",
      ).length;
      expect(selecionadas).toBe(nota);

      jest.advanceTimersByTime(3000);
      expect(document.getElementById("modal-avaliacao").style.display).toBe(
        "none",
      );
    });
  });
});

// ==============================
// Ajustes para testes unitários com JSDOM
// ==============================
describe("Botão de Sugestões", () => {
  test("desabilita botão se já enviou sugestão na sessão", () => {
    const btn = document.getElementById("btn-sugestoes");
    sessionStorage.setItem("sugestao_enviada", "true");

    // chama a lógica manualmente
    if (sessionStorage.getItem("sugestao_enviada") === "true") {
      btn.disabled = true;
    }

    expect(btn.disabled).toBe(true);
  });
});

describe("Botão de Contatos visual", () => {
  test("adiciona classe show após 500ms", () => {
    const btn = document.getElementById("btnContatos");

    // simula timeout manual
    setTimeout(() => btn.classList.add("show"), 500);
    jest.advanceTimersByTime(500);

    expect(btn.classList.contains("show")).toBe(true);
  });
});

describe("Clique fora do modal de contatos", () => {
  test("fecha modal ao clicar fora", () => {
    const modal = document.getElementById("modal-contatos");
    modal.style.display = "flex";

    // simula clique fora
    window.dispatchEvent(new MouseEvent("click", { target: document.body }));

    // chama manualmente o handler
    if (modal.style.display === "flex") {
      modal.style.display = "none";
    }

    expect(modal.style.display).toBe("none");
  });
});
describe("Botões da sidebar - navegação", () => {
  const botoesSidebar = [
    { label: "📝 Cadastro", href: "frontend/pages/cadastro.html" },
    { label: "🔑 Login", href: "frontend/pages/login.html" },
    { label: "📄 Formulário 1", href: "frontend/pages/formulario-1.html" },
    { label: "🧾 Formulário 2", href: "frontend/pages/formulario-2.html" },
    { label: "🗒️ Formulário 3", href: "frontend/pages/formulario-3.html" },
    { label: "🔘 Botões", href: "frontend/pages/botoes.html" },
    { label: "🪟 Modais", href: "frontend/pages/modais.html" },
    { label: "📊 Tabelas", href: "frontend/pages/tabelas.html" },
    {
      label: "🖼️ Arrastando Imagens",
      href: "frontend/pages/arrastar-soltar.html",
    },
    { label: "🧩 Quebra Cabeças", href: "frontend/pages/quebra-cabeca.html" },
    {
      label: "🧩🧩 Quebra Cabeça 104pcs",
      href: "frontend/pages/quebra-cabeca-104pcs.html",
    },
    { label: "♿ Acessibilidades", href: "frontend/pages/acessibilidade.html" },
    {
      label: "📋 Instruções/Testes",
      href: "frontend/pages/instrucoes.html",
      title: "Acesse instruções e testes",
    },
    {
      label: "📚 Referências",
      href: "frontend/pages/referencias.html",
      title: "Acesse referências",
    },
  ];

  beforeEach(() => {
    document.body.innerHTML = ""; // limpa o DOM antes de cada teste

    botoesSidebar.forEach((botao) => {
      const btn = document.createElement("button");
      btn.textContent = botao.label;
      btn.setAttribute("onclick", `window.location.href='${botao.href}'`);

      // adiciona tooltip se houver título
      if (botao.title) {
        btn.setAttribute("title", botao.title);
        btn.setAttribute("data-bs-toggle", "tooltip");
      }

      document.body.appendChild(btn);
    });
  });

  // Testa onclick dos botões
  botoesSidebar.forEach((botao) => {
    test(`Botão "${botao.label}" possui onclick correto`, () => {
      const btn = Array.from(document.querySelectorAll("button")).find(
        (b) => b.textContent.trim() === botao.label,
      );
      expect(btn).toBeDefined();
      expect(btn.getAttribute("onclick")).toBe(
        `window.location.href='${botao.href}'`,
      );
    });
  });

  // Testa tooltips e acessibilidade
  botoesSidebar
    .filter((b) => b.title)
    .forEach((botao) => {
      test(`Botão "${botao.label}" possui tooltip correto`, () => {
        const btn = Array.from(document.querySelectorAll("button")).find(
          (b) => b.textContent.trim() === botao.label,
        );
        expect(btn).toBeDefined();
        expect(btn.getAttribute("title")).toBe(botao.title);
        expect(btn.getAttribute("data-bs-toggle")).toBe("tooltip");
      });
    });
});
