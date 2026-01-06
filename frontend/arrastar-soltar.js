// Seleciona palavras e slots de imagens
const palavras = document.querySelectorAll(".tag-palavra");
const itens = document.querySelectorAll(".item-slot");

// HUD
const movimentosEl = document.getElementById("movimentos");
const acertosEl = document.getElementById("acertos");
const errosEl = document.getElementById("erros");
const mensagemFinalEl = document.getElementById("mensagem-final");
const modalMensagemEl = document.getElementById("modal-mensagem"); // modal centralizado

// Estado do jogo
let movimentos = 0;
let acertos = 0;
let erros = 0;
const TOTAL_PARES = itens.length; // 7

function updateHUD() {
  movimentosEl.textContent = movimentos;
  acertosEl.textContent = acertos;
  errosEl.textContent = erros;
}

// Função para mostrar modal informativo
function mostrarModalMensagem(texto, cor = "#333") {
  modalMensagemEl.textContent = texto;
  modalMensagemEl.style.color = cor;
  modalMensagemEl.style.display = "block";

  setTimeout(() => {
    modalMensagemEl.style.display = "none";
  }, 2000);
}

function finalizarSeConcluido() {
  if (acertos === TOTAL_PARES) {
    let titulo = "";
    let detalhe = `Concluído em ${movimentos} movimentos.`;

    if (movimentos === 7) {
      titulo = "Uhuuuuuuu!!! Sucesso✨";
    } else if (movimentos === 8) {
      titulo = "Sucesso 🎉";
    } else if (movimentos === 9) {
      titulo = "Parabéns 👏";
    } else {
      titulo = "Boa! Mas dá pra melhorar a atenção 😉";
    }

    mensagemFinalEl.innerHTML = `
      <p style="font-weight:600; margin:8px 0;">${titulo}</p>
      <p style="margin:0; color:#555;">${detalhe}</p>
    `;

    // Desabilitar novos arrastos após finalizar
    palavras.forEach((p) => p.setAttribute("draggable", "false"));

    // Modal final de conclusão (independente de acertos/erros)
    mostrarModalMensagem("Opaaaa! jogo concluído!", "#3b82f6");
  }
}

// Configura evento de arrastar nas palavras
palavras.forEach((p) => {
  p.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("tipo", p.dataset.tipo);
    e.dataTransfer.setData("texto", p.innerText);
  });
});

// Configura evento de soltar nas imagens
itens.forEach((item) => {
  item.addEventListener("dragover", (e) => e.preventDefault());

  item.addEventListener("drop", (e) => {
    e.preventDefault();

    // Se já está correto, não contar novo movimento
    if (item.classList.contains("correto")) {
      return;
    }

    const tipo = e.dataTransfer.getData("tipo");
    const texto = e.dataTransfer.getData("texto");

    // Conta movimento
    movimentos++;

    if (tipo === item.dataset.tipo) {
      // Acertou
      acertos++;
      item.classList.add("correto");
      item.classList.remove("errado");
      item.innerHTML = `
        <img src="img/arrastar_soltar/${item.dataset.tipo}.jpg" alt="${item.dataset.tipo}">
        <p style="color:green;font-weight:600; margin-top:6px;">✔ ${texto}</p>
      `;

      // Tornar a palavra usada não arrastável
      const palavraUsada = Array.from(palavras).find(
        (p) => p.dataset.tipo === tipo
      );
      if (palavraUsada) {
        palavraUsada.setAttribute("draggable", "false");
        palavraUsada.style.opacity = "0.5";
      }

      // Modal motivacional de acerto (a partir do 3º)
      if (acertos >= 3) {
        mostrarModalMensagem("Boa, acertou mais um!", "#22c55e");
      }
    } else {
      // Errou
      erros++;
      item.classList.add("errado");
      item.classList.remove("correto");

      // Modal motivacional de erro (a partir do 3º)
      if (erros >= 3) {
        mostrarModalMensagem("Ops, atenção redobrada!", "#ef4444");
      }
    }

    updateHUD();
    finalizarSeConcluido();
  });
});

// Inicializa HUD (só se os elementos já existem)
if (movimentosEl && acertosEl && errosEl) {
  updateHUD();
}

// Botão de reiniciar jogo (protegido)
const reiniciarBtn = document.getElementById("reiniciar");
if (reiniciarBtn) {
  reiniciarBtn.addEventListener("click", () => {
    movimentos = 0;
    acertos = 0;
    erros = 0;
    updateHUD();
    mensagemFinalEl.innerHTML = "";
    modalMensagemEl.style.display = "none"; // limpa modal

    itens.forEach((slot) => {
      slot.classList.remove("correto", "errado");
      const tipo = slot.dataset.tipo;
      slot.innerHTML = `<img src="img/arrastar_soltar/${tipo}.jpg" alt="${tipo}">`;
    });

    palavras.forEach((p) => {
      p.setAttribute("draggable", "true");
      p.style.opacity = "1";
    });
  });
}

// Exporta funções para os testes
module.exports = {
  updateHUD,
  mostrarModalMensagem,
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
