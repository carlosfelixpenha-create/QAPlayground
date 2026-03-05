const { test, expect } = require("@playwright/test");

test.describe("Cadastro de Endereço - E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/QAPlayground/frontend/pages/formulario-1.html");
    console.log("URL aberta:", page.url());
    await page.evaluate(() => localStorage.clear());
  });

  test("Página deve carregar corretamente", async ({ page }) => {
    const campos = [
      "#logradouro",
      "#numero",
      "#complemento",
      "#bairro",
      "#cidade",
      "#estado",
      "#cep",
      "#btnSalvar",
    ];

    for (const campo of campos) {
      await expect(page.locator(campo)).toBeVisible();
    }

    // Botões QA inicialmente ocultos
    await expect(page.locator("#btnVerEndereco")).not.toBeVisible();
    await expect(page.locator("#btnLimparEndereco")).not.toBeVisible();
  });

  test("Fluxo feliz - Deve cadastrar endereço com sucesso", async ({
    page,
  }) => {
    await page.fill("#logradouro", "Rua Teste");
    await page.fill("#numero", "10");
    await page.fill("#complemento", "Apto 101");
    await page.fill("#bairro", "BairroTeste");
    await page.fill("#cidade", "CidadeTeste");
    await page.fill("#estado", "sp");
    await page.fill("#cep", "12345678");

    await page.click("#btnSalvar");

    await expect(page.locator("#modalMensagem")).toBeVisible();
    await expect(page.locator("#modalTexto")).toContainText(
      "Endereço cadastrado com sucesso!",
    );

    await page.click("#modalOk");

    const enderecoSalvo = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("endereco")),
    );

    expect(enderecoSalvo.logradouro).toBe("Rua Teste");
    expect(enderecoSalvo.numero).toBe("10");
    expect(enderecoSalvo.complemento).toBe("Apto 101");
    expect(enderecoSalvo.bairro).toBe("BairroTeste");
    expect(enderecoSalvo.cidade).toBe("CidadeTeste");
    expect(enderecoSalvo.estado).toBe("SP");
    expect(enderecoSalvo.cep.replace("-", "")).toBe("12345678");

    // Botões QA devem aparecer
    await expect(page.locator("#btnVerEndereco")).toBeVisible();
    await expect(page.locator("#btnLimparEndereco")).toBeVisible();
  });

  test("Validação - Campos obrigatórios", async ({ page }) => {
    await page.click("#btnSalvar");

    await expect(page.locator("#modalMensagemErro")).toBeVisible();
    await expect(page.locator("#modalTextoErro")).toContainText(
      /Preencher corretamente o campo Logradouro/,
    );

    await page.click("#modalOkErro");
  });

  test("Validação - Logradouro não numérico", async ({ page }) => {
    await page.fill("#logradouro", "12345");
    await page.fill("#numero", "10");
    await page.fill("#bairro", "BairroTeste");
    await page.fill("#cidade", "CidadeTeste");
    await page.fill("#estado", "SP");
    await page.fill("#cep", "12345678");

    await page.click("#btnSalvar");

    await expect(page.locator("#modalMensagemErro")).toBeVisible();
    await expect(page.locator("#modalTextoErro")).toContainText(/Logradouro/);

    await page.click("#modalOkErro");
  });

  test("Validação - Número deve ser numérico", async ({ page }) => {
    await page.fill("#logradouro", "Rua Teste");
    await page.fill("#numero", "ABC");
    await page.fill("#bairro", "BairroTeste");
    await page.fill("#cidade", "CidadeTeste");
    await page.fill("#estado", "SP");
    await page.fill("#cep", "12345678");

    await page.click("#btnSalvar");

    await expect(page.locator("#modalMensagemErro")).toBeVisible();
    await expect(page.locator("#modalTextoErro")).toContainText(/Número/);

    await page.click("#modalOkErro");
  });

  test("Validação - Bairro e Cidade mínimo 3 caracteres", async ({ page }) => {
    await page.fill("#logradouro", "Rua Teste");
    await page.fill("#numero", "10");
    await page.fill("#bairro", "AB");
    await page.fill("#cidade", "CD");
    await page.fill("#estado", "SP");
    await page.fill("#cep", "12345678");

    await page.click("#btnSalvar");

    await expect(page.locator("#modalMensagemErro")).toBeVisible();
    await expect(page.locator("#modalTextoErro")).toContainText(
      /Bairro|Cidade/,
    );

    await page.click("#modalOkErro");
  });

  test("Validação - Estado (UF) inválido", async ({ page }) => {
    await page.fill("#logradouro", "Rua Teste");
    await page.fill("#numero", "10");
    await page.fill("#bairro", "BairroTeste");
    await page.fill("#cidade", "CidadeTeste");
    await page.fill("#estado", "XX");
    await page.fill("#cep", "12345678");

    await page.click("#btnSalvar");

    await expect(page.locator("#modalMensagemErro")).toBeVisible();
    await expect(page.locator("#modalTextoErro")).toContainText(/UF inválida/);

    await page.click("#modalOkErro");
  });

  test("Validação - CEP inválido", async ({ page }) => {
    await page.fill("#logradouro", "Rua Teste");
    await page.fill("#numero", "10");
    await page.fill("#bairro", "BairroTeste");
    await page.fill("#cidade", "CidadeTeste");
    await page.fill("#estado", "SP");
    await page.fill("#cep", "123");

    await page.click("#btnSalvar");

    await expect(page.locator("#modalMensagemErro")).toBeVisible();
    await expect(page.locator("#modalTextoErro")).toContainText(/CEP/);

    await page.click("#modalOkErro");
  });

  test("QA Button - Ver endereço salvo", async ({ page }) => {
    await page.fill("#logradouro", "Rua Teste");
    await page.fill("#numero", "10");
    await page.fill("#bairro", "BairroTeste");
    await page.fill("#cidade", "CidadeTeste");
    await page.fill("#estado", "SP");
    await page.fill("#cep", "12345678");

    await page.click("#btnSalvar");
    await page.click("#modalOk");

    await expect(page.locator("#btnVerEndereco")).toBeVisible();

    await page.click("#btnVerEndereco");

    await expect(page.locator("#modalMensagem")).toBeVisible();
    await expect(page.locator("#modalTexto")).toContainText(
      "Rua Teste, 10 - BairroTeste, CidadeTeste/SP",
    );

    await page.click("#modalOk");
  });

  test("QA Button - Limpar endereço", async ({ page }) => {
    await page.fill("#logradouro", "Rua Teste");
    await page.fill("#numero", "10");
    await page.fill("#bairro", "BairroTeste");
    await page.fill("#cidade", "CidadeTeste");
    await page.fill("#estado", "SP");
    await page.fill("#cep", "12345678");

    await page.click("#btnSalvar");
    await page.click("#modalOk");

    await expect(page.locator("#btnLimparEndereco")).toBeVisible();

    await page.click("#btnLimparEndereco");

    const campos = [
      "#logradouro",
      "#numero",
      "#complemento",
      "#bairro",
      "#cidade",
      "#estado",
      "#cep",
    ];

    for (const campo of campos) {
      await expect(page.locator(campo)).toBeEnabled();
      await expect(page.locator(campo)).toHaveValue("");
    }

    await expect(page.locator("#btnSalvar")).toBeEnabled();
    await expect(page.locator("#btnVerEndereco")).not.toBeVisible();
    await expect(page.locator("#btnLimparEndereco")).not.toBeVisible();
  });

  test("Navegação - Deve acessar página de requisitos e voltar para formulário 1", async ({
    page,
  }) => {
    // Já estamos no formulario-1 por causa do beforeEach

    const botaoRequisitos = page.locator("button:has-text('Requisitos')");
    await expect(botaoRequisitos).toBeVisible();

    await botaoRequisitos.click();

    await expect(page).toHaveURL(/formulario-1-requisitos.html/);

    await expect(page.locator("h1")).toHaveText(
      "Requisitos 'Cadastro de Endereço'",
    );

    const botaoVoltar = page.locator("button:has-text('Voltar')");
    await expect(botaoVoltar).toBeVisible();

    await botaoVoltar.click();

    await expect(page).toHaveURL(/formulario-1.html/);
  });
});
