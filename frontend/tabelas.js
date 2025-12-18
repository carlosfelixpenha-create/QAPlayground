// =======================================
// ARQUIVO: tabelas.js
// Estrutura base para todas as funcionalidades
// =======================================

// Mensagem padrão de retorno
function atualizarRetorno(id, mensagem) {
  const campo = document.getElementById(id);
  if (campo) campo.textContent = mensagem;
}



// =======================================
// 1) TABELA SIMPLES
// =======================================
// (não possui lógica)



// =======================================
// 2) TABELA COM ORDENAÇÃO
// =======================================

let ordemAtual = {
  coluna: null,
  direcao: 1
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
    status: 3
  }[coluna];

  linhas.sort((a, b) => {
    const valorA = a.children[indexColuna].textContent.trim();
    const valorB = b.children[indexColuna].textContent.trim();

    if (!isNaN(valorA) && !isNaN(valorB)) {
      return (Number(valorA) - Number(valorB)) * ordemAtual.direcao;
    }

    return valorA.localeCompare(valorB) * ordemAtual.direcao;
  });

  linhas.forEach(linha => tabela.appendChild(linha));

  atualizarRetorno(
    "retorno-ordenacao",
    `Tabela ordenada por ${coluna} (${ordemAtual.direcao === 1 ? "crescente" : "decrescente"})`
  );
}



// =======================================
// 3) TABELA COM BUSCA
// =======================================

function filtrarTabela() {
  const termo = document.getElementById("input-busca").value.toLowerCase();
  const linhas = document.querySelectorAll("#tabela-busca-container tbody tr");

  let encontrou = false;

  linhas.forEach(linha => {
    const texto = linha.textContent.toLowerCase();
    const visivel = texto.includes(termo);

    linha.style.display = visivel ? "" : "none";

    if (visivel) encontrou = true;
  });

  atualizarRetorno(
    "retorno-busca",
    encontrou ? "Resultados filtrados" : "Nenhum resultado encontrado"
  );
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
    atualizarRetorno("retorno-paginacao", "Página anterior carregada");
  }
}

function proximaPagina() {
  const tabela = document.querySelector("#tabela-paginada-container tbody");
  const totalLinhas = tabela.querySelectorAll("tr").length;
  const totalPaginas = Math.ceil(totalLinhas / itensPorPagina);

  if (paginaAtual < totalPaginas) {
    paginaAtual++;
    renderizarPaginacao();
    atualizarRetorno("retorno-paginacao", "Próxima página carregada");
  }
}



// =======================================
// 5) TABELA COM SELEÇÃO DE LINHAS
// =======================================

function atualizarSelecao() {
  const checkboxes = document.querySelectorAll(".linha-selecao");
  const selecionados = Array.from(checkboxes).filter(c => c.checked).length;

  atualizarRetorno("retorno-selecao", `${selecionados} itens selecionados`);
}



// =======================================
// 6) TABELA COM AÇÕES
// =======================================

function acaoEditar(nome) {
  const novoNome = prompt(`Editar nome de ${nome}:`, nome);

  if (novoNome && novoNome.trim() !== "") {
    const linhas = document.querySelectorAll(".tabela-acoes tbody tr");

    linhas.forEach(linha => {
      if (linha.textContent.includes(nome)) {
        linha.children[1].textContent = novoNome;
      }
    });

    atualizarRetorno("retorno-acoes", `${nome} agora é ${novoNome}`);
  }
}

function acaoExcluir(nome) {
  if (confirm(`Tem certeza que deseja excluir ${nome}?`)) {
    const linhas = document.querySelectorAll(".tabela-acoes tbody tr");

    linhas.forEach(linha => {
      if (linha.textContent.includes(nome)) {
        linha.remove();
      }
    });

    atualizarRetorno("retorno-acoes", `${nome} foi excluído`);
  }
}

function acaoVer(nome) {
  const linhas = document.querySelectorAll(".tabela-acoes tbody tr");

  linhas.forEach(linha => {
    if (linha.textContent.includes(nome)) {

      const id = linha.children[0].textContent;
      const pessoa = linha.children[1].textContent;
      const cargo = linha.children[2].textContent;
      const status = linha.children[3].textContent;

      const detalhes =
        `ID: ${id}\n` +
        `Nome: ${pessoa}\n` +
        `Cargo: ${cargo}\n` +
        `Status: ${status}`;

      atualizarRetorno("retorno-acoes", detalhes);
    }
  });
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

  atualizarRetorno("retorno-vazio", "Dados carregados com sucesso");
}



// =======================================
// 8) RESET GLOBAL
// =======================================

let tabelaAcoesOriginal = "";
let tabelaVaziaOriginal = "";

function resetarTabelas() {
  // Limpa retornos
  document.querySelectorAll(".retorno").forEach(r => r.textContent = "");

  // Reseta busca
  const busca = document.getElementById("input-busca");
  if (busca) busca.value = "";

  // Reseta paginação
  paginaAtual = 1;
  renderizarPaginacao();

  // Desmarca checkboxes
  document.querySelectorAll(".linha-selecao").forEach(c => c.checked = false);

  // Restaura tabela de ações
  const tabelaAcoes = document.querySelector("#tabela-acoes-container");
  if (tabelaAcoes && tabelaAcoesOriginal) {
    tabelaAcoes.innerHTML = tabelaAcoesOriginal;
  }

  // Restaura tabela vazia
  const tabelaVazia = document.querySelector("#tabela-vazia-container");
  if (tabelaVazia && tabelaVaziaOriginal) {
    tabelaVazia.innerHTML = tabelaVaziaOriginal;
  }

  atualizarRetorno("retorno-simples", "Tabelas resetadas");
}



// =======================================
// 9) Inicialização
// =======================================

window.onload = () => {
  renderizarPaginacao();

  // Salva HTML original da tabela de ações
  const tabelaAcoes = document.querySelector("#tabela-acoes-container");
  if (tabelaAcoes) {
    tabelaAcoesOriginal = tabelaAcoes.innerHTML;
  }

  // Salva HTML original da tabela vazia
  const tabelaVazia = document.querySelector("#tabela-vazia-container");
  if (tabelaVazia) {
    tabelaVaziaOriginal = tabelaVazia.innerHTML;
  }
  // Seleção de linha na tabela simples
const linhasSimples = document.querySelectorAll(".tabela-simples tbody tr");

linhasSimples.forEach((linha, index) => {
  linha.addEventListener("click", () => {

    // Remove seleção anterior
    linhasSimples.forEach(l => l.classList.remove("linha-selecionada"));

    // Marca a linha clicada
    linha.classList.add("linha-selecionada");

    // Atualiza mensagem
    atualizarRetorno("retorno-simples", `Linha ${index + 1} selecionada`);
  });
});
};