/**
 * @jest-environment jsdom
 *
 * Testes unitários para tabelas.js
 */

beforeEach(() => {
  // Monta DOM antes de importar o módulo
  document.body.innerHTML = `
    <!-- Tabela Simples -->
    <table class="tabela-simples">
      <tbody>
        <tr><td>1</td><td>Ana Souza</td></tr>
        <tr><td>2</td><td>Bruno Lima</td></tr>
      </tbody>
    </table>

    <!-- Tabela Ordenação -->
    <table class="tabela-ordenacao">
      <tbody>
        <tr><td>2</td><td>Bruno Lima</td><td>Dev</td><td>Ativo</td></tr>
        <tr><td>1</td><td>Ana Souza</td><td>Analista</td><td>Ativo</td></tr>
      </tbody>
    </table>

    <!-- Tabela Busca -->
    <div id="tabela-busca-container">
      <input id="input-busca" />
      <table>
        <tbody>
          <tr><td>1</td><td>Ana Souza</td></tr>
          <tr><td>2</td><td>Bruno Lima</td></tr>
        </tbody>
      </table>
    </div>

    <!-- Tabela Paginação -->
    <div id="tabela-paginada-container">
      <table>
        <tbody>
          <tr><td>1</td></tr>
          <tr><td>2</td></tr>
          <tr><td>3</td></tr>
          <tr><td>4</td></tr>
        </tbody>
      </table>
    </div>
    <span id="pagina-atual"></span>

    <!-- Tabela Seleção -->
    <table>
      <tbody>
        <tr><td><input type="checkbox" class="linha-selecao" /></td><td>Ana Souza</td></tr>
        <tr><td><input type="checkbox" class="linha-selecao" /></td><td>Bruno Lima</td></tr>
      </tbody>
    </table>

    <!-- Tabela Ações -->
    <div id="tabela-acoes-container" class="tabela-acoes">
      <table>
        <tbody>
          <tr>
            <td>1</td><td>Ana Souza</td><td>Analista</td><td>Ativo</td>
            <td>
              <button onclick="acaoVer(1)">Ver</button>
              <button onclick="acaoEditar(1)">Editar</button>
              <button onclick="acaoExcluir(1)">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Tabela Vazia -->
    <div id="tabela-vazia-container" class="tabela-vazia">
      <table><tbody><tr><td colspan="4">Nenhum registro encontrado</td></tr></tbody></table>
    </div>

    <!-- Modais -->
    <div id="modalMensagem" class="modal">
      <div class="modal-content">
        <span id="modalTitulo"></span>
        <p id="modalTexto"></p>
        <div id="modalAcoes"></div>
        <button id="modalFechar">X</button>
      </div>
    </div>
    <div id="modalMensagemErro" class="modal">
      <div class="modal-content">
        <span id="modalTituloErro"></span>
        <p id="modalTextoErro"></p>
        <div id="modalAcoesErro"></div>
        <button id="modalFecharErro">X</button>
      </div>
    </div>
  `;
  jest.useFakeTimers();
});

// Função auxiliar para importar o módulo depois do DOM
function loadModule() {
  let mod;
  jest.isolateModules(() => {
    mod = require("../tabelas.js");
  });
  return mod;
}

describe("Tabela Simples", () => {
  test("deve selecionar linha e abrir modal", () => {
    const mod = loadModule();
    // força execução da inicialização
    window.onload();

    const linha = document.querySelector(".tabela-simples tbody tr");
    linha.click();

    expect(document.getElementById("modalMensagem").style.display).toBe("flex");
    expect(document.getElementById("modalTexto").innerHTML).toContain(
      "Linha 1 selecionada"
    );
  });
});

describe("Tabela com Ordenação", () => {
  test("deve ordenar por nome e abrir modal", () => {
    const { ordenarTabela } = loadModule();
    ordenarTabela("nome");
    expect(document.getElementById("modalMensagem").style.display).toBe("flex");
    expect(document.getElementById("modalTexto").innerHTML).toContain(
      "Tabela ordenada"
    );
  });
});

describe("Tabela com Busca", () => {
  test("deve filtrar resultados e abrir modal após delay", () => {
    const { filtrarTabela } = loadModule();
    document.getElementById("input-busca").value = "Ana";
    filtrarTabela();
    jest.advanceTimersByTime(3000);
    expect(document.getElementById("modalMensagem").style.display).toBe("flex");
  });
});

describe("Tabela com Paginação", () => {
  test("deve avançar página e abrir modal", () => {
    const { proximaPagina } = loadModule();
    proximaPagina();
    expect(document.getElementById("modalMensagem").style.display).toBe("flex");
  });
  test("deve retornar página e abrir modal", () => {
    const { paginaAnterior, proximaPagina } = loadModule();
    proximaPagina();
    paginaAnterior();
    expect(document.getElementById("modalMensagem").style.display).toBe("flex");
  });
});

describe("Tabela com Seleção de Linhas", () => {
  test("deve abrir modal após selecionar checkbox com delay", () => {
    const { atualizarSelecao } = loadModule();
    const checkbox = document.querySelector(".linha-selecao");
    checkbox.checked = true;
    atualizarSelecao();
    jest.advanceTimersByTime(3000);
    expect(document.getElementById("modalMensagem").style.display).toBe("flex");
  });
});

describe("Tabela com Ações", () => {
  test("deve abrir modal com detalhes ao ver", () => {
    const { acaoVer } = loadModule();
    acaoVer(1);
    expect(document.getElementById("modalMensagem").style.display).toBe("flex");
    expect(document.getElementById("modalTexto").innerHTML).toContain(
      "Ana Souza"
    );
  });

  test("deve abrir modal de edição", () => {
    const { acaoEditar } = loadModule();
    acaoEditar(1);
    expect(document.getElementById("novoNome").value).toBe("Ana Souza");
  });

  test("deve atualizar nome ao confirmar edição", () => {
    const { acaoEditar, confirmarEdicao } = loadModule();
    acaoEditar(1);
    document.getElementById("novoNome").value = "Ana Silva";
    confirmarEdicao(1);
    const linha = document.querySelector(".tabela-acoes tbody tr");
    expect(linha.children[1].textContent).toBe("Ana Silva");
  });

  test("deve abrir modal de exclusão", () => {
    const { acaoExcluir } = loadModule();
    acaoExcluir(1);
    expect(document.getElementById("modalMensagemErro").style.display).toBe(
      "flex"
    );
  });

  test("deve remover linha ao confirmar exclusão", () => {
    const { confirmarExclusao } = loadModule();
    confirmarExclusao(1);
    const linhas = document.querySelectorAll(".tabela-acoes tbody tr");
    expect(linhas.length).toBe(0);
  });
});

describe("Estado Vazio", () => {
  test("deve recarregar dados e abrir modal", () => {
    const { recarregarTabelaVazia } = loadModule();
    recarregarTabelaVazia();
    expect(document.querySelector(".tabela-vazia tbody tr")).not.toBeNull();
    expect(document.getElementById("modalMensagem").style.display).toBe("flex");
  });
});

describe("Reset Global", () => {
  test("deve resetar tabelas e abrir modal", () => {
    const { resetarTabelas } = loadModule();
    resetarTabelas();
    expect(document.getElementById("modalMensagem").style.display).toBe("flex");
    expect(document.getElementById("modalTexto").innerHTML).toContain(
      "Tabelas resetadas"
    );
  });
});
