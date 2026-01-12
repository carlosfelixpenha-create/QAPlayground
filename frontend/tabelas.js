// =======================================
// ARQUIVO: tabelas.js
// Estrutura base para todas as funcionalidades
// =======================================

// =======================================
// MODAIS
// =======================================

// Modal de sucesso / mensagens rápidas
function mostrarModal(mensagem, titulo = "Mensagem") {
  const modal = document.getElementById("modalMensagem");
  const texto = document.getElementById("modalTexto");
  const tituloEl = document.getElementById("modalTitulo");
  const acoes = document.getElementById("modalAcoes");

  if (tituloEl) tituloEl.textContent = titulo;
  texto.innerHTML = mensagem;

  modal.style.display = "flex";

  if (acoes) {
    acoes.innerHTML = `<button class="btn-ok" onclick="fecharModal('mensagem')">OK</button>`;
  }

  // X fecha modal
  document.getElementById("modalFechar").onclick = () =>
    fecharModal("mensagem");
}

// Modal de erro / mensagens detalhadas
function mostrarModalErro(mensagem, titulo = "Erro nas Ações de Tabelas") {
  const modal = document.getElementById("modalMensagemErro");
  const texto = document.getElementById("modalTextoErro");
  const tituloEl = document.getElementById("modalTituloErro");
  const acoesErro = document.getElementById("modalAcoesErro");

  if (tituloEl) tituloEl.textContent = titulo;
  texto.innerHTML = mensagem;

  modal.style.display = "flex";

  if (acoesErro) {
    acoesErro.innerHTML = `<button class="btn-ok" onclick="fecharModal('mensagemErro')">OK</button>`;
  }

  // X fecha modal
  document.getElementById("modalFecharErro").onclick = () =>
    fecharModal("mensagemErro");
}

// Função genérica para fechar modais
function fecharModal(tipo) {
  let modalId = "";
  if (tipo === "mensagem") modalId = "modalMensagem";
  else if (tipo === "mensagemErro") modalId = "modalMensagemErro";

  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "none";
    const inputs = modal.querySelectorAll("input, textarea");
    inputs.forEach((el) => (el.value = ""));
    const acoes = modal.querySelector(".modal-actions");
    if (acoes) acoes.innerHTML = "";
  }
}

// Fecha modal ao clicar fora
window.onclick = function (event) {
  const modais = document.getElementsByClassName("modal");
  for (let i = 0; i < modais.length; i++) {
    if (event.target == modais[i]) {
      modais[i].style.display = "none";
      const acoes = modais[i].querySelector(".modal-actions");
      if (acoes) acoes.innerHTML = "";
    }
  }
};

// =======================================
// 1) TABELA SIMPLES
// =======================================
// (não possui lógica)

// =======================================
// 2) TABELA COM ORDENAÇÃO
// =======================================

let ordemAtual = {
  coluna: null,
  direcao: 1,
};

function ordenarTabela(coluna) {
  const tabela = document.querySelector(".tabela-ordenacao tbody");
  const linhas = Array.from(tabela.querySelectorAll("tr"));

  if (ordemAtual.coluna === coluna) {
    ordemAtual.direcao *= -1;
  } else {
    ordemAtual.coluna = coluna;
    ordemAtual.direcao = 1;
  }

  const indexColuna = {
    id: 0,
    nome: 1,
    cargo: 2,
    status: 3,
  }[coluna];

  linhas.sort((a, b) => {
    const valorA = a.children[indexColuna].textContent.trim();
    const valorB = b.children[indexColuna].textContent.trim();

    if (!isNaN(valorA) && !isNaN(valorB)) {
      return (Number(valorA) - Number(valorB)) * ordemAtual.direcao;
    }

    return valorA.localeCompare(valorB) * ordemAtual.direcao;
  });

  linhas.forEach((linha) => tabela.appendChild(linha));

  mostrarModal(`Tabela ordenada por ${coluna}`, "Ordenação");
}

// =======================================
// 3) TABELA COM BUSCA (com delay)
// =======================================

let buscaTimeout = null; // guarda o timer

function filtrarTabela() {
  // limpa qualquer timer anterior
  if (buscaTimeout) {
    clearTimeout(buscaTimeout);
    buscaTimeout = null;
  }

  // agenda a execução após 3 segundos sem digitar
  buscaTimeout = setTimeout(() => {
    const termo = document.getElementById("input-busca").value.toLowerCase();
    const linhas = document.querySelectorAll(
      "#tabela-busca-container tbody tr"
    );

    let encontrou = false;

    linhas.forEach((linha) => {
      const texto = linha.textContent.toLowerCase();
      const visivel = texto.includes(termo);

      linha.style.display = visivel ? "" : "none";

      if (visivel) encontrou = true;
    });

    if (encontrou) {
      mostrarModal("Resultados filtrados", "Busca");
    } else {
      mostrarModalErro("Nenhum resultado encontrado", "Busca");
    }

    buscaTimeout = null; // limpa depois de executar
  }, 3000); // 3 segundos
}

// =======================================
// 4) TABELA COM PAGINAÇÃO
// =======================================

