// --- Validações de campo ---
function validarNome(nome) {
  const valor = nome.trim();
  if (/\s{2,}/.test(valor)) return false; // dois espaços seguidos
  const partes = valor.split(" ");
  if (partes.length < 2) return false;
  if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(valor)) return false;
  if (valor.length < 7 || valor.length > 64) return false;
  const [primeiro, segundo] = [partes[0], partes[1]];
  if (primeiro.length < 3 || segundo.length < 3) return false;
  return true;
}

function validarEmail(email) {
  const valor = email.trim();
  if (/\s/.test(valor)) return false;
  if (valor.length === 0 || valor.length > 64) return false;
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regexEmail.test(valor);
}

function validarSenha(senha) {
  const valor = senha;
  if (valor.length < 6 || valor.length > 12) return false;
  if (!/[0-9]/.test(valor)) return false;
  if (!/[A-Z]/.test(valor)) return false;
  if (!/[!@#$%^&*(),.?":{}|<>_\-+=/~[\]\\;']/g.test(valor)) return false;
  return true;
}

function validarConfirmarSenha(senha, confirmar) {
  return confirmar === senha && confirmar.length > 0;
}

// --- Persistência ---
function salvarUsuarioLocal(nome, email, senha) {
  const usuario = { nome: nome.trim(), email: email.trim(), senha };
  localStorage.setItem("qaplayground_usuario", JSON.stringify(usuario));
}

// --- Modal ---
function mostrarModal(mensagem) {
  const modalTexto = document.getElementById("modalTexto");
  modalTexto.innerHTML = mensagem.replace(/\n/g, "<br>");
  document.getElementById("modalMensagem").style.display = "flex";
}

function mostrarModalErro(mensagem) {
  const modalTextoErro = document.getElementById("modalTextoErro");
  modalTextoErro.innerHTML = mensagem.replace(/\n/g, "<br>");
  document.getElementById("modalMensagemErro").style.display = "flex";
}

document.getElementById("modalFechar").onclick = function () {
  document.getElementById("modalMensagem").style.display = "none";
};
document.getElementById("modalOk").onclick = function () {
  document.getElementById("modalMensagem").style.display = "none";
};

document.getElementById("modalFecharErro").onclick = function () {
  document.getElementById("modalMensagemErro").style.display = "none";
};
document.getElementById("modalOkErro").onclick = function () {
  document.getElementById("modalMensagemErro").style.display = "none";
};

window.onclick = function (event) {
  const modal = document.getElementById("modalMensagem");
  const modalErro = document.getElementById("modalMensagemErro");
  if (event.target === modal) {
    modal.style.display = "none";
  }
  if (event.target === modalErro) {
    modalErro.style.display = "none";
  }
};

// --- Fluxo principal ---
function executarCadastro(event) {
  event.preventDefault();

  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const confirmarSenha = document.getElementById("confirmarSenha").value;

  if (!validarNome(nome)) {
    mostrarModalErro(
      "Preencher corretamente o campo Nome,\ndúvida entrar em Requisitos!"
    );
    return;
  }
  if (!validarEmail(email)) {
    mostrarModalErro(
      "Preencher corretamente o campo E-mail,\ndúvida entrar em Requisitos!"
    );
    return;
  }
  if (!validarSenha(senha)) {
    mostrarModalErro(
      "Preencher corretamente o campo Senha,\ndúvida entrar em Requisitos!"
    );
    return;
  }
  if (!validarConfirmarSenha(senha, confirmarSenha)) {
    mostrarModalErro("As senhas não conferem,\ndúvida entrar em Requisitos!");
    return;
  }

  salvarUsuarioLocal(nome, email, senha);
  mostrarModal("Cadastro realizado com sucesso!");

  // Exibe os botões de QA após sucesso
  document.getElementById("btnVerUsuario").style.display = "inline-block";
  document.getElementById("btnLimparCadastro").style.display = "inline-block";

  // --- limpa os campos após cadastrar ---
  document.querySelector(".form-container").reset();

  // --- desabilita os campos e botão de cadastrar ---
  desabilitarCamposCadastro();
}

// --- Funções de QA ---
function verUsuarioSalvo() {
  const usuario = localStorage.getItem("qaplayground_usuario");
  if (usuario) {
    const dados = JSON.parse(usuario);
    const mensagem = `Usuário salvo:\nNome: ${dados.nome}\nEmail: ${dados.email}`;
    mostrarModal(mensagem);
  } else {
    mostrarModalErro("Nenhum usuário cadastrado encontrado.");
  }
}

function limparCadastro() {
  localStorage.removeItem("qaplayground_usuario");
  mostrarModal("Cadastro removido do armazenamento local.");
  document.getElementById("btnVerUsuario").style.display = "none";
  document.getElementById("btnLimparCadastro").style.display = "none";

  // --- limpa os campos também ao clicar em limpar ---
  document.querySelector(".form-container").reset();

  // --- reabilita os campos e botão de cadastrar ---
  habilitarCamposCadastro();
}

// --- Controle de campos ---
function desabilitarCamposCadastro() {
  document.getElementById("nome").disabled = true;
  document.getElementById("email").disabled = true;
  document.getElementById("senha").disabled = true;
  document.getElementById("confirmarSenha").disabled = true;
  document.getElementById("btnCadastrar").disabled = true;
}

function habilitarCamposCadastro() {
  document.getElementById("nome").disabled = false;
  document.getElementById("email").disabled = false;
  document.getElementById("senha").disabled = false;
  document.getElementById("confirmarSenha").disabled = false;
  document.getElementById("btnCadastrar").disabled = false;
}

// --- Exibe botões automaticamente se houver usuário salvo ---
window.onload = function () {
  const usuario = localStorage.getItem("qaplayground_usuario");
  if (usuario) {
    document.getElementById("btnVerUsuario").style.display = "inline-block";
    document.getElementById("btnLimparCadastro").style.display = "inline-block";
    // desabilita os campos se já houver cadastro
    desabilitarCamposCadastro();
  }
};

// Disponibiliza no escopo global
window.executarCadastro = executarCadastro;
window.verUsuarioSalvo = verUsuarioSalvo;
window.limparCadastro = limparCadastro;

// Para uso dos testes unitários e de integração
module.exports = {
  validarNome,
  validarEmail,
  validarSenha,
  validarConfirmarSenha,
  salvarUsuarioLocal,
  desabilitarCamposCadastro,
  habilitarCamposCadastro,
  executarCadastro,
  verUsuarioSalvo,
  limparCadastro,
  mostrarModal,
  mostrarModalErro,
};
