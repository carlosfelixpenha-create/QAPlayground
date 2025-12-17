let pecas = [];
let dragged = null;

function iniciarJogo(qtd) {
  const tabuleiro = document.getElementById("tabuleiro");
  const referencia = document.getElementById("referencia");
  const mensagem = document.getElementById("mensagem");
  const botoes = document.getElementById("botoes-niveis");
  const textoNivel = document.getElementById("texto-nivel");
  const voltarBtn = document.getElementById("voltar");
  const navBtns = document.getElementById("botoes-navegacao");
  const wrapper = document.querySelector(".jogo-wrapper");
  const refContainer = document.querySelector(".referencia-container");

  // Mostrar tabuleiro e referência
  tabuleiro.style.display = "grid";
  refContainer.style.display = "block";

  // Esconder elementos iniciais
  botoes.style.display = "none";
  textoNivel.style.display = "none";
  navBtns.style.display = "none";

  // Mostrar botão voltar ao menu
  voltarBtn.style.display = "inline-block";

  // Reset
  tabuleiro.innerHTML = "";
  referencia.innerHTML = "";
  mensagem.textContent = "";
  mensagem.style.display = "none";
  pecas = [];

  // ✅ Remove apenas classes específicas, sem apagar tudo
  tabuleiro.classList.remove("tabuleiro-32pcs");
  refContainer.classList.remove("referencia32pcs");

  // ✅ Define grid automaticamente
  let cols;
  if (qtd === 4) cols = 2;
  else if (qtd === 8) cols = 2;
  else if (qtd === 16) cols = 4;
  else if (qtd === 32) {
    cols = 4; // 4 colunas × 8 linhas
    tabuleiro.classList.add("tabuleiro-32pcs"); // ✅ classe exclusiva do tabuleiro
    refContainer.classList.add("referencia32pcs"); // ✅ classe exclusiva da referência
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
  const mensagem = document.getElementById("mensagem");
  const filhos = Array.from(tabuleiro.children);

  const correto = filhos.every((p, idx) => parseInt(p.dataset.index) === idx);

  if (correto) {
    mensagem.textContent = "🎉 Parabéns, você montou o quebra-cabeça!";
    mensagem.style.display = "block";
  }
}

function voltarMenu() {
  const tabuleiro = document.getElementById("tabuleiro");
  const referencia = document.getElementById("referencia");
  const botoes = document.getElementById("botoes-niveis");
  const textoNivel = document.getElementById("texto-nivel");
  const voltarBtn = document.getElementById("voltar");
  const navBtns = document.getElementById("botoes-navegacao");
  const mensagem = document.getElementById("mensagem");
  const wrapper = document.querySelector(".jogo-wrapper");
  const refContainer = document.querySelector(".referencia-container");

  // Limpar conteúdos
  tabuleiro.innerHTML = "";
  referencia.innerHTML = "";
  mensagem.textContent = "";
  mensagem.style.display = "none";

  // Esconder tabuleiro e referência
  tabuleiro.style.display = "none";
  refContainer.style.display = "none";

  // Mostrar elementos iniciais
  botoes.style.display = "flex";
  textoNivel.style.display = "block";
  navBtns.style.display = "flex";

  // Esconder botão voltar ao menu
  voltarBtn.style.display = "none";
}