let paginaAtual = 1;
const itensPorPagina = 3;

function renderizarPaginacao() {
  const tabela = document.querySelector("#tabela-paginada-container tbody");
  const linhas = Array.from(tabela.querySelectorAll("tr"));

  linhas.forEach((linha, index) => {
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;

    linha.style.display = index >= inicio && index < fim ? "" : "none";
  });

  document.getElementById("pagina-atual").textContent = paginaAtual;
}

function paginaAnterior() {
  if (paginaAtual > 1) {
    paginaAtual--;
    renderizarPaginacao();
    mostrarModal("Página anterior carregada", "Paginação");
  }
}

function proximaPagina() {
  const tabela = document.querySelector("#tabela-paginada-container tbody");
  const totalLinhas = tabela.querySelectorAll("tr").length;
  const totalPaginas = Math.ceil(totalLinhas / itensPorPagina);

  if (paginaAtual < totalPaginas) {
    paginaAtual++;
    renderizarPaginacao();
    mostrarModal("Próxima página carregada", "Paginação");
  }
}

// =======================================
// 5) TABELA COM SELEÇÃO DE LINHAS (com delay)
// =======================================

let selecaoTimeout = null; // guarda o timer

function atualizarSelecao() {
  // limpa qualquer timer anterior
  if (selecaoTimeout) {
    clearTimeout(selecaoTimeout);
    selecaoTimeout = null;
  }

  // pega quantos estão selecionados
  const checkboxes = document.querySelectorAll(".linha-selecao");
  const selecionados = Array.from(checkboxes).filter((c) => c.checked).length;

  // só agenda modal se houver pelo menos 1 selecionado
  if (selecionados > 0) {
    selecaoTimeout = setTimeout(() => {
      mostrarModal(`${selecionados} itens selecionados`, "Seleção");
      selecaoTimeout = null; // limpa depois de executar
    }, 3000); // 3 segundos
  }
}

// =======================================
// 6) TABELA COM AÇÕES (USANDO ID)
// =======================================

// Ver detalhes pelo ID
function acaoVer(id) {
  const linhas = document.querySelectorAll(".tabela-acoes tbody tr");
  linhas.forEach((linha) => {
    if (linha.children[0].textContent === String(id)) {
      const nome = linha.children[1].textContent;
      const cargo = linha.children[2].textContent;
      const status = linha.children[3].textContent;

      const detalhes = `
        <strong>ID:</strong> ${id}<br>
        <strong>Nome:</strong> ${nome}<br>
        <strong>Cargo:</strong> ${cargo}<br>
        <strong>Status:</strong> ${status}
      `;

      mostrarModal(detalhes, "Detalhes do Usuário");
      document.getElementById(
        "modalAcoes"
      ).innerHTML = `<button class="btn-ok" onclick="fecharModal('mensagem')">OK</button>`;
      document.getElementById("modalFechar").onclick = () =>
        fecharModal("mensagem");
    }
  });
}

// Editar nome pelo ID
function acaoEditar(id) {
  const linhas = document.querySelectorAll(".tabela-acoes tbody tr");
  linhas.forEach((linha) => {
    if (linha.children[0].textContent === String(id)) {
      const nome = linha.children[1].textContent;

      const conteudo = `
        <p>Editando usuário <strong>${nome}</strong></p>
        <input type="text" id="novoNome" value="${nome}" />
      `;

      mostrarModal(conteudo, "Editar Usuário");
      document.getElementById("modalAcoes").innerHTML = `
        <button class="btn-primary" onclick="confirmarEdicao(${id})">Salvar</button>
        <button class="btn-secondary" onclick="fecharModal('mensagem')">Cancelar</button>
      `;
      document.getElementById("modalFechar").onclick = () =>
        fecharModal("mensagem");
    }
  });
}

function confirmarEdicao(id) {
  const novoNome = document.getElementById("novoNome").value;
  const linhas = document.querySelectorAll(".tabela-acoes tbody tr");
  linhas.forEach((linha) => {
    if (linha.children[0].textContent === String(id)) {
      linha.children[1].textContent = novoNome;
    }
  });
  fecharModal("mensagem");
  mostrarModal(`Nome atualizado para <strong>${novoNome}</strong>`, "Sucesso");
  document.getElementById(
    "modalAcoes"
  ).innerHTML = `<button class="btn-ok" onclick="fecharModal('mensagem')">OK</button>`;
  document.getElementById("modalFechar").onclick = () =>
    fecharModal("mensagem");
}

// Excluir pelo ID
function acaoExcluir(id) {
  const linhas = document.querySelectorAll(".tabela-acoes tbody tr");
  let nomeEncontrado = null;

  linhas.forEach((linha) => {
    if (linha.children[0].textContent === String(id)) {
      nomeEncontrado = linha.children[1].textContent;
    }
  });

  if (nomeEncontrado) {
    const conteudo = `<p>Confirma exclusão de <strong>${nomeEncontrado}</strong>?</p>`;
    mostrarModalErro(conteudo, "Excluir Usuário");

    document.getElementById("modalAcoesErro").innerHTML = `
      <button class="btn-danger" onclick="confirmarExclusao(${id})">Sim</button>
      <button class="btn-secondary" onclick="fecharModal('mensagemErro')">Não</button>
    `;
    document.getElementById("modalFecharErro").onclick = () =>
      fecharModal("mensagemErro");
  } else {
    mostrarModalErro(`Usuário não encontrado`, "Erro");
    document.getElementById(
      "modalAcoesErro"
    ).innerHTML = `<button class="btn-ok" onclick="fecharModal('mensagemErro')">OK</button>`;
  }
}

