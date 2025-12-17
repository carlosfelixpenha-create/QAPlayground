function iniciarJogo104() {
  const tabuleiro = document.getElementById("tabuleiro104pcs");
  tabuleiro.innerHTML = "";

  const totalPecas = 104;

  // cria array [0, 1, 2, ..., 103]
  let indices = Array.from({ length: totalPecas }, (_, i) => i);

  // embaralha o array
  indices.sort(() => Math.random() - 0.5);

  // cria as peças embaralhadas
  indices.forEach((i) => {
    const peca = document.createElement("div");
    peca.classList.add("peca");

    // imagem da peça
    peca.style.backgroundImage = `url('img/quebra-cabeca/nivel128/robo104pcs_${i}.png')`;

    // salva o índice correto da peça
    peca.dataset.index = i;

    // permite arrastar
    peca.draggable = true;

    // eventos de arrastar
    peca.addEventListener("dragstart", dragStart);
    peca.addEventListener("dragover", dragOver);
    peca.addEventListener("drop", drop);

    tabuleiro.appendChild(peca);
  });

  // mostra a referência
  document.getElementById(
    "referencia"
  ).innerHTML = `<img src="img/quebra-cabeca/nivel128/robo104pcs.png" alt="Imagem de referência">`;
}

// peça sendo arrastada
let pecaArrastada = null;

function dragStart(e) {
  pecaArrastada = this;
}

// permite soltar
function dragOver(e) {
  e.preventDefault();
}

// troca as peças
function drop(e) {
  e.preventDefault();

  if (pecaArrastada === this) return;

  const tempBg = this.style.backgroundImage;
  const tempIndex = this.dataset.index;

  this.style.backgroundImage = pecaArrastada.style.backgroundImage;
  this.dataset.index = pecaArrastada.dataset.index;

  pecaArrastada.style.backgroundImage = tempBg;
  pecaArrastada.dataset.index = tempIndex;

  verificarConclusao();
}

// verifica se todas as peças estão na posição correta
function verificarConclusao() {
  const pecas = document.querySelectorAll("#tabuleiro104pcs .peca");

  for (let i = 0; i < pecas.length; i++) {
    if (parseInt(pecas[i].dataset.index) !== i) {
      return; // ainda não terminou
    }
  }

  // se chegou aqui → terminou!
  document.getElementById("mensagem").innerHTML =
    "<h2 style='color: green;'>✅ Quebra-cabeça concluído com sucesso!</h2>";
}

// inicia automaticamente
window.onload = iniciarJogo104;
