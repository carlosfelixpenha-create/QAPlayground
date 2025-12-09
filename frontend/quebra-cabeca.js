let pecas = [];
let qtdAtual = 0;
let dragged = null;

function iniciarJogo(qtd) {
  // Por enquanto só o nível 2 está ajustado
  if (qtd !== 2) {
    alert("Ainda estamos ajustando os outros níveis. Teste apenas o nível de 2 peças.");
    return;
  }

  const tabuleiro = document.getElementById('tabuleiro');
  const mensagem = document.getElementById('mensagem');
  const botoes = document.getElementById('botoes-niveis');
  const textoNivel = document.getElementById('texto-nivel');
  const voltarBtn = document.getElementById('voltar');
  const navBtns = document.getElementById('botoes-navegacao');

  tabuleiro.innerHTML = "";
  mensagem.textContent = "";
  pecas = [];
  qtdAtual = qtd;

  // Esconde botões de níveis e navegação, mostra botão voltar
  botoes.style.display = "none";
  textoNivel.style.display = "none";
  navBtns.style.display = "none";
  voltarBtn.style.display = "inline-block";

  const cols = 1;
  const rows = 2;
  tabuleiro.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

  const imgSrc = "img/quebra-cabeca/robo2pcs.png";

  for (let i = 0; i < qtd; i++) {
    const peca = document.createElement('div');
    peca.className = "peca";
    peca.id = `peca-${qtd}-${i}`;
    peca.style.backgroundImage = `url('${imgSrc}')`;

    const row = i; // 0 ou 1
    const posY = -(100 / rows) * row; // 0% ou -50%

    peca.style.backgroundSize = `100% ${rows * 100}%`;
    peca.style.backgroundPosition = `0% ${posY}%`;

    peca.dataset.index = i;

    // drag & drop
    peca.draggable = true;
    peca.addEventListener("dragstart", dragStart);
    peca.addEventListener("dragend", dragEnd);
    peca.addEventListener("dragover", dragOver);
    peca.addEventListener("drop", drop);

    pecas.push(peca);
  }

  // embaralha
  pecas.sort(() => Math.random() - 0.5);

  pecas.forEach((p, idx) => {
    p.dataset.current = idx;
    tabuleiro.appendChild(p);
  });
}

function dragStart(e) {
  dragged = this;
  this.classList.add("dragging");
}

function dragEnd(e) {
  this.classList.remove("dragging");
  verificarVitoria();
}

function dragOver(e) {
  e.preventDefault();
}

function drop(e) {
  if (dragged !== this) {
    const tabuleiro = document.getElementById('tabuleiro');
    const draggedIndex = Array.from(tabuleiro.children).indexOf(dragged);
    const targetIndex = Array.from(tabuleiro.children).indexOf(this);

    if (draggedIndex > targetIndex) {
      tabuleiro.insertBefore(dragged, this);
    } else {
      tabuleiro.insertBefore(dragged, this.nextSibling);
    }
  }
}

function verificarVitoria() {
  const tabuleiro = document.getElementById('tabuleiro');
  const mensagem = document.getElementById('mensagem');
  const filhos = Array.from(tabuleiro.children);

  const correto = filhos.every((p, idx) => parseInt(p.dataset.index) === idx);

  if (correto) {
    mensagem.textContent = "🎉 Parabéns, você montou o quebra-cabeça de 2 peças!";
  }
}

function voltarMenu() {
  const tabuleiro = document.getElementById('tabuleiro');
  const botoes = document.getElementById('botoes-niveis');
  const textoNivel = document.getElementById('texto-nivel');
  const voltarBtn = document.getElementById('voltar');
  const navBtns = document.getElementById('botoes-navegacao');
  const mensagem = document.getElementById('mensagem');

  tabuleiro.innerHTML = "";
  mensagem.textContent = "";
  botoes.style.display = "block";
  textoNivel.style.display = "block";
  navBtns.style.display = "block";
  voltarBtn.style.display = "none";
}