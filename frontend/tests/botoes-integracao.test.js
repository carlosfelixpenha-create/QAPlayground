/**
 * @jest-environment jsdom
 *
 * Testes de integração para botoes.js
 * Validam o fluxo completo de interação com os botões
 */

const {
  acaoPrimaria,
  acaoSecundaria,
  acaoTerciaria,
  abrirModal,
  carregar,
  acaoIcone,
  resetarPagina,
} = require("../js/botoes.js");

beforeEach(() => {
  document.body.innerHTML = `
    <div id="modalMensagem" style="display:none"></div>
    <div id="modalTexto"></div>
    <div id="modalTitulo"></div>
    <button id="modalFechar"></button>
    <button id="modalOk"></button>

    <!-- elementos de erro adicionados -->
    <div id="modalMensagemErro" style="display:none"></div>
    <div id="modalTextoErro"></div>
    <button id="modalFecharErro"></button>
    <button id="modalOkErro"></button>

    <div id="retorno-primario" class="retorno"></div>
    <button id="btn-primario-salvar"></button>
    <button id="btn-primario-concluir"></button>
    <button id="btn-primario-confirmar"></button>
    <button id="btn-primario-login"></button>
    <button id="btn-primario-criar"></button>

    <div id="retorno-secundario" class="retorno"></div>
    <button id="btn-secundario-voltar"></button>
    <button id="btn-secundario-cancelar"></button>
    <button id="btn-secundario-limpar"></button>
    <button id="btn-secundario-seguir"></button>
    <button id="btn-secundario-excluir"></button>

    <div id="retorno-terciario" class="retorno"></div>
    <button id="btn-terciario-imprimir"></button>
    <button id="btn-terciario-exportar"></button>
    <button id="btn-terciario-ver"></button>
    <button id="btn-terciario-filtros"></button>
    <button id="btn-terciario-sair"></button>

    <div id="retorno-danger" class="retorno"></div>
    <button id="btn-danger-excluir"></button>
    <button id="btn-danger-remover"></button>
    <button id="btn-danger-apagar"></button>
    <button id="btn-danger-desativar"></button>
    <button id="btn-danger-formatar"></button>

    <div id="retorno-loading" class="retorno"></div>
    <button id="btn-loading-enviar"></button>
    <button id="btn-loading-processar"></button>
    <button id="btn-loading-baixar"></button>
    <button id="btn-loading-progresso"></button>
    <button id="btn-loading-salvar"></button>

    <div id="retorno-icone" class="retorno"></div>
    <button id="btn-icone-lapis"></button>
    <button id="btn-icone-olho-aberto"></button>
    <button id="btn-icone-olho-fechado"></button>
    <button id="btn-icone-raio"></button>
    <button id="btn-icone-maozinha"></button>
  `;
});

describe("Fluxo de integração - Botões Primários", () => {
  test("usuário clica em Confirmar", () => {
    acaoPrimaria("Confirmar");
    expect(document.getElementById("retorno-primario").innerText).toContain(
      "sucesso"
    );
    expect(
      document.getElementById("btn-primario-confirmar").innerText
    ).toContain("✅");
  });

  test("usuário clica em Salvar incorretamente", () => {
    acaoPrimaria("Salvar");
    expect(document.getElementById("retorno-primario").innerText).toContain(
      "Erro:"
    );
    expect(document.getElementById("btn-primario-salvar").innerText).toContain(
      "❌"
    );
  });
});

describe("Fluxo de integração - Botões Secundários", () => {
  test("usuário clica em Cancelar", () => {
    acaoSecundaria("Cancelar");
    expect(document.getElementById("retorno-secundario").innerText).toContain(
      "sucesso"
    );
    expect(
      document.getElementById("btn-secundario-cancelar").innerText
    ).toContain("✅");
  });

  test("usuário clica em Voltar incorretamente", () => {
    acaoSecundaria("Voltar");
    expect(document.getElementById("retorno-secundario").innerText).toContain(
      "Erro:"
    );
    expect(
      document.getElementById("btn-secundario-voltar").innerText
    ).toContain("❌");
  });
});

describe("Fluxo de integração - Botões Terciários", () => {
  test("usuário clica em Exportar", () => {
    acaoTerciaria("Exportar");
    expect(document.getElementById("retorno-terciario").innerText).toContain(
      "sucesso"
    );
    expect(
      document.getElementById("btn-terciario-exportar").innerText
    ).toContain("✅");
  });

  test("usuário clica em Imprimir incorretamente", () => {
    acaoTerciaria("Imprimir");
    expect(document.getElementById("retorno-terciario").innerText).toContain(
      "Erro:"
    );
    expect(
      document.getElementById("btn-terciario-imprimir").innerText
    ).toContain("❌");
  });
});

describe("Fluxo de integração - Botões Danger", () => {
  test("usuário clica em Excluir", () => {
    abrirModal("Excluir");
    expect(document.getElementById("retorno-danger").innerText).toContain(
      "sucesso"
    );
    expect(document.getElementById("btn-danger-excluir").innerText).toContain(
      "✅"
    );
  });

  test("usuário clica em Remover incorretamente", () => {
    abrirModal("Remover");
    expect(document.getElementById("retorno-danger").innerText).toContain(
      "Erro:"
    );
    expect(document.getElementById("btn-danger-remover").innerText).toContain(
      "❌"
    );
  });
});

describe("Fluxo de integração - Botões Loading", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  test("usuário clica em Processar", () => {
    carregar("Processar");
    jest.advanceTimersByTime(4000);
    expect(document.getElementById("retorno-loading").innerText).toContain(
      "sucesso"
    );
    expect(
      document.getElementById("btn-loading-processar").innerHTML
    ).toContain("✅");
  });

  test("usuário clica em Enviar incorretamente", () => {
    carregar("Enviar");
    jest.advanceTimersByTime(4000);
    expect(document.getElementById("retorno-loading").innerText).toContain(
      "Erro:"
    );
    expect(document.getElementById("btn-loading-enviar").innerHTML).toContain(
      "❌"
    );
  });
});

describe("Fluxo de integração - Botões de Ícone", () => {
  test("usuário clica em Lápis", () => {
    acaoIcone("Lápis");
    expect(document.getElementById("retorno-icone").innerText).toContain(
      "sucesso"
    );
    expect(document.getElementById("btn-icone-lapis").innerHTML).toContain(
      "✅"
    );
  });

  test("usuário clica em Olho Aberto incorretamente", () => {
    acaoIcone("Olho Aberto");
    expect(document.getElementById("retorno-icone").innerText).toContain(
      "Erro:"
    );
    expect(
      document.getElementById("btn-icone-olho-aberto").innerHTML
    ).toContain("❌");
  });
});

describe("Fluxo de integração - Resetar Página", () => {
  test("usuário reseta a página", () => {
    acaoPrimaria("Confirmar");
    resetarPagina();
    expect(document.getElementById("btn-primario-confirmar").innerText).toBe(
      "Confirmar"
    );
    expect(document.getElementById("btn-primario-confirmar").disabled).toBe(
      false
    );
    expect(document.getElementById("retorno-primario").innerText).toBe("");
  });
});
