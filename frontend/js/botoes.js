// ===============================
// MODAL COMPACTA (sucesso, info)
// ===============================
function mostrarModal(mensagem, tipo = "info") {
  const modal = document.getElementById("modalMensagem");
  const modalTexto = document.getElementById("modalTexto");
  const modalTitulo = document.getElementById("modalTitulo");

  modalTexto.textContent = mensagem;

  if (modalTitulo) {
    modalTitulo.style.fontWeight = "bold";
    modalTitulo.style.fontSize = "1.2em";

    if (tipo === "sucesso") {
      modalTitulo.textContent = "Sucesso";
      modalTitulo.style.color = "green";
    } else {
      modalTitulo.textContent = "";
      modalTitulo.style.color = "";
    }
  }

  modal.style.display = "flex";

  document.getElementById("modalOk").onclick = () =>
    (modal.style.display = "none");
  document.getElementById("modalFechar").onclick = () =>
    (modal.style.display = "none");
  window.onclick = (event) => {
    if (event.target === modal) modal.style.display = "none";
  };
}

// ===============================
// MODAL FLUIDA (erros detalhados)
// ===============================
function mostrarModalErro(mensagem) {
  const modal = document.getElementById("modalMensagemErro");
  const modalTexto = document.getElementById("modalTextoErro");

  modalTexto.textContent = mensagem;
  modal.style.display = "flex";

  document.getElementById("modalOkErro").onclick = () =>
    (modal.style.display = "none");
  document.getElementById("modalFecharErro").onclick = () =>
    (modal.style.display = "none");
  window.onclick = (event) => {
    if (event.target === modal) modal.style.display = "none";
  };
}

// ===============================
// BOTÃO PRIMÁRIO (Confirmar)
// ===============================
function acaoPrimaria(acao) {
  const retorno = document.getElementById("retorno-primario");
  retorno.classList.remove("sucesso", "erro");
  retorno.innerText = "";

  const labels = {
    "btn-primario-salvar": "Salvar",
    "btn-primario-concluir": "Concluir",
    "btn-primario-confirmar": "Confirmar",
    "btn-primario-login": "Login",
    "btn-primario-criar": "Criar",
  };
  document.querySelectorAll("[id^='btn-primario']").forEach((btn) => {
    btn.disabled = false;
    btn.innerText = labels[btn.id];
  });

  const btnClicado = document.getElementById(
    `btn-primario-${acao.toLowerCase()}`
  );

  if (acao === "Confirmar") {
    btnClicado.innerText = "Confirmar ✅";
    retorno.innerText = `Ação ${acao} executada com sucesso!`;
    retorno.classList.add("sucesso");
    mostrarModal(`${acao} concluído!`, "sucesso");
    document
      .querySelectorAll("[id^='btn-primario']")
      .forEach((btn) => (btn.disabled = true));
  } else {
    btnClicado.innerText = `${acao} ❌`;
    btnClicado.disabled = true;
    retorno.innerText = `Erro: clique em "${acao}" não é permitido. Use Confirmar.`;
    retorno.classList.add("erro");
    mostrarModalErro(`Botão incorreto. O correto é Confirmar.`);
  }
}

// ===============================
// BOTÃO SECUNDÁRIO (Cancelar)
// ===============================
function acaoSecundaria(acao) {
  const retorno = document.getElementById("retorno-secundario");
  retorno.classList.remove("sucesso", "erro");
  retorno.innerText = "";

  const labels = {
    "btn-secundario-voltar": "Voltar",
    "btn-secundario-cancelar": "Cancelar",
    "btn-secundario-limpar": "Limpar",
    "btn-secundario-seguir": "Seguir",
    "btn-secundario-excluir": "Excluir",
  };
  document.querySelectorAll("[id^='btn-secundario']").forEach((btn) => {
    btn.disabled = false;
    btn.innerText = labels[btn.id];
  });

  const btnClicado = document.getElementById(
    `btn-secundario-${acao.toLowerCase()}`
  );

  if (acao === "Cancelar") {
    btnClicado.innerText = "Cancelar ✅";
    retorno.innerText = `Ação ${acao} realizada com sucesso!`;
    retorno.classList.add("sucesso");
    mostrarModal(`${acao} concluído!`, "sucesso");
    document
      .querySelectorAll("[id^='btn-secundario']")
      .forEach((btn) => (btn.disabled = true));
  } else {
    btnClicado.innerText = `${acao} ❌`;
    btnClicado.disabled = true;
    retorno.innerText = `Erro: clique em "${acao}" não é permitido. Use Cancelar.`;
    retorno.classList.add("erro");
    mostrarModalErro(`Botão incorreto. O correto é Cancelar.`);
  }
}

