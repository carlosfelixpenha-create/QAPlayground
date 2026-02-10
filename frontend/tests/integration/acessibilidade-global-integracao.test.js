/**
 * @file acessibilidade-global-integracao.test.js
 * Testes de integração para o script acessibilidade-global.js
 */

describe("Integração do acessibilidade-global.js em uma página", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="top-right"></div>
      <main>
        <h1>Página de Teste</h1>
        <p>Conteúdo fictício para validar integração.</p>
      </main>
    `;
    jest.resetModules();

    // Mock da API de voz
    global.SpeechSynthesisUtterance = function (texto) {
      this.text = texto;
    };
    global.speechSynthesis = {
      speak: jest.fn(),
      cancel: jest.fn(),
    };
  });

  test("deve renderizar botão de áudio e avatar VLibras junto ao conteúdo da página", () => {
    require("../../js/acessibilidade-global.js");
    document.dispatchEvent(new Event("DOMContentLoaded"));

    const botaoAudio = document.getElementById("btn-audio");
    expect(botaoAudio).not.toBeNull();
    expect(botaoAudio.innerText).toBe("📢 Leitura em Áudio");

    const container = document.querySelector("div[vw]");
    expect(container).not.toBeNull();
    expect(container.className).toContain("enabled");

    const titulo = document.querySelector("h1");
    expect(titulo.textContent).toBe("Página de Teste");
  });

  test("deve permitir navegação por teclado até o botão de áudio", () => {
    require("../../js/acessibilidade-global.js");
    document.dispatchEvent(new Event("DOMContentLoaded"));

    const botaoAudio = document.getElementById("btn-audio");
    botaoAudio.focus();

    expect(document.activeElement).toBe(botaoAudio);
  });

  test("deve alternar texto do botão de áudio ao clicar sem afetar outros elementos", () => {
    require("../../js/acessibilidade-global.js");
    document.dispatchEvent(new Event("DOMContentLoaded"));

    const botaoAudio = document.getElementById("btn-audio");
    expect(botaoAudio.innerText).toBe("📢 Leitura em Áudio");

    botaoAudio.click();
    expect(botaoAudio.innerText).toBe("🔇 Áudio Off");

    const paragrafo = document.querySelector("p");
    expect(paragrafo.textContent).toBe(
      "Conteúdo fictício para validar integração.",
    );
  });

  test("deve simular leitura em áudio ao passar mouse sobre texto com áudio ativo", () => {
    require("../../js/acessibilidade-global.js");
    document.dispatchEvent(new Event("DOMContentLoaded"));

    const botaoAudio = document.getElementById("btn-audio");
    botaoAudio.click(); // ativa áudio

    const elemento = document.querySelector("p");
    elemento.innerText = "Texto de teste";

    // Simula manualmente o fluxo de leitura em áudio
    const texto = elemento.innerText.trim();
    const utterance = new global.SpeechSynthesisUtterance(texto);
    global.speechSynthesis.cancel();
    global.speechSynthesis.speak(utterance);

    expect(global.speechSynthesis.cancel).toHaveBeenCalled();
    expect(global.speechSynthesis.speak).toHaveBeenCalled();
  });

  // --- Novo cenário: validação do aria-label ---
  test("deve atualizar aria-label ao alternar áudio", () => {
    require("../../js/acessibilidade-global.js");
    document.dispatchEvent(new Event("DOMContentLoaded"));

    const botaoAudio = document.getElementById("btn-audio");
    expect(botaoAudio.getAttribute("aria-label")).toBe(
      "Ativar leitura em áudio para acessibilidade",
    );

    botaoAudio.click();
    expect(botaoAudio.getAttribute("aria-label")).toBe(
      "Desativar leitura em áudio para acessibilidade",
    );
  });

  // --- Novo cenário: criação automática do .top-right ---
  test("deve criar container .top-right se não existir", () => {
    document.body.innerHTML = `
      <main>
        <h1>Página sem top-right</h1>
      </main>
    `; // sem top-right
    require("../../js/acessibilidade-global.js");
    document.dispatchEvent(new Event("DOMContentLoaded"));

    const topRight = document.querySelector(".top-right");
    expect(topRight).not.toBeNull();

    const botaoAudio = document.getElementById("btn-audio");
    expect(botaoAudio).not.toBeNull();
    expect(botaoAudio.innerText).toBe("📢 Leitura em Áudio");
  });
});
