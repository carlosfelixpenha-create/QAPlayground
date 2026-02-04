// Seleciona palavras e slots de imagens
const palavras = document.querySelectorAll(".tag-palavra");
const itens = document.querySelectorAll(".item-slot");

// HUD
const movimentosEl = document.getElementById("movimentos");
const acertosEl = document.getElementById("acertos");
const errosEl = document.getElementById("erros");
const mensagemFinalEl = document.getElementById("mensagem-final");

// Referências das modais
const modalMensagem = document.getElementById("modalMensagem");
const modalMensagemErro = document.getElementById("modalMensagemErro");

// Estado do jogo
let movimentos = 0;
let acertos = 0;
let erros = 0;
const TOTAL_PARES = itens.length;

// Atualiza HUD
function updateHUD() {
  movimentosEl.textContent = movimentos;
  acertosEl.textContent = acertos;
  errosEl.textContent = erros;
}

// Mostra modal rápida
function mostrarModal(titulo, texto, cor = "#333") {
  document.getElementById("modalTitulo").textContent = titulo;
  document.getElementById("modalTexto").textContent = texto;
  document.getElementById("modalTexto").style.color = cor;
  modalMensagem.style.display = "block";

  setTimeout(() => {
    modalMensagem.style.display = "none";
  }, 2000);
}

// Mostra modal de erro detalhada
function mostrarModalErro(texto) {
  document.getElementById("modalTextoErro").textContent = texto;
  modalMensagemErro.style.display = "block";

  setTimeout(() => {
    modalMensagemErro.style.display = "none";
  }, 3000);
}

// Fechar manual modal erro
document.getElementById("modalFecharErro").addEventListener("click", () => {
  modalMensagemErro.style.display = "none";
});
document.getElementById("modalOkErro").addEventListener("click", () => {
  modalMensagemErro.style.display = "none";
});

// Finaliza se todos pares estiverem corretos
function finalizarSeConcluido() {
  if (acertos !== TOTAL_PARES) return;

  let titulo = "";
  const detalhe = `Concluído em ${movimentos} movimentos.`;

  if (movimentos === TOTAL_PARES) titulo = "Uhuuuuuuu!!! Sucesso✨";
  else if (movimentos === TOTAL_PARES + 1) titulo = "Sucesso 🎉";
  else if (movimentos === TOTAL_PARES + 2) titulo = "Parabéns 👏";
  else titulo = "Boa! Mas dá pra melhorar a atenção 😉";

  mensagemFinalEl.innerHTML = `
    <p style="font-weight:600; margin:8px 0;">${titulo}</p>
    <p style="margin:0; color:#555;">${detalhe}</p>
  `;

  palavras.forEach((p) => p.setAttribute("draggable", "false"));
  mostrarModal("Jogo concluído!", "Opaaaa! jogo concluído!", "#3b82f6");
}

// Configura arrastar palavras
palavras.forEach((p) => {
  p.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("tipo", p.dataset.tipo);
    e.dataTransfer.setData("texto", p.innerText);
  });
});

// Configura drop nas imagens
itens.forEach((item) => {
  item.addEventListener("dragover", (e) => e.preventDefault());

  item.addEventListener("drop", (e) => {
    e.preventDefault();

    // Se já está correto, ignora qualquer drop
    if (item.classList.contains("correto")) return;

    const tipo = e.dataTransfer.getData("tipo");
    const texto = e.dataTransfer.getData("texto");

    movimentos++;

    // Remove qualquer feedback anterior (erro ou acerto)
    item.querySelectorAll("p").forEach((p) => p.remove());

    if (tipo === item.dataset.tipo) {
      // ACERTO
      acertos++;
      item.classList.add("correto");
      item.classList.remove("errado");

      const acertoText = document.createElement("p");
      acertoText.textContent = `✔ ${texto}`;
      acertoText.style.color = "#22c55e";
      acertoText.style.fontWeight = "600";
      acertoText.style.marginTop = "6px";
      acertoText.style.opacity = "0";
      acertoText.style.transition = "opacity 0.5s ease, transform 0.5s ease";

      item.appendChild(acertoText);

      requestAnimationFrame(() => {
        acertoText.style.opacity = "1";
        acertoText.style.transform = "translateY(-5px)";
      });

      // Palavra usada não arrastável
      const palavraUsada = Array.from(palavras).find(
        (p) => p.dataset.tipo === tipo,
      );
      if (palavraUsada) {
        palavraUsada.setAttribute("draggable", "false");
        palavraUsada.style.opacity = "0.5";
      }

      if (acertos >= 3) {
        mostrarModal("Acerto!", "Boa, acertou mais um!", "#22c55e");
      }
    } else {
      // ERRO (apenas um por slot)
      erros++;
      item.classList.add("errado");

      const erroText = document.createElement("p");
      erroText.textContent = `✖ ${texto}`;
      erroText.style.color = "#ef4444";
      erroText.style.fontWeight = "600";
      erroText.style.marginTop = "6px";
      erroText.style.opacity = "0";
      erroText.style.transition = "opacity 0.5s ease, transform 0.5s ease";

      item.appendChild(erroText);

      requestAnimationFrame(() => {
        erroText.style.opacity = "1";
        erroText.style.transform = "translateY(-5px)";
      });

      if (erros >= 3) {
        mostrarModalErro("Ops, atenção redobrada!");
      }
    }

    updateHUD();
    finalizarSeConcluido();
  });
});

// Inicializa HUD
updateHUD();

// Botão reiniciar jogo
const reiniciarBtn = document.getElementById("reiniciar");
if (reiniciarBtn) {
  reiniciarBtn.addEventListener("click", () => {
    movimentos = 0;
    acertos = 0;
    erros = 0;

    updateHUD();
    mensagemFinalEl.innerHTML = "";
    modalMensagem.style.display = "none";
    modalMensagemErro.style.display = "none";

    itens.forEach((slot) => {
      slot.classList.remove("correto", "errado");
      slot.querySelectorAll("p").forEach((p) => p.remove());
    });

    palavras.forEach((p) => {
      p.setAttribute("draggable", "true");
      p.style.opacity = "1";
    });
  });
}

// Exporta funções para testes
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    updateHUD,
    mostrarModal,
    mostrarModalErro,
    finalizarSeConcluido,
    _state: {
      getMovimentos: () => movimentos,
      setMovimentos: (v) => (movimentos = v),
      getAcertos: () => acertos,
      setAcertos: (v) => (acertos = v),
      getErros: () => erros,
      setErros: (v) => (erros = v),
    },
  };
}
