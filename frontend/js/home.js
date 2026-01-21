// Domínio oficial do GitHub Pages
const dominioOficial = "carlosfelixpenha-create.github.io";

// ----------------------
// Funções do modal de avaliação
// ----------------------
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

  if (nota === 1) {
    if (resultado) {
      resultado.innerText =
        "Você avaliou nossa plataforma com 1 estrela! Estamos nos atualizando!";
    }
    if (feedbackExtra) feedbackExtra.style.display = "none";
    setTimeout(fecharModalAvaliacao, 3000);
  } else if (nota === 2) {
    if (resultado) {
      resultado.innerText =
        "Você avaliou nossa plataforma com 2 estrelas! Melhoria continua!";
    }
    if (feedbackExtra) feedbackExtra.style.display = "none";
    setTimeout(fecharModalAvaliacao, 3000);
  } else if (nota === 3) {
    if (resultado) {
      resultado.innerText =
        "Você avaliou nossa plataforma com 3 estrelas! Vamos chegar la juntos!";
    }
    if (feedbackExtra) feedbackExtra.style.display = "none";
    setTimeout(fecharModalAvaliacao, 3000);
  } else if (nota === 4) {
    if (resultado) {
      resultado.innerText =
        "Você avaliou nossa plataforma com 4 estrelas! Obrigado!";
    }
    if (feedbackExtra) feedbackExtra.style.display = "none";
    setTimeout(fecharModalAvaliacao, 3000);
  } else if (nota === 5) {
    if (resultado) {
      resultado.innerText =
        "Você avaliou nossa plataforma com 5 estrelas! Uhuuuu, sinal que gostou!";
    }
    if (feedbackExtra) feedbackExtra.style.display = "none";
    setTimeout(fecharModalAvaliacao, 3000);
  }

  // Marca que já avaliou na sessão
  if (typeof sessionStorage !== "undefined") {
    sessionStorage.setItem("avaliou", "true");
  }
  const btnAvaliar = document.querySelector(
    "button[onclick='abrirModalAvaliacao()']",
  );
  if (btnAvaliar) btnAvaliar.disabled = true;
}

function enviarSugestao() {
  const comentario = document.getElementById("comentario-extra")?.value || "";
  const notaSelecionada = document.querySelectorAll(
    "#estrelas .selecionada",
  ).length;

  if (notaSelecionada <= 3) {
    if (comentario.trim() !== "") {
      alert("Sugestão registrada com sucesso!");
      fecharModalAvaliacao();
    } else {
      fecharModalAvaliacao();
    }
  } else {
    fecharModalAvaliacao();
  }
}

// ✅ Removido atualizarMedia() e chamada dela

if (typeof window !== "undefined") {
  window.addEventListener("load", () => {
    if (
      typeof sessionStorage !== "undefined" &&
      sessionStorage.getItem("avaliou") === "true"
    ) {
      const btnAvaliar = document.querySelector(
        "button[onclick='abrirModalAvaliacao()']",
      );
      if (btnAvaliar) btnAvaliar.disabled = true;
    }
  });
}

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

// ----------------------
// EXPORTS PARA TESTES UNITÁRIOS
// ----------------------
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    abrirModalAvaliacao,
    fecharModalAvaliacao,
    avaliar,
    enviarSugestao,
    abrirModalContatos,
    fecharModalContatos,
  };
}
