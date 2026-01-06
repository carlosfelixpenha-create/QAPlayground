let pecas = [];
let dragged = null;

const modalMensagemEl = document.getElementById("modal-mensagem");
const embaralharBtn = document.getElementById("embaralhar");

function mostrarModalMensagem(texto, cor = "#333") {
  modalMensagemEl.textContent = texto;
  modalMensagemEl.style.color = cor;
  modalMensagemEl.style.display = "block";

  setTimeout(() => {
    modalMensagemEl.style.display = "none";
  }, 3000); // 3 segundos
}

function iniciarJogo(qtd) {
  const tabuleiro = document.getElementById("tabuleiro");
  const referencia = document.getElementById("referencia");
  const mensagem = document.getElementById("mensagem");
  const refContainer = document.querySelector(".referencia-container");

  // Mostrar tabuleiro e referência
  tabuleiro.style.display = "grid";
  refContainer.style.display = "block";

  // Reset
  tabuleiro.innerHTML = "";
  referencia.innerHTML = "";
  mensagem.textContent = "";
  mensagem.style.display = "none";
  pecas = [];

  // Remove classes específicas
  tabuleiro.classList.remove("tabuleiro-32pcs");
  refContainer.classList.remove("referencia32pcs");

  // Define grid automaticamente
  let cols;
  if (qtd === 4) cols = 2;
  else if (qtd === 8) cols = 2;
  else if (qtd === 16) cols = 4;
  else if (qtd === 32) {
    cols = 4; // 4 colunas × 8 linhas
    tabuleiro.classList.add("tabuleiro-32pcs");
    refContainer.classList.add("referencia32pcs");
  }

  tabuleiro.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

  // Caminho da pasta correspondente
  const pasta = `img/quebra-cabeca/nivel${qtd}`;

  // adiciona imagem de referência
  referencia.innerHTML = `<img src="${pasta}/robo${qtd}pcs.png">`;

  // cria peças
  for (let i = 0; i < qtd; i++) {
    const peca = document.createElement("div");
    peca.className = "peca";
    peca.style.backgroundImage = `url('${pasta}/robo${qtd}pcs_${i}.png')`;
    peca.dataset.index = i;
    aplicarEventos(peca);
    pecas.push(peca);
  }

  // embaralha
  pecas.sort(() => Math.random() - 0.5);

  pecas.forEach((p, idx) => {
    p.dataset.current = idx;
    tabuleiro.appendChild(p);
  });

  // Atualiza botão ativo
  const botoesNivel = document.querySelectorAll("#botoes-niveis button");
  botoesNivel.forEach((btn) => btn.classList.remove("active"));
  const botaoAtual = Array.from(botoesNivel).find((btn) =>
    btn.textContent.includes(qtd)
  );
  if (botaoAtual) botaoAtual.classList.add("active");

  // Desabilita botão embaralhar ao iniciar novo jogo
  embaralharBtn.disabled = true;
}

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
  verificarVitoria();
}

function dragOver(e) {
  e.preventDefault();
}

function drop(e) {
  e.preventDefault();

  if (dragged !== this) {
    const tabuleiro = document.getElementById("tabuleiro");

    const draggedClone = dragged.cloneNode(true);
    const targetClone = this.cloneNode(true);

    tabuleiro.replaceChild(draggedClone, this);
    tabuleiro.replaceChild(targetClone, dragged);

    aplicarEventos(draggedClone);
    aplicarEventos(targetClone);
  }
}

function verificarVitoria() {
  const tabuleiro = document.getElementById("tabuleiro");
  const filhos = Array.from(tabuleiro.children);

  const correto = filhos.every((p, idx) => parseInt(p.dataset.index) === idx);

  if (correto) {
    mostrarModalMensagem(
      "🎉 Parabéns, você montou o quebra-cabeça!",
      "#3b82f6"
    );
    embaralharBtn.disabled = false; // habilita botão
  }
}

// Função para embaralhar novamente
embaralharBtn.addEventListener("click", () => {
  pecas.sort(() => Math.random() - 0.5);
  const tabuleiro = document.getElementById("tabuleiro");
  tabuleiro.innerHTML = "";
  pecas.forEach((p, idx) => {
    p.dataset.current = idx;
    tabuleiro.appendChild(p);
  });

  embaralharBtn.disabled = true; // desabilita até próxima vitória
  mostrarModalMensagem("Tabuleiro embaralhado!", "#ffa200ff");
});

// ✅ Inicia automaticamente com 4 peças
window.onload = function () {
  iniciarJogo(4);
};

// exporta para testes unitários
module.exports = {
  mostrarModalMensagem,
  iniciarJogo,
  aplicarEventos,
  dragStart,
  dragEnd,
  dragOver,
  drop,
  verificarVitoria,

  _state: {
    getPecas: () => pecas,
    setPecas: (arr) => (pecas = arr),
    getDragged: () => dragged,
    setDragged: (val) => (dragged = val),
  },
};
