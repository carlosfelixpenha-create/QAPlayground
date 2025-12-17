// ===============================
// BOTÃO PRIMÁRIO
// ===============================
function acaoPrimaria() {
  document.getElementById("retorno-primario").innerText =
    "Ação principal executada!";

  document.getElementById("btn-primario").disabled = true;
}



// ===============================
// BOTÃO SECUNDÁRIO
// ===============================
function acaoSecundaria() {
  document.getElementById("retorno-secundario").innerText =
    "Ação secundária realizada!";

  document.getElementById("btn-secundario").disabled = true;
}



// ===============================
// BOTÃO DE PERIGO (MODAL)
// ===============================
function abrirModal() {
  document.getElementById("modal-confirmacao").style.display = "flex";
}

function fecharModal() {
  document.getElementById("modal-confirmacao").style.display = "none";
}

function confirmarExclusao() {
  fecharModal();

  document.getElementById("retorno-danger").innerText =
    "Item excluído com sucesso!";

  document.getElementById("btn-danger").disabled = true;
}



// ===============================
// BOTÃO COM LOADING
// ===============================
function carregar() {
  const btn = document.getElementById("btn-loading");
  btn.disabled = true;
  btn.innerHTML = "Carregando... ⏳";

  setTimeout(() => {
    btn.innerHTML = "Enviado ✅";
    document.getElementById("retorno-loading").innerText =
      "Envio concluído!";
  }, 2000);
}



// ===============================
// BOTÃO TOGGLE (NÃO DESABILITA)
// ===============================
let toggleAtivo = false;

function alternar() {
  toggleAtivo = !toggleAtivo;

  const btn = document.getElementById("btn-toggle");
  btn.innerText = toggleAtivo ? "ON" : "OFF";
  btn.style.backgroundColor = toggleAtivo ? "#4caf50" : "#ccc";

  document.getElementById("retorno-toggle").innerText =
    toggleAtivo ? "Toggle ativado" : "Toggle desativado";
}



// ===============================
// BOTÃO DE ÍCONE
// ===============================
function acaoIcone() {
  document.getElementById("retorno-icone").innerText =
    "Ação do botão de ícone executada!";

  document.getElementById("btn-icone").disabled = true;
}



// ===============================
// PAGINAÇÃO (AGORA COM 5 PÁGINAS)
// ===============================
let paginaAtual = 1;

function atualizarConteudo() {
  const conteudo = document.getElementById("conteudo-paginado");
  const indicador = document.getElementById("pagina-atual");

  indicador.innerText = paginaAtual;

  if (paginaAtual === 1) {
    conteudo.innerHTML = "<p>Página 1: Conteúdo inicial.</p>";
  } else if (paginaAtual === 2) {
    conteudo.innerHTML = "<p>Página 2: Informações adicionais.</p>";
  } else if (paginaAtual === 3) {
    conteudo.innerHTML = "<p>Página 3: Página de exemplo.</p>";
  } else if (paginaAtual === 4) {
    conteudo.innerHTML = "<p>Página 4: Conteúdo extra avançado.</p>";
  } else if (paginaAtual === 5) {
    conteudo.innerHTML = "<p>Página 5: Finalização do conteúdo.</p>";
  }
}

function proximaPagina() {
  if (paginaAtual < 5) {
    paginaAtual++;
    atualizarConteudo();
    document.getElementById("retorno-paginacao").innerText =
      "Página avançada com sucesso";
  }
}

function paginaAnterior() {
  if (paginaAtual > 1) {
    paginaAtual--;
    atualizarConteudo();
    document.getElementById("retorno-paginacao").innerText =
      "Página retornada com sucesso";
  }
}



// ===============================
// RESETAR PÁGINA (NOVO BOTÃO)
// ===============================
function resetarPagina() {
  // Limpa todos os retornos
  document.querySelectorAll(".retorno").forEach(r => r.innerText = "");

  // Reativa todos os botões desabilitados
  document.querySelectorAll("button:disabled").forEach(btn => btn.disabled = false);

  // Reset textos dos botões principais
  document.getElementById("btn-primario").innerText = "Salvar";
  document.getElementById("btn-secundario").innerText = "Voltar";
  document.getElementById("btn-danger").innerText = "Excluir";
  document.getElementById("btn-loading").innerHTML = "Enviar";
  document.getElementById("btn-icone").innerHTML = "✏️";

  // Reset toggle (volta para o azul inicial do CSS)
  const toggle = document.getElementById("btn-toggle");
  toggle.innerText = "OFF";
  toggle.style.backgroundColor = "";
  toggleAtivo = false;

  // Reset paginação
  paginaAtual = 1;
  atualizarConteudo();
}



// ===============================
// INICIALIZAÇÃO
// ===============================
atualizarConteudo();