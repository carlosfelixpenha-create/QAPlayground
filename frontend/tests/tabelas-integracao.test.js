/**
 * @jest-environment jsdom
 *
 * Testes de integração para tabelas.js
 */

beforeEach(() => {
  document.body.innerHTML = `
    <!-- Tabela Simples -->
    <table class="tabela-simples">
      <tbody>
        <tr><td>1</td><td>Ana Souza</td></tr>
        <tr><td>2</td><td>Bruno Lima</td></tr>
      </tbody>
    </table>

    <!-- Tabela Ordenação -->
    <div id="tabela-ordenacao-container">
      <table class="tabela-ordenacao">
        <tbody>
          <tr><td>2</td><td>Bruno Lima</td><td>Dev</td><td>Ativo</td></tr>
          <tr><td>1</td><td>Ana Souza</td><td>Analista</td><td>Ativo</td></tr>
        </tbody>
      </table>
    </div>

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

function loadModule() {
  let mod;
  jest.isolateModules(() => {
    mod = require("../tabelas.js");
  });
  return mod;
}

describe("Fluxo de integração da página de tabelas", () => {
  test("seleção de linha simples + ordenação + busca", () => {
    const mod = loadModule();
    window.onload(); // garante listeners da tabela simples

    // Seleção de linha simples
    document.querySelector(".tabela-simples tbody tr").click();
    expect(document.getElementById("modalTexto").innerHTML).toContain(
      "Linha 1 selecionada"
    );

    // Ordenação
    mod.ordenarTabela("nome");
    expect(document.getElementById("modalTexto").innerHTML).toContain(
      "Tabela ordenada"
    );

    // Busca
    document.getElementById("input-busca").value = "Ana";
    mod.filtrarTabela();
    jest.advanceTimersByTime(3000);
    expect(document.getElementById("modalTexto").innerHTML).toContain(
      "Resultados filtrados"
    );
  });

  test("paginação + seleção de linhas + reset global", () => {
    const mod = loadModule();

    // Avança página
    mod.proximaPagina();
    expect(document.getElementById("modalTexto").innerHTML).toContain(
      "Próxima página"
    );

    // Seleção de linhas
    const checkbox = document.querySelector(".linha-selecao");
    if (checkbox) {
      checkbox.checked = true;
      mod.atualizarSelecao();
      jest.advanceTimersByTime(3000);
      expect(document.getElementById("modalTexto").innerHTML).toContain(
        "itens selecionados"
      );
    }

    // Reset global
    mod.resetarTabelas();
    expect(document.getElementById("modalTexto").innerHTML).toContain(
      "Tabelas resetadas"
    );
  });

  test("fluxo completo de ações: ver → editar → excluir", () => {
    const mod = loadModule();

    // Ver
    mod.acaoVer(1);
    expect(document.getElementById("modalTexto").innerHTML).toContain(
      "Ana Souza"
    );

    // Editar
    mod.acaoEditar(1);
    document.getElementById("novoNome").value = "Ana Silva";
    mod.confirmarEdicao(1);
    expect(
      document.querySelector(".tabela-acoes tbody tr td:nth-child(2)")
        .textContent
    ).toBe("Ana Silva");

    // Excluir
    mod.acaoExcluir(1);
    mod.confirmarExclusao(1);
    expect(document.querySelectorAll(".tabela-acoes tbody tr").length).toBe(0);
  });
});
