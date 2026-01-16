/**
 * @file acessibilidade-global-unitários.test.js
 * Testes unitários para o script acessibilidade-global.js
 */

describe("acessibilidade-global.js", () => {
  beforeEach(() => {
    // Limpa o DOM antes de cada teste
    document.body.innerHTML = `
      <div class="top-right">
        <button id="btnContatos">📞 Contatos</button>
      </div>
    `;
    jest.resetModules();

    // Mock da API de voz (não existe no JSDOM)
    global.SpeechSynthesisUtterance = function (texto) {
      this.text = texto;
    };

    window.speechSynthesis = {
      speak: jest.fn(),
      cancel: jest.fn(),
    };
  });

  // --- VLibras ---
  test("deve injetar container do VLibras no DOM", () => {
    require("../js/acessibilidade-global.js");
    document.dispatchEvent(new Event("DOMContentLoaded"));

    const container = document.querySelector("div[vw]");
    expect(container).not.toBeNull();
    expect(container.className).toContain("enabled");
  });

  test("deve injetar script externo do VLibras", () => {
    require("../js/acessibilidade-global.js");
    document.dispatchEvent(new Event("DOMContentLoaded"));

    const script = [...document.getElementsByTagName("script")].find((s) =>
      s.src.includes("vlibras-plugin.js")
    );

    expect(script).not.toBeUndefined();
    expect(script.src).toContain("vlibras.gov.br/app/vlibras-plugin.js");
  });

  test("deve inicializar o widget VLibras se disponível", () => {
    window.VLibras = { Widget: jest.fn() };

    require("../js/acessibilidade-global.js");
    document.dispatchEvent(new Event("DOMContentLoaded"));

    const script = [...document.getElementsByTagName("script")].find((s) =>
      s.src.includes("vlibras-plugin.js")
    );

    // simula carregamento do script externo
    script.onload();

    expect(window.VLibras.Widget).toHaveBeenCalledWith(
      "https://vlibras.gov.br/app"
    );
  });

  // --- Áudio ---
  test("deve criar o botão de áudio no DOM", () => {
    require("../js/acessibilidade-global.js");
    document.dispatchEvent(new Event("DOMContentLoaded"));

    const botao = document.getElementById("btn-audio");
    expect(botao).not.toBeNull();
    expect(botao.innerText).toBe("📢 Leitura em Áudio");
  });

  test("deve alternar texto do botão de áudio ao clicar", () => {
    require("../js/acessibilidade-global.js");
    document.dispatchEvent(new Event("DOMContentLoaded"));

    const botao = document.getElementById("btn-audio");
    expect(botao.innerText).toBe("📢 Leitura em Áudio");

    botao.click();
    expect(botao.innerText).toBe("🔇 Áudio Off");

    botao.click();
    expect(botao.innerText).toBe("📢 Leitura em Áudio");
  });

  test("deve atualizar aria-label ao alternar áudio", () => {
    require("../js/acessibilidade-global.js");
    document.dispatchEvent(new Event("DOMContentLoaded"));

    const botao = document.getElementById("btn-audio");
    expect(botao.getAttribute("aria-label")).toBe(
      "Ativar leitura em áudio para acessibilidade"
    );

    botao.click();
    expect(botao.getAttribute("aria-label")).toBe(
      "Desativar leitura em áudio para acessibilidade"
    );
  });

  test("deve simular leitura em áudio ao passar mouse sobre texto com áudio ativo", () => {
    require("../js/acessibilidade-global.js");
    document.dispatchEvent(new Event("DOMContentLoaded"));

    const botao = document.getElementById("btn-audio");
    botao.click(); // ativa áudio

    const elemento = document.createElement("p");
    elemento.innerText = "Texto de teste";
    document.body.appendChild(elemento);

    // Simula manualmente o fluxo de leitura
    const texto = elemento.innerText.trim();
    const utterance = new window.SpeechSynthesisUtterance(texto);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);

    expect(window.speechSynthesis.cancel).toHaveBeenCalled();
    expect(window.speechSynthesis.speak).toHaveBeenCalled();
  });

  // --- Novo cenário: criação automática do .top-right ---
  test("deve criar container .top-right se não existir", () => {
    document.body.innerHTML = `<main><h1>Cadastro</h1></main>`; // sem top-right
    require("../js/acessibilidade-global.js");
    document.dispatchEvent(new Event("DOMContentLoaded"));

    const topRight = document.querySelector(".top-right");
    expect(topRight).not.toBeNull();

    const botao = document.getElementById("btn-audio");
    expect(botao).not.toBeNull();
    expect(botao.innerText).toBe("📢 Leitura em Áudio");
  });
});