function confirmarExclusao(id) {
  const linhas = document.querySelectorAll(".tabela-acoes tbody tr");
  let removido = false;
  let nomeRemovido = "";

  linhas.forEach((linha) => {
    if (linha.children[0].textContent === String(id)) {
      nomeRemovido = linha.children[1].textContent;
      linha.remove();
      removido = true;
    }
  });

  fecharModal("mensagemErro");

  if (removido) {
    mostrarModalErro(
      `<strong>${nomeRemovido}</strong> foi excluído`,
      "Exclusão"
    );
    document.getElementById(
      "modalAcoesErro"
    ).innerHTML = `<button class="btn-ok" onclick="fecharModal('mensagemErro')">OK</button>`;
    document.getElementById("modalFecharErro").onclick = () =>
      fecharModal("mensagemErro");
  } else {
    mostrarModalErro(`Usuário não encontrado`, "Erro");
    document.getElementById(
      "modalAcoesErro"
    ).innerHTML = `<button class="btn-ok" onclick="fecharModal('mensagemErro')">OK</button>`;
    document.getElementById("modalFecharErro").onclick = () =>
      fecharModal("mensagemErro");
  }
}

// =======================================
// 7) ESTADO VAZIO — RECARREGAR DADOS
// =======================================

function recarregarTabelaVazia() {
  const tbody = document.querySelector(".tabela-vazia tbody");

  tbody.innerHTML = `
    <tr>
      <td>1</td>
      <td>Ana Souza</td>
      <td>Analista</td>
      <td>Ativo</td>
    </tr>
    <tr>
      <td>2</td>
      <td>Bruno Lima</td>
      <td>Desenvolvedor</td>
      <td>Ativo</td>
    </tr>
    <tr>
      <td>3</td>
      <td>Carla Mendes</td>
      <td>Designer</td>
      <td>Inativo</td>
    </tr>
  `;

  mostrarModal("Dados carregados com sucesso", "Recarregar");
}

// =======================================
// 8) RESET GLOBAL
// =======================================

let tabelaAcoesOriginal = "";
let tabelaVaziaOriginal = "";

function resetarTabelas() {
  document.querySelectorAll(".retorno").forEach((r) => (r.textContent = ""));

  const busca = document.getElementById("input-busca");
  if (busca) busca.value = "";

  paginaAtual = 1;
  renderizarPaginacao();

  document
    .querySelectorAll(".linha-selecao")
    .forEach((c) => (c.checked = false));

  const tabelaAcoes = document.querySelector("#tabela-acoes-container");
  if (tabelaAcoes && tabelaAcoesOriginal) {
    tabelaAcoes.innerHTML = tabelaAcoesOriginal;
  }

  const tabelaVazia = document.querySelector("#tabela-vazia-container");
  if (tabelaVazia && tabelaVaziaOriginal) {
    tabelaVazia.innerHTML = tabelaVaziaOriginal;
  }

  mostrarModal("Tabelas resetadas", "Reset");
}

// =======================================
// 9) Inicialização
// =======================================

window.onload = () => {
  renderizarPaginacao();

  const tabelaAcoes = document.querySelector("#tabela-acoes-container");
  if (tabelaAcoes) {
    tabelaAcoesOriginal = tabelaAcoes.innerHTML;
  }

  const tabelaVazia = document.querySelector("#tabela-vazia-container");
  if (tabelaVazia) {
    tabelaVaziaOriginal = tabelaVazia.innerHTML;
  }

  const linhasSimples = document.querySelectorAll(".tabela-simples tbody tr");

  linhasSimples.forEach((linha, index) => {
    linha.addEventListener("click", () => {
      linhasSimples.forEach((l) => l.classList.remove("linha-selecionada"));
      linha.classList.add("linha-selecionada");
      mostrarModal(`Linha ${index + 1} selecionada`, "Seleção");
    });
  });
};
// =======================================
// EXPORTS PARA TESTES UNITÁRIOS
// =======================================

module.exports = {
  // Modais
  mostrarModal,
  mostrarModalErro,
  fecharModal,

  // Tabela com Ordenação
  ordenarTabela,

  // Tabela com Busca
  filtrarTabela,

  // Tabela com Paginação
  renderizarPaginacao,
  paginaAnterior,
  proximaPagina,

  // Tabela com Seleção de Linhas
  atualizarSelecao,

  // Tabela com Ações
  acaoVer,
  acaoEditar,
  confirmarEdicao,
  acaoExcluir,
  confirmarExclusao,

  // Estado Vazio
  recarregarTabelaVazia,

  // Reset Global
  resetarTabelas,
};
