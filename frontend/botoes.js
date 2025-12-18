// ===============================
// BOTÃO PRIMÁRIO (2 BOTÕES)
// ===============================
function acaoPrimaria(acao) {
  document.getElementById("retorno-primario").innerText =
    `Ação ${acao} executada!`;

  document.getElementById("btn-primario-salvar").disabled = true;
  document.getElementById("btn-primario-concluir").disabled = true;
}



// ===============================
// BOTÃO SECUNDÁRIO (2 BOTÕES)
// ===============================
function acaoSecundaria(acao) {
  document.getElementById("retorno-secundario").innerText =
    `Ação ${acao} realizada!`;

  document.getElementById("btn-secundario-voltar").disabled = true;
  document.getElementById("btn-secundario-cancelar").disabled = true;
}



// ===============================
// BOTÃO DE PERIGO (2 BOTÕES + MODAL)
// ===============================
let acaoDangerSelecionada = "";

function abrirModal(acao) {
  acaoDangerSelecionada = acao;
  document.getElementById("texto-modal").innerText =
    `Tem certeza que deseja ${acao}?`;

  document.getElementById("modal-confirmacao").style.display = "flex";
}

function fecharModal() {
  document.getElementById("modal-confirmacao").style.display = "none";
}

function confirmarExclusao() {
  fecharModal();

  document.getElementById("retorno-danger").innerText =
    `${acaoDangerSelecionada} concluído com sucesso!`;

  document.getElementById("btn-danger-excluir").disabled = true;
  document.getElementById("btn-danger-remover").disabled = true;
}



// ===============================
// BOTÃO COM LOADING (2 BOTÕES)
// ===============================
function carregar(acao) {
  const btn1 = document.getElementById("btn-loading-enviar");
  const btn2 = document.getElementById("btn-loading-processar");

  // Desabilita ambos
  btn1.disabled = true;
  btn2.disabled = true;

  // Define qual botão foi clicado
  const btnClicado = acao === "Enviar" ? btn1 : btn2;

  btnClicado.innerHTML = `${acao}... ⏳`;

  setTimeout(() => {
    btnClicado.innerHTML = `${acao} ✅`;
    document.getElementById("retorno-loading").innerText =
      `${acao} concluído!`;
  }, 2000);
}



// ===============================
// BOTÃO DE ÍCONE (2 BOTÕES)
// ===============================
function acaoIcone(acao) {
  document.getElementById("retorno-icone").innerText =
    `Ação ${acao} executada!`;

  document.getElementById("btn-icone-editar").disabled = true;
  document.getElementById("btn-icone-visualizar").disabled = true;
}



// ===============================
// PAGINAÇÃO (5 PÁGINAS)
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
    conteudo.innerHTML = "<p>Página 3: Nova página.</p>";
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
// RESETAR PÁGINA COMPLETA
// ===============================
function resetarPagina() {
  // Limpa todos os retornos
  document.querySelectorAll(".retorno").forEach(r => r.innerText = "");

  // Reativa todos os botões desabilitados
  document.querySelectorAll("button:disabled").forEach(btn => btn.disabled = false);

  // Reset textos dos botões primários
  document.getElementById("btn-primario-salvar").innerText = "Salvar";
  document.getElementById("btn-primario-concluir").innerText = "Concluir";

  // Reset textos dos botões secundários
  document.getElementById("btn-secundario-voltar").innerText = "Voltar";
  document.getElementById("btn-secundario-cancelar").innerText = "Cancelar";

  // Reset botões danger
  document.getElementById("btn-danger-excluir").innerText = "Excluir";
  document.getElementById("btn-danger-remover").innerText = "Remover";

  // Reset botões loading
  document.getElementById("btn-loading-enviar").innerHTML = "Enviar";
  document.getElementById("btn-loading-processar").innerHTML = "Processar";

  // Reset botões de ícone
  document.getElementById("btn-icone-editar").innerHTML = "✏️";
  document.getElementById("btn-icone-visualizar").innerHTML = "👁️";

  // Reset paginação
  paginaAtual = 1;
  atualizarConteudo();
}



// ===============================
// INICIALIZAÇÃO
// ===============================
atualizarConteudo();