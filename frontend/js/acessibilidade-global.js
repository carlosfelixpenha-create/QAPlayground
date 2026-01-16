// acessibilidade-global.js

// Injeta o VLibras (avatar + botão de acesso) em qualquer página
function injetarVLibras() {
  const container = document.createElement("div");
  container.setAttribute("vw", "");
  container.className = "enabled";
  container.innerHTML = `
    <div vw-access-button class="active"></div>
    <div vw-plugin-wrapper>
      <div class="vw-plugin-top-wrapper"></div>
    </div>
  `;
  document.body.appendChild(container);

  const script = document.createElement("script");
  script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
  script.onload = () => {
    if (window.VLibras && window.VLibras.Widget) {
      new window.VLibras.Widget("https://vlibras.gov.br/app");
    }
  };
  document.body.appendChild(script);
}

// --- Áudio para leitura ---
let audioAtivo = false;

function adicionarBotaoAudio() {
  let topRight = document.querySelector(".top-right");
  if (!topRight) {
    // cria o container se não existir
    topRight = document.createElement("div");
    topRight.className = "top-right";
    // insere no topo do body
    document.body.prepend(topRight);
  }

  // Garante layout com espaçamento entre botões
  topRight.style.display = "flex";
  topRight.style.alignItems = "center";
  topRight.style.gap = "20px"; // espaçamento consistente entre botões

  const botao = document.createElement("button");
  botao.id = "btn-audio";
  botao.innerText = "📢 Leitura em Áudio";
  botao.className = "btn-contatos"; // herda estilo do botão Contatos
  botao.setAttribute(
    "aria-label",
    "Ativar leitura em áudio para acessibilidade"
  );

  botao.addEventListener("click", () => {
    audioAtivo = !audioAtivo;
    botao.innerText = audioAtivo ? "🔇 Áudio Off" : "📢 Leitura em Áudio";
    botao.setAttribute(
      "aria-label",
      audioAtivo
        ? "Desativar leitura em áudio para acessibilidade"
        : "Ativar leitura em áudio para acessibilidade"
    );
    if (!audioAtivo) {
      speechSynthesis.cancel();
    }
  });

  // Insere o botão de áudio antes do botão Contatos (à esquerda)
  const btnContatos = document.getElementById("btnContatos");
  if (btnContatos) {
    topRight.insertBefore(botao, btnContatos);
  } else {
    topRight.appendChild(botao);
  }
}

function habilitarLeitura() {
  document.addEventListener("mouseover", (event) => {
    if (audioAtivo && event.target && event.target.innerText) {
      const texto = event.target.innerText.trim();
      if (texto.length > 0) {
        const utterance = new SpeechSynthesisUtterance(texto);
        speechSynthesis.cancel();
        speechSynthesis.speak(utterance);
      }
    }
  });
}

// --- Inicialização global ---
document.addEventListener("DOMContentLoaded", () => {
  injetarVLibras(); // mantém apenas o avatar padrão
  adicionarBotaoAudio(); // botão de áudio ao lado do Contatos (ou cria container se não existir)
  habilitarLeitura();
});
