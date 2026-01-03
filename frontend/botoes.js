// ===============================
// MODAL GENÉRICA (com título colorido)
// ===============================
function mostrarModal(mensagem, tipo = "info") {
  const modal = document.getElementById("modalMensagem");
  const modalTexto = document.getElementById("modalTexto");
  const modalTitulo = document.getElementById("modalTitulo");

  // define corpo da mensagem
  modalTexto.textContent = mensagem;

  // se houver elemento de título, aplica a cor e o texto
  if (modalTitulo) {
    modalTitulo.style.fontWeight = "bold"; // negrito
    modalTitulo.style.fontSize = "1.2em"; // maior

    if (tipo === "erro") {
      modalTitulo.textContent = "Erro";
      modalTitulo.style.color = "red";
    } else if (tipo === "sucesso") {
      modalTitulo.textContent = "Sucesso";
      modalTitulo.style.color = "green";
    } else {
      modalTitulo.textContent = "";
      modalTitulo.style.color = "";
    }
  }

  modal.style.display = "block";

  document.getElementById("modalOk").onclick = () =>
    (modal.style.display = "none");
  document.getElementById("modalFechar").onclick = () =>
    (modal.style.display = "none");
  window.onclick = (event) => {
    if (event.target === modal) modal.style.display = "none";
  };
}

// ===============================
// BOTÃO PRIMÁRIO (5 BOTÕES)
// Sugerido: Confirmar
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
    mostrarModal(`Botão incorreto. O correto é Confirmar.`, "erro");
  }
}

// ===============================
// BOTÃO SECUNDÁRIO (5 BOTÕES)
// Sugerido: Cancelar
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
    mostrarModal(`Botão incorreto. O correto é Cancelar.`, "erro");
  }
}

// ===============================
// BOTÃO TERCIÁRIO (5 BOTÕES)
// Sugerido: Exportar
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
    mostrarModal(`Botão incorreto. O correto é Exportar.`, "erro");
  }
}

// ===============================
// BOTÃO DE PERIGO (5 BOTÕES)
// Sugerido: Excluir
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
    mostrarModal(`Botão incorreto. O correto é Excluir.`, "erro");
  }
}
// ===============================
// BOTÃO COM LOADING (5 BOTÕES)
// Sugerido: Processar
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

  // Mapeamento para texto de loading
  const loadingLabels = {
    enviar: "Enviando",
    processar: "Processando",
    baixar: "Baixando",
    progresso: "Em Progresso",
    salvar: "Salvando",
  };

  // Resetar todos os botões
  document.querySelectorAll("[id^='btn-loading']").forEach((btn) => {
    btn.disabled = false;
    btn.innerText = labels[btn.id];
  });

  const btnClicado = document.getElementById(
    `btn-loading-${acao.toLowerCase()}`
  );

  // animação da ampulheta
  let frames = ["⏳", "⌛"];
  let i = 0;
  const animacao = setInterval(() => {
    const textoLoading = loadingLabels[acao.toLowerCase()] || acao;
    btnClicado.innerHTML = `${textoLoading} ${frames[i % frames.length]}`;
    i++;
  }, 400);

  // tempo total de espera (3 segundos)
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
      mostrarModal(`Botão incorreto. O correto é Processar.`, "erro");
    }
  }, 4000);
}

// ===============================
// BOTÃO DE ÍCONE (5 BOTÕES)
// Sugerido: Lápis
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

  // Resetar todos os botões da seção
  document.querySelectorAll("[id^='btn-icone']").forEach((btn) => {
    btn.disabled = false;
    btn.innerHTML = labels[btn.id];
  });

  // Normalizar o texto recebido para bater com o id
  const normalizado = acao
    .toLowerCase()
    .replace(/\s+/g, "-") // troca espaços por hífen
    .replace("ã", "a") // trata acento de "Mãozinha"
    .replace("á", "a"); // trata acento de "Lápis"

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
    mostrarModal(`Botão incorreto. O correto é Lápis.`, "erro");
  }
}

// ===============================
// RESETAR PÁGINA COMPLETA
// ===============================
function resetarPagina() {
  // limpa mensagens e estados
  document.querySelectorAll(".retorno").forEach((r) => {
    r.innerText = "";
    r.classList.remove("sucesso", "erro");
  });

  // reabilita quaisquer botões desabilitados
  document
    .querySelectorAll("button:disabled")
    .forEach((btn) => (btn.disabled = false));

  // Reset textos dos botões por seção

  // Primário
  document.getElementById("btn-primario-salvar").innerText = "Salvar";
  document.getElementById("btn-primario-concluir").innerText = "Concluir";
  document.getElementById("btn-primario-confirmar").innerText = "Confirmar";
  document.getElementById("btn-primario-login").innerText = "Login";
  document.getElementById("btn-primario-criar").innerText = "Criar";

  // Secundário
  document.getElementById("btn-secundario-voltar").innerText = "Voltar";
  document.getElementById("btn-secundario-cancelar").innerText = "Cancelar";
  document.getElementById("btn-secundario-limpar").innerText = "Limpar";
  document.getElementById("btn-secundario-seguir").innerText = "Seguir";
  document.getElementById("btn-secundario-excluir").innerText = "Excluir";

  // Terciário
  document.getElementById("btn-terciario-imprimir").innerText = "Imprimir";
  document.getElementById("btn-terciario-exportar").innerText = "Exportar";
  document.getElementById("btn-terciario-ver").innerText = "Ver";
  document.getElementById("btn-terciario-filtros").innerText = "Filtros";
  document.getElementById("btn-terciario-sair").innerText = "Sair";

  // Danger
  document.getElementById("btn-danger-excluir").innerText = "Excluir";
  document.getElementById("btn-danger-remover").innerText = "Remover";
  document.getElementById("btn-danger-apagar").innerText = "Apagar";
  document.getElementById("btn-danger-desativar").innerText = "Desativar";
  document.getElementById("btn-danger-formatar").innerText = "Formatar";

  // Loading
  document.getElementById("btn-loading-enviar").innerHTML = "Enviar";
  document.getElementById("btn-loading-processar").innerHTML = "Processar";
  document.getElementById("btn-loading-baixar").innerHTML = "Baixar";
  document.getElementById("btn-loading-progresso").innerHTML = "Progresso";
  document.getElementById("btn-loading-salvar").innerHTML = "Salvar";

  // Ícone
  document.getElementById("btn-icone-lapis").innerHTML = "✏️";
  document.getElementById("btn-icone-olho-aberto").innerHTML = "👁️";
  document.getElementById("btn-icone-olho-fechado").innerHTML = "🙈";
  document.getElementById("btn-icone-raio").innerHTML = "⚡";
  document.getElementById("btn-icone-maozinha").innerHTML = "🤚";
}
