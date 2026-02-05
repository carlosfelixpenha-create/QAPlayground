/* =========================================================
   Quebra-Cabeça – Lógica principal
   ========================================================= */

let pecas = [];
let dragged = null;
let jogoConcluido = false;

/* ===== Elementos ===== */
const modalMensagemEl = document.getElementById("modalMensagem");
const embaralharBtn = document.getElementById("embaralhar");

/* =========================================================
   Modal simples de mensagem
   ========================================================= */
function mostrarModalMensagem(texto, cor = "#333") {
  if (!modalMensagemEl) return;

  modalMensagemEl.style.display = "block";
  modalMensagemEl.style.color = cor;
  modalMensagemEl.querySelector("p")
    ? (modalMensagemEl.querySelector("p").textContent = texto)
    : (modalMensagemEl.textContent = texto);

  setTimeout(() => {
    modalMensagemEl.style.display = "none";
  }, 3000);
}

/* =========================================================
   Inicia jogo
   ========================================================= */
function iniciarJogo(qtd) {
  const tabuleiro = document.getElementById("tabuleiro");
  const referencia = document.getElementById("referencia");
  const mensagem = document.getElementById("mensagem");
  const refContainer = document.querySelector(".referencia-container");

  // Reset geral
  tabuleiro.innerHTML = "";
  referencia.innerHTML = "";
  mensagem.textContent = "";
  mensagem.style.display = "none";

  pecas = [];
  jogoConcluido = false;
  embaralharBtn.disabled = true;

  // Mostrar áreas
  tabuleiro.style.display = "grid";
  refContainer.style.display = "block";

  // Remove classes específicas
  tabuleiro.classList.remove("tabuleiro-32pcs");
  refContainer.classList.remove("referencia32pcs");

  // Define colunas
  let cols;
  if (qtd === 4 || qtd === 8) cols = 2;
  else if (qtd === 16) cols = 4;
  else if (qtd === 32) {
    cols = 4;
    tabuleiro.classList.add("tabuleiro-32pcs");
    refContainer.classList.add("referencia32pcs");
  }

  tabuleiro.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

  // Pasta de imagens
  const pasta = `../img/quebra-cabeca/nivel${qtd}`;

  // Imagem de referência
  referencia.innerHTML = `<img src="${pasta}/robo${qtd}pcs.png" alt="Referência">`;

  // Criação das peças
  for (let i = 0; i < qtd; i++) {
    const peca = document.createElement("div");
    peca.className = "peca";
    peca.style.backgroundImage = `url('${pasta}/robo${qtd}pcs_${i}.png')`;
    peca.dataset.index = i;
    aplicarEventos(peca);
    pecas.push(peca);
  }

  // Embaralha
  pecas.sort(() => Math.random() - 0.5);

  pecas.forEach((p) => tabuleiro.appendChild(p));

  // Atualiza botão ativo
  const botoesNivel = document.querySelectorAll("#botoes-niveis button");
  botoesNivel.forEach((btn) => btn.classList.remove("active"));
  const botaoAtual = Array.from(botoesNivel).find((btn) =>
    btn.textContent.includes(qtd),
  );
  if (botaoAtual) botaoAtual.classList.add("active");
}

/* =========================================================
   Eventos Drag & Drop
   ========================================================= */
function aplicarEventos(peca) {
  peca.draggable = true;
  peca.addEventListener("dragstart", dragStart);
  peca.addEventListener("dragend", dragEnd);
  peca.addEventListener("dragover", dragOver);
  peca.addEventListener("drop", drop);
}

function dragStart() {
  dragged = this;
  this.classList.add("dragging");
}

function dragEnd() {
  this.classList.remove("dragging");
}

function dragOver(e) {
  e.preventDefault();
}

function drop(e) {
  e.preventDefault();

  if (dragged && dragged !== this) {
    const tabuleiro = document.getElementById("tabuleiro");

    const draggedClone = dragged.cloneNode(true);
    const targetClone = this.cloneNode(true);

    tabuleiro.replaceChild(draggedClone, this);
    tabuleiro.replaceChild(targetClone, dragged);

    aplicarEventos(draggedClone);
    aplicarEventos(targetClone);

    // 🔑 Verifica vitória APÓS troca real
    verificarVitoria();
  }
}

/* =========================================================
   Verificação de vitória
   ========================================================= */
function verificarVitoria() {
  if (jogoConcluido) return;

  const tabuleiro = document.getElementById("tabuleiro");
  const filhos = Array.from(tabuleiro.children);

  const correto = filhos.every(
    (p, idx) => parseInt(p.dataset.index, 10) === idx,
  );

  if (correto) {
    jogoConcluido = true;

    mostrarModalMensagem(
      "🎉 Parabéns, você montou o quebra-cabeça!",
      "#3b82f6",
    );

    embaralharBtn.disabled = false;
  }
}

/* =========================================================
   Embaralhar novamente
   ========================================================= */
embaralharBtn.addEventListener("click", () => {
  const tabuleiro = document.getElementById("tabuleiro");

  pecas.sort(() => Math.random() - 0.5);
  tabuleiro.innerHTML = "";

  pecas.forEach((p) => tabuleiro.appendChild(p));

  jogoConcluido = false;
  embaralharBtn.disabled = true;

  mostrarModalMensagem("🔀 Tabuleiro embaralhado!", "#ffa200");
});

/* =========================================================
   Inicialização automática
   ========================================================= */
window.onload = () => {
  iniciarJogo(4);
};

/* =========================================================
   Export para testes (se aplicável)
   ========================================================= */
if (typeof module !== "undefined") {
  module.exports = {
    mostrarModalMensagem,
    iniciarJogo,
    aplicarEventos,
    dragStart,
    dragEnd,
    dragOver,
    drop,
    verificarVitoria,
  };
}