// ===============================
// BOTÃO TERCIÁRIO (Exportar)
// ===============================
function acaoTerciaria(acao) {
  const retorno = document.getElementById("retorno-terciario");
  retorno.classList.remove("sucesso", "erro");
  retorno.innerText = "";

  const labels = {
    "btn-terciario-imprimir": "Imprimir",
    "btn-terciario-exportar": "Exportar",
    "btn-terciario-ver": "Ver",
    "btn-terciario-filtros": "Filtros",
    "btn-terciario-sair": "Sair",
  };
  document.querySelectorAll("[id^='btn-terciario']").forEach((btn) => {
    btn.disabled = false;
    btn.innerText = labels[btn.id];
  });

  const btnClicado = document.getElementById(
    `btn-terciario-${acao.toLowerCase()}`
  );

  if (acao === "Exportar") {
    btnClicado.innerText = "Exportar ✅";
    retorno.innerText = `Ação ${acao} executada com sucesso!`;
    retorno.classList.add("sucesso");
    mostrarModal(`${acao} concluído!`, "sucesso");
    document
      .querySelectorAll("[id^='btn-terciario']")
      .forEach((btn) => (btn.disabled = true));
  } else {
    btnClicado.innerText = `${acao} ❌`;
    btnClicado.disabled = true;
    retorno.innerText = `Erro: clique em "${acao}" não é permitido. Use Exportar.`;
    retorno.classList.add("erro");
    mostrarModalErro(`Botão incorreto. O correto é Exportar.`);
  }
}

// ===============================
// BOTÃO DE PERIGO (Excluir)
// ===============================
function abrirModal(acao) {
  const retorno = document.getElementById("retorno-danger");
  retorno.classList.remove("sucesso", "erro");
  retorno.innerText = "";

  const labels = {
    "btn-danger-excluir": "Excluir",
    "btn-danger-remover": "Remover",
    "btn-danger-apagar": "Apagar",
    "btn-danger-desativar": "Desativar",
    "btn-danger-formatar": "Formatar",
  };
  document.querySelectorAll("[id^='btn-danger']").forEach((btn) => {
    btn.disabled = false;
    btn.innerText = labels[btn.id];
  });

  const btnClicado = document.getElementById(
    `btn-danger-${acao.toLowerCase()}`
  );

  if (acao === "Excluir") {
    btnClicado.innerText = "Excluir ✅";
    retorno.innerText = `${acao} concluído com sucesso!`;
    retorno.classList.add("sucesso");
    mostrarModal(`${acao} concluído!`, "sucesso");
    document
      .querySelectorAll("[id^='btn-danger']")
      .forEach((btn) => (btn.disabled = true));
  } else {
    btnClicado.innerText = `${acao} ❌`;
    btnClicado.disabled = true;
    retorno.innerText = `Erro: clique em "${acao}" não é permitido. Use Excluir.`;
    retorno.classList.add("erro");
    mostrarModalErro(`Botão incorreto. O correto é Excluir.`);
  }
}
// ===============================
// BOTÃO COM LOADING (Processar)
// ===============================
function carregar(acao) {
  const retorno = document.getElementById("retorno-loading");
  retorno.classList.remove("sucesso", "erro");
  retorno.innerText = "";

  const labels = {
    "btn-loading-enviar": "Enviar",
    "btn-loading-processar": "Processar",
    "btn-loading-baixar": "Baixar",
    "btn-loading-progresso": "Progresso",
    "btn-loading-salvar": "Salvar",
  };

  const loadingLabels = {
    enviar: "Enviando",
    processar: "Processando",
    baixar: "Baixando",
    progresso: "Em Progresso",
    salvar: "Salvando",
  };

  document.querySelectorAll("[id^='btn-loading']").forEach((btn) => {
    btn.disabled = false;
    btn.innerText = labels[btn.id];
  });

  const btnClicado = document.getElementById(
    `btn-loading-${acao.toLowerCase()}`
  );

  let frames = ["⏳", "⌛"];
  let i = 0;
  const animacao = setInterval(() => {
    const textoLoading = loadingLabels[acao.toLowerCase()] || acao;
    btnClicado.innerHTML = `${textoLoading} ${frames[i % frames.length]}`;
    i++;
  }, 400);

  setTimeout(() => {
    clearInterval(animacao);

    if (acao.toLowerCase() === "processar") {
      btnClicado.innerHTML = "Processar ✅";
      retorno.innerText = `Ação ${acao} concluída com sucesso!`;
      retorno.classList.add("sucesso");
      mostrarModal(`${acao} concluído!`, "sucesso");
      document
        .querySelectorAll("[id^='btn-loading']")
        .forEach((btn) => (btn.disabled = true));
    } else {
      btnClicado.innerHTML = `${labels[btnClicado.id]} ❌`;
      btnClicado.disabled = true;
      retorno.innerText = `Erro: clique em "${acao}" não é permitido. Use Processar.`;
      retorno.classList.add("erro");
      mostrarModalErro(`Botão incorreto. O correto é Processar.`);
    }
  }, 4000);
}

