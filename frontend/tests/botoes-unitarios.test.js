/**
 * @jest-environment jsdom
 *
 * Testes unitários para botoes.js
 */

const {
  mostrarModal,
  acaoPrimaria,
  acaoSecundaria,
  acaoTerciaria,
  abrirModal,
  carregar,
  acaoIcone,
  resetarPagina,
} = require("../botoes");

beforeEach(() => {
  document.body.innerHTML = `
    <div id="modalMensagem" style="display:none"></div>
    <div id="modalTexto"></div>
    <div id="modalTitulo"></div>
    <button id="modalFechar"></button>
    <button id="modalOk"></button>

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

describe("Função mostrarModal", () => {
  test("deve exibir mensagem e título de erro", () => {
    mostrarModal("Mensagem de erro", "erro");
    expect(document.getElementById("modalTexto").textContent).toBe(
      "Mensagem de erro"
    );
    expect(document.getElementById("modalTitulo").textContent).toBe("Erro");
    expect(document.getElementById("modalTitulo").style.color).toBe("red");
    expect(document.getElementById("modalMensagem").style.display).toBe(
      "block"
    );
  });

  test("deve exibir mensagem e título de sucesso", () => {
    mostrarModal("Mensagem de sucesso", "sucesso");
    expect(document.getElementById("modalTitulo").textContent).toBe("Sucesso");
    expect(document.getElementById("modalTitulo").style.color).toBe("green");
  });

  test("deve fechar modal ao clicar em OK", () => {
    mostrarModal("Teste fechar", "info");
    document.getElementById("modalOk").click();
    expect(document.getElementById("modalMensagem").style.display).toBe("none");
  });

  test("deve fechar modal ao clicar em Fechar", () => {
    mostrarModal("Teste fechar", "info");
    document.getElementById("modalFechar").click();
    expect(document.getElementById("modalMensagem").style.display).toBe("none");
  });
});

describe("Função acaoPrimaria", () => {
  test("deve executar Confirmar com sucesso", () => {
    acaoPrimaria("Confirmar");
    expect(
      document.getElementById("btn-primario-confirmar").innerText
    ).toContain("✅");
    expect(
      document.getElementById("retorno-primario").classList.contains("sucesso")
    ).toBe(true);
    expect(document.getElementById("retorno-primario").innerText).toContain(
      "sucesso"
    );
  });

  test("deve marcar erro se ação incorreta", () => {
    acaoPrimaria("Salvar");
    expect(document.getElementById("btn-primario-salvar").innerText).toContain(
      "❌"
    );
    expect(document.getElementById("btn-primario-salvar").disabled).toBe(true);
    expect(
      document.getElementById("retorno-primario").classList.contains("erro")
    ).toBe(true);
  });
});

describe("Função acaoSecundaria", () => {
  test("deve executar Cancelar com sucesso", () => {
    acaoSecundaria("Cancelar");
    expect(
      document.getElementById("btn-secundario-cancelar").innerText
    ).toContain("✅");
    expect(
      document
        .getElementById("retorno-secundario")
        .classList.contains("sucesso")
    ).toBe(true);
  });

  test("deve marcar erro se ação incorreta", () => {
    acaoSecundaria("Voltar");
    expect(
      document.getElementById("btn-secundario-voltar").innerText
    ).toContain("❌");
    expect(document.getElementById("btn-secundario-voltar").disabled).toBe(
      true
    );
    expect(
      document.getElementById("retorno-secundario").classList.contains("erro")
    ).toBe(true);
  });
});

describe("Função acaoTerciaria", () => {
  test("deve executar Exportar com sucesso", () => {
    acaoTerciaria("Exportar");
    expect(
      document.getElementById("btn-terciario-exportar").innerText
    ).toContain("✅");
    expect(
      document.getElementById("retorno-terciario").classList.contains("sucesso")
    ).toBe(true);
  });

  test("deve marcar erro se ação incorreta", () => {
    acaoTerciaria("Imprimir");
    expect(
      document.getElementById("btn-terciario-imprimir").innerText
    ).toContain("❌");
    expect(document.getElementById("btn-terciario-imprimir").disabled).toBe(
      true
    );
    expect(
      document.getElementById("retorno-terciario").classList.contains("erro")
    ).toBe(true);
  });
});

describe("Função abrirModal (Danger)", () => {
  test("deve executar Excluir com sucesso", () => {
    abrirModal("Excluir");
    expect(document.getElementById("btn-danger-excluir").innerText).toContain(
      "✅"
    );
    expect(
      document.getElementById("retorno-danger").classList.contains("sucesso")
    ).toBe(true);
  });

  test("deve marcar erro se ação incorreta", () => {
    abrirModal("Remover");
    expect(document.getElementById("btn-danger-remover").innerText).toContain(
      "❌"
    );
    expect(document.getElementById("btn-danger-remover").disabled).toBe(true);
    expect(
      document.getElementById("retorno-danger").classList.contains("erro")
    ).toBe(true);
  });
});
describe("Função carregar (Loading)", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("deve executar Processar com sucesso após timeout", () => {
    carregar("Processar");
    jest.advanceTimersByTime(4000);

    expect(
      document.getElementById("btn-loading-processar").innerHTML
    ).toContain("✅");
    expect(
      document.getElementById("retorno-loading").classList.contains("sucesso")
    ).toBe(true);
    expect(document.getElementById("retorno-loading").innerText).toContain(
      "sucesso"
    );
  });

  test("deve marcar erro se ação incorreta", () => {
    carregar("Enviar");
    jest.advanceTimersByTime(4000);

    expect(document.getElementById("btn-loading-enviar").innerHTML).toContain(
      "❌"
    );
    expect(document.getElementById("btn-loading-enviar").disabled).toBe(true);
    expect(
      document.getElementById("retorno-loading").classList.contains("erro")
    ).toBe(true);
  });
});

describe("Função acaoIcone", () => {
  test("deve executar Lápis com sucesso", () => {
    acaoIcone("Lápis");
    expect(document.getElementById("btn-icone-lapis").innerHTML).toContain(
      "✅"
    );
    expect(
      document.getElementById("retorno-icone").classList.contains("sucesso")
    ).toBe(true);
    expect(document.getElementById("retorno-icone").innerText).toContain(
      "sucesso"
    );
  });

  test("deve marcar erro se ação incorreta", () => {
    acaoIcone("Olho Aberto");
    expect(
      document.getElementById("btn-icone-olho-aberto").innerHTML
    ).toContain("❌");
    expect(document.getElementById("btn-icone-olho-aberto").disabled).toBe(
      true
    );
    expect(
      document.getElementById("retorno-icone").classList.contains("erro")
    ).toBe(true);
  });

  test("deve normalizar acento em Mãozinha", () => {
    acaoIcone("Mãozinha");
    expect(document.getElementById("btn-icone-maozinha").innerHTML).toContain(
      "❌"
    );
    expect(document.getElementById("btn-icone-maozinha").disabled).toBe(true);
    expect(
      document.getElementById("retorno-icone").classList.contains("erro")
    ).toBe(true);
  });
});

describe("Função resetarPagina", () => {
  test("deve resetar textos e reabilitar botões", () => {
    // Simula estados alterados
    document.getElementById("btn-primario-confirmar").innerText =
      "Confirmar ✅";
    document.getElementById("btn-primario-confirmar").disabled = true;
    document.getElementById("retorno-primario").innerText = "Mensagem";
    document.getElementById("retorno-primario").classList.add("sucesso");

    resetarPagina();

    expect(document.getElementById("btn-primario-confirmar").innerText).toBe(
      "Confirmar"
    );
    expect(document.getElementById("btn-primario-confirmar").disabled).toBe(
      false
    );
    expect(document.getElementById("retorno-primario").innerText).toBe("");
    expect(
      document.getElementById("retorno-primario").classList.contains("sucesso")
    ).toBe(false);
  });

  test("deve resetar ícones para estado inicial", () => {
    document.getElementById("btn-icone-lapis").innerHTML = "✏️ ✅";
    resetarPagina();
    expect(document.getElementById("btn-icone-lapis").innerHTML).toBe("✏️");
  });
});
