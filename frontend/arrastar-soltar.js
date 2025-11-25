// Seleciona palavras e slots de imagens
const palavras = document.querySelectorAll(".tag-palavra");
const itens = document.querySelectorAll(".item-slot");

// Configura evento de arrastar nas palavras
palavras.forEach(p => {
  p.addEventListener("dragstart", e => {
    e.dataTransfer.setData("tipo", p.dataset.tipo);
    e.dataTransfer.setData("texto", p.innerText);
  });
});

// Configura evento de soltar nas imagens
itens.forEach(item => {
  item.addEventListener("dragover", e => e.preventDefault());
  item.addEventListener("drop", e => {
    e.preventDefault();
    const tipo = e.dataTransfer.getData("tipo");
    const texto = e.dataTransfer.getData("texto");

    if (tipo === item.dataset.tipo) {
      // Acertou
      item.classList.add("correto");
      item.classList.remove("errado");
      item.innerHTML = `
        <img src="img/${item.dataset.tipo}.jpg" alt="${item.dataset.tipo}">
        <p style="color:green;font-weight:600;">✔ ${texto}</p>
      `;
    } else {
      // Errou
      item.classList.add("errado");
      item.classList.remove("correto");
    }
  });
});

// Botão de reiniciar jogo
document.getElementById('reiniciar').addEventListener('click', () => {
  itens.forEach(slot => {
    slot.classList.remove('correto', 'errado');
    const tipo = slot.dataset.tipo;
    slot.innerHTML = `<img src="img/${tipo}.jpg" alt="${tipo}">`;
  });
});