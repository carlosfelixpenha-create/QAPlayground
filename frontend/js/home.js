// Domínio oficial do GitHub Pages
const dominioOficial = "carlosfelixpenha-create.github.io";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDLUPeMxcMC10VB8ZZWBsVOsaMFO9S-aGk",
  authDomain: "qaplayground-7a4e0.firebaseapp.com",
  databaseURL: "https://qaplayground-7a4e0-default-rtdb.firebaseio.com", // ⚠️ importante
  projectId: "qaplayground-7a4e0",
  storageBucket: "qaplayground-7a4e0.appspot.com",
  messagingSenderId: "529328477991",
  appId: "1:529328477991:web:c0378da7479336b806bb02",
  measurementId: "G-J6K9DP3PCS",
};

// Inicializa Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const analytics = firebase.analytics(app);

// ----------------------
// Contador de visitantes
// ----------------------
if (
  typeof window !== "undefined" &&
  window.location?.hostname === dominioOficial
) {
  const ref = db.ref("contadores/visitas");
  ref.transaction((valorAtual) => (valorAtual || 0) + 1);
  ref.on("value", (snapshot) => {
    const contador = document.getElementById("contador-container");
    if (contador) contador.innerText = `Visitantes: ${snapshot.val()}`;
  });
} else {
  const contador = document.getElementById("contador-container");
  if (contador) contador.innerText = "Visitantes: 0";
}

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

  if (nota <= 3) {
    const texto = nota === 1 ? "estrela" : "estrelas";
    if (resultado) {
      resultado.innerHTML = `Você avaliou nossa plataforma com ${nota} ${texto}!<br>O que podemos melhorar?`;
    }
    if (feedbackExtra) feedbackExtra.style.display = "block";
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

  // Atualiza soma e total no Firebase
  const somaRef = db.ref("contadores/soma");
  const totalRef = db.ref("contadores/total");

  somaRef.transaction((valorAtual) => (valorAtual || 0) + nota);
  totalRef.transaction((valorAtual) => (valorAtual || 0) + 1);

  atualizarMedia();

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
      const sugestoesRef = db.ref("contadores/sugestoes");
      sugestoesRef.transaction((valorAtual) => (valorAtual || 0) + 1);

      alert("Sugestão registrada com sucesso!");
      fecharModalAvaliacao();
    } else {
      fecharModalAvaliacao();
    }
  } else {
    fecharModalAvaliacao();
  }
}

function atualizarMedia() {
  const somaRef = db.ref("contadores/soma");
  const totalRef = db.ref("contadores/total");

  Promise.all([somaRef.once("value"), totalRef.once("value")]).then(
    ([somaSnap, totalSnap]) => {
      const soma = somaSnap.val() || 0;
      const total = totalSnap.val() || 0;
      const media = total > 0 ? (soma / total).toFixed(1) : "-";

      const mediaAvaliacao = document.getElementById("media-avaliacao");
      if (mediaAvaliacao) {
        mediaAvaliacao.innerText = `⭐ Média: ${media}`;
      }

      const mediaContainer = document.getElementById("media-container");
      if (mediaContainer) {
        mediaContainer.innerText = `⭐ Média: ${media}`;
      }
    },
  );
}

atualizarMedia();

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
}

// ----------------------
// EXPORTS PARA TESTES UNITÁRIOS
// ----------------------
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    abrirModalAvaliacao,
    fecharModalAvaliacao,
    avaliar,
    enviarSugestao,
    atualizarMedia,
    abrirModalContatos,
    fecharModalContatos,
  };
}
