let pecas = [];
let dragged = null;

function iniciarJogo(qtd) {
  const tabuleiro = document.getElementById('tabuleiro');
  const referencia = document.getElementById('referencia');
  const mensagem = document.getElementById('mensagem');
  const botoes = document.getElementById('botoes-niveis');
  const textoNivel = document.getElementById('texto-nivel');
  const voltarBtn = document.getElementById('voltar');
  const navBtns = document.getElementById('botoes-navegacao');

  tabuleiro.innerHTML = "";
  referencia.innerHTML = "";
  mensagem.textContent = "";
  mensagem.style.display = "none";
  pecas = [];

  // Esconde botões de níveis e navegação, mostra botão voltar
  botoes.style.display = "none";
  textoNivel.style.display = "none";
  navBtns.style.display = "none";
  voltarBtn.style.display = "inline-block";

  // Define grid automaticamente
  let cols, rows;
  if (qtd === 2) { cols = 1; rows = 2; }
  else if (qtd === 4) { cols = 2; rows = 2; }
  else if (qtd === 8) { cols = 2; rows = 4; }
  else if (qtd === 16) { cols = 4; rows = 4; }

  tabuleiro.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

  // Caminho da pasta correspondente
  const pasta = `img/quebra-cabeca/nivel${qtd}`;

  // adiciona imagem de referência
  referencia.innerHTML = `<img src="${pasta}/robo${qtd}pcs.png" alt="Imagem completa nível ${qtd}">`;

  // cria peças
  for (let i = 0; i < qtd; i++) {
    const peca = document.createElement('div');
    peca.className = "peca";
    peca.id = `peca-${qtd}-${i}`;
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
}

function aplicarEventos(peca) {
  peca.draggable = true;
  peca.addEventListener("dragstart", dragStart);
  peca.addEventListener("dragend", dragEnd);
  peca.addEventListener("dragover", dragOver);
  peca.addEventListener("drop", drop);
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
  e.preventDefault();

  if (dragged !== this) {
    const tabuleiro = document.getElementById('tabuleiro');

    const draggedClone = dragged.cloneNode(true);
    const targetClone = this.cloneNode(true);

    tabuleiro.replaceChild(draggedClone, this);
    tabuleiro.replaceChild(targetClone, dragged);

    aplicarEventos(draggedClone);
    aplicarEventos(targetClone);
  }
}

function verificarVitoria() {
  const tabuleiro = document.getElementById('tabuleiro');
  const mensagem = document.getElementById('mensagem');
  const filhos = Array.from(tabuleiro.children);

  const correto = filhos.every((p, idx) => parseInt(p.dataset.index) === idx);

  if (correto) {
    mensagem.textContent = "🎉 Parabéns, você montou o quebra-cabeça!";
    mensagem.style.display = "block";
  }
}

function voltarMenu() {
  const tabuleiro = document.getElementById('tabuleiro');
  const referencia = document.getElementById('referencia');
  const botoes = document.getElementById('botoes-niveis');
  const textoNivel = document.getElementById('texto-nivel');
  const voltarBtn = document.getElementById('voltar');
  const navBtns = document.getElementById('botoes-navegacao');
  const mensagem = document.getElementById('mensagem');

  tabuleiro.innerHTML = "";
  referencia.innerHTML = "";
  mensagem.textContent = "";
  mensagem.style.display = "none";
  botoes.style.display = "block";
  textoNivel.style.display = "block";
  navBtns.style.display = "flex";
  navBtns.style.justifyContent = "center";
  voltarBtn.style.display = "none";
}