// ===============================
// BOTÃO DE ÍCONE (Lápis)
// ===============================
function acaoIcone(acao) {
  const retorno = document.getElementById("retorno-icone");
  retorno.classList.remove("sucesso", "erro");
  retorno.innerText = "";

  const labels = {
    "btn-icone-lapis": "✏️",
    "btn-icone-olho-aberto": "👁️",
    "btn-icone-olho-fechado": "🙈",
    "btn-icone-raio": "⚡",
    "btn-icone-maozinha": "🤚",
  };

  document.querySelectorAll("[id^='btn-icone']").forEach((btn) => {
    btn.disabled = false;
    btn.innerHTML = labels[btn.id];
  });

  const normalizado = acao
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace("ã", "a")
    .replace("á", "a");

  const btnClicado = document.getElementById(`btn-icone-${normalizado}`);

  if (normalizado === "lapis") {
    btnClicado.innerHTML = "✏️ ✅";
    retorno.innerText = `Ação Lápis executada com sucesso!`;
    retorno.classList.add("sucesso");
    mostrarModal(`Lápis concluído!`, "sucesso");
    document
      .querySelectorAll("[id^='btn-icone']")
      .forEach((btn) => (btn.disabled = true));
  } else {
    btnClicado.innerHTML = `${labels[btnClicado.id]} ❌`;
    btnClicado.disabled = true;
    retorno.innerText = `Erro: clique em "${acao}" não é permitido. Use Lápis.`;
    retorno.classList.add("erro");
    mostrarModalErro(`Botão incorreto. O correto é Lápis.`);
  }
}

// ===============================
// RESETAR PÁGINA COMPLETA
// ===============================
function resetarPagina() {
  document.querySelectorAll(".retorno").forEach((r) => {
    r.innerText = "";
    r.classList.remove("sucesso", "erro");
  });

  document
    .querySelectorAll("button:disabled")
    .forEach((btn) => (btn.disabled = false));

  // Reset textos dos botões
  document.getElementById("btn-primario-salvar").innerText = "Salvar";
  document.getElementById("btn-primario-concluir").innerText = "Concluir";
  document.getElementById("btn-primario-confirmar").innerText = "Confirmar";
  document.getElementById("btn-primario-login").innerText = "Login";
  document.getElementById("btn-primario-criar").innerText = "Criar";

  document.getElementById("btn-secundario-voltar").innerText = "Voltar";
  document.getElementById("btn-secundario-cancelar").innerText = "Cancelar";
  document.getElementById("btn-secundario-limpar").innerText = "Limpar";
  document.getElementById("btn-secundario-seguir").innerText = "Seguir";
  document.getElementById("btn-secundario-excluir").innerText = "Excluir";

  document.getElementById("btn-terciario-imprimir").innerText = "Imprimir";
  document.getElementById("btn-terciario-exportar").innerText = "Exportar";
  document.getElementById("btn-terciario-ver").innerText = "Ver";
  document.getElementById("btn-terciario-filtros").innerText = "Filtros";
  document.getElementById("btn-terciario-sair").innerText = "Sair";

  document.getElementById("btn-danger-excluir").innerText = "Excluir";
  document.getElementById("btn-danger-remover").innerText = "Remover";
  document.getElementById("btn-danger-apagar").innerText = "Apagar";
  document.getElementById("btn-danger-desativar").innerText = "Desativar";
  document.getElementById("btn-danger-formatar").innerText = "Formatar";

  document.getElementById("btn-loading-enviar").innerHTML = "Enviar";
  document.getElementById("btn-loading-processar").innerHTML = "Processar";
  document.getElementById("btn-loading-baixar").innerHTML = "Baixar";
  document.getElementById("btn-loading-progresso").innerHTML = "Progresso";
  document.getElementById("btn-loading-salvar").innerHTML = "Salvar";

  document.getElementById("btn-icone-lapis").innerHTML = "✏️";
  document.getElementById("btn-icone-olho-aberto").innerHTML = "👁️";
  document.getElementById("btn-icone-olho-fechado").innerHTML = "🙈";
  document.getElementById("btn-icone-raio").innerHTML = "⚡";
  document.getElementById("btn-icone-maozinha").innerHTML = "🤚";
}

// ===============================
// EXPORTA FUNÇÕES PARA TESTES
// ===============================
module.exports = {
  mostrarModal,
  mostrarModalErro,
  acaoPrimaria,
  acaoSecundaria,
  acaoTerciaria,
  abrirModal,
  carregar,
  acaoIcone,
  resetarPagina,
};
