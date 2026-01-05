// Domínio oficial do GitHub Pages
const dominioOficial = "carlosfelixpenha-create.github.io";

// Contador de visitantes
if (window.location.hostname === dominioOficial) {
  fetch("https://api.countapi.xyz/hit/qaplayground/visitas")
    .then((response) => response.json())
    .then((data) => {
      document.getElementById(
        "contador-container"
      ).innerText = `Visitantes: ${data.value}`;
    });
} else {
  document.getElementById("contador-container").innerText = "Visitantes: 0";
}

// Inicializa os contadores de avaliação se não existirem
fetch(
  "https://api.countapi.xyz/create?namespace=qaplayground&key=soma&value=0"
);
fetch(
  "https://api.countapi.xyz/create?namespace=qaplayground&key=total&value=0"
);
// Inicializa o contador de sugestões se não existir
fetch(
  "https://api.countapi.xyz/create?namespace=qaplayground&key=sugestoes&value=0"
);

// Funções do modal de avaliação
function abrirModalAvaliacao() {
  const modal = document.getElementById("modal-avaliacao");
  if (modal) modal.style.display = "flex";
}

function fecharModalAvaliacao() {
  const modal = document.getElementById("modal-avaliacao");
  if (modal) modal.style.display = "none";
}

function avaliar(nota) {
  const estrelas = document.querySelectorAll("#estrelas span");
  estrelas.forEach((estrela, i) => {
    if (i < nota) {
      estrela.textContent = "★";
      estrela.classList.add("selecionada");
    } else {
      estrela.textContent = "☆";
      estrela.classList.remove("selecionada");
    }
  });

  const resultado = document.getElementById("resultado");
  const feedbackExtra = document.getElementById("feedback-extra");

  if (nota <= 3) {
    const texto = nota === 1 ? "estrela" : "estrelas";
    resultado.innerHTML = `Você avaliou nossa plataforma com ${nota} ${texto}!<br>O que podemos melhorar?`;
    if (feedbackExtra) feedbackExtra.style.display = "block";
  } else if (nota === 4) {
    resultado.innerText =
      "Você avaliou nossa plataforma com 4 estrelas! Obrigado!";
    if (feedbackExtra) feedbackExtra.style.display = "none";
    // Fecha automaticamente após 3 segundos
    setTimeout(fecharModalAvaliacao, 3000);
  } else if (nota === 5) {
    resultado.innerText =
      "Você avaliou nossa plataforma com 5 estrelas! Uhuuuu, sinal que gostou!";
    if (feedbackExtra) feedbackExtra.style.display = "none";
    // Fecha automaticamente após 3 segundos
    setTimeout(fecharModalAvaliacao, 3000);
  }

  // Envia a nota para a API
  fetch(`https://api.countapi.xyz/update/qaplayground/soma?amount=${nota}`)
    .then((response) => response.json())
    .then(() => {
      return fetch("https://api.countapi.xyz/hit/qaplayground/total");
    })
    .then((response) => response.json())
    .then(() => {
      atualizarMedia();
    });

  // Marca que já avaliou nesta sessão e desabilita o botão
  sessionStorage.setItem("avaliou", "true");
  const btnAvaliar = document.querySelector(
    "button[onclick='abrirModalAvaliacao()']"
  );
  if (btnAvaliar) btnAvaliar.disabled = true;
}

function enviarSugestao() {
  const comentario = document.getElementById("comentario-extra")?.value || "";
  const notaSelecionada = document.querySelectorAll(
    "#estrelas .selecionada"
  ).length;

  if (notaSelecionada <= 3) {
    if (comentario.trim() !== "") {
      // Salva sugestão curta no CountAPI
      fetch("https://api.countapi.xyz/update/qaplayground/sugestoes?amount=1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nota: notaSelecionada, comentario: comentario }),
      })
        .then(() => {
          alert("Sugestão registrada com sucesso!");
          fecharModalAvaliacao();
        })
        .catch(() => {
          alert("Erro ao registrar sugestão!");
          fecharModalAvaliacao();
        });
    } else {
      // Campo vazio → apenas fecha modal
      fecharModalAvaliacao();
    }
  } else {
    // Para notas 4 e 5, já fecha automaticamente
    fecharModalAvaliacao();
  }
}

function atualizarMedia() {
  Promise.all([
    fetch("https://api.countapi.xyz/get/qaplayground/soma").then((r) =>
      r.json()
    ),
    fetch("https://api.countapi.xyz/get/qaplayground/total").then((r) =>
      r.json()
    ),
  ]).then(([somaData, totalData]) => {
    const soma = somaData.value || 0;
    const total = totalData.value || 0;
    const media = total > 0 ? (soma / total).toFixed(1) : "-";

    const mediaAvaliacao = document.getElementById("media-avaliacao");
    if (mediaAvaliacao) {
      mediaAvaliacao.innerText = `⭐ Média: ${media}`;
    }

    const mediaContainer = document.getElementById("media-container");
    if (mediaContainer) {
      mediaContainer.innerText = `⭐ Média: ${media}`;
    }
  });
}

// Atualiza média ao carregar
atualizarMedia();

// Verifica se já avaliou nesta sessão e desabilita o botão
window.addEventListener("load", () => {
  if (sessionStorage.getItem("avaliou") === "true") {
    const btnAvaliar = document.querySelector(
      "button[onclick='abrirModalAvaliacao()']"
    );
    if (btnAvaliar) btnAvaliar.disabled = true;
  }
});

// ----------------------
// Funções do modal de contatos
// ----------------------
function abrirModalContatos() {
  const modal = document.getElementById("modal-contatos");
  if (modal) modal.style.display = "flex";
}

function fecharModalContatos() {
  const modal = document.getElementById("modal-contatos");
  if (modal) modal.style.display = "none";
}

const btnOk = document.getElementById("modalContatosOk");
if (btnOk) {
  btnOk.onclick = function () {
    fecharModalContatos();
  };
}

window.addEventListener("click", function (event) {
  const modal = document.getElementById("modal-contatos");
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

// ----------------------
// Ação visual para o botão de contatos
// ----------------------
window.addEventListener("load", () => {
  const btnContatos = document.getElementById("btnContatos");
  if (btnContatos) {
    setTimeout(() => {
      btnContatos.classList.add("show");
    }, 500);
  }
});
