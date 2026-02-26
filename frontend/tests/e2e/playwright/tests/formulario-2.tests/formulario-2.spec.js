const { test, expect } = require("@playwright/test");

test.describe("Formulário 2 - Campos Diversos - E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/QAPlayground/frontend/pages/formulario-2.html");
    console.log("URL aberta:", page.url());
  });

  test("Página deve carregar corretamente", async ({ page }) => {
    await expect(page.locator("#masculino")).toBeVisible();
    await expect(page.locator("#feminino")).toBeVisible();

    await expect(page.locator("#dataNascimento")).toBeVisible();
    await expect(page.locator("#telefone")).toBeVisible();
    await expect(page.locator("#cpf")).toBeVisible();

    await expect(page.locator('button:has-text("Enviar")')).toBeVisible();
  });

  test("Fluxo feliz - Deve enviar formulário com sucesso", async ({ page }) => {
    // Seleciona sexo
    await page.check("#masculino");

    // Seleciona interesse
    await page.check("#qa");

    // Data válida (maior de 16 anos)
    await page.fill("#dataNascimento", "2000-01-01");

    // Telefone e CPF
    await page.fill("#telefone", "11999999999");
    await page.fill("#cpf", "12345678900");

    // Enviar
    await page.click('button:has-text("Enviar")');

    // Valida modal de sucesso
    await expect(page.locator("#modalMensagem")).toBeVisible();
    await expect(page.locator("#modalTexto")).toContainText(
      "Formulário enviado com sucesso!",
    );

    await page.click("#modalOk");

    // Verifica se campos foram limpos
    await expect(page.locator("#masculino")).not.toBeChecked();
    await expect(page.locator("#qa")).not.toBeChecked();
    await expect(page.locator("#dataNascimento")).toHaveValue("");
    await expect(page.locator("#telefone")).toHaveValue("");
    await expect(page.locator("#cpf")).toHaveValue("");
  });

  test("Validação - Sexo não selecionado", async ({ page }) => {
    // Seleciona ao menos um interesse
    await page.check("#qa");

    // Preenche campos obrigatórios válidos
    await page.fill("#dataNascimento", "2000-01-01");
    await page.fill("#telefone", "11999999999");
    await page.fill("#cpf", "12345678900");

    // Enviar
    await page.click('button:has-text("Enviar")');

    // Valida modal de erro
    await expect(page.locator("#modalMensagemErro")).toBeVisible();
    await expect(page.locator("#modalTextoErro")).toContainText(
      "Preencher corretamente o campo Sexo",
    );

    await page.click("#modalOkErro");
  });

  test("Validação - Interesses não selecionado", async ({ page }) => {
    // Seleciona sexo
    await page.check("#masculino");

    // Preenche campos obrigatórios válidos
    await page.fill("#dataNascimento", "2000-01-01");
    await page.fill("#telefone", "11999999999");
    await page.fill("#cpf", "12345678900");

    // Enviar
    await page.click('button:has-text("Enviar")');

    // Valida modal de erro
    await expect(page.locator("#modalMensagemErro")).toBeVisible();
    await expect(page.locator("#modalTextoErro")).toContainText(
      "Selecione ao menos uma opção em Interesses",
    );

    await page.click("#modalOkErro");
  });

  test("Validação - Data de Nascimento vazia", async ({ page }) => {
    // Seleciona sexo
    await page.check("#masculino");

    // Seleciona ao menos um interesse
    await page.check("#qa");

    // Preenche os outros campos obrigatórios
    await page.fill("#telefone", "11999999999");
    await page.fill("#cpf", "12345678900");

    // Enviar
    await page.click('button:has-text("Enviar")');

    // Valida modal de erro
    await expect(page.locator("#modalMensagemErro")).toBeVisible();
    await expect(page.locator("#modalTextoErro")).toContainText(
      "Preencher corretamente o campo Data de Nascimento",
    );

    await page.click("#modalOkErro");
  });

  test("Validação - Telefone vazio", async ({ page }) => {
    // Seleciona sexo
    await page.check("#masculino");

    // Seleciona ao menos um interesse
    await page.check("#qa");

    // Preenche campos obrigatórios válidos
    await page.fill("#dataNascimento", "2000-01-01");
    await page.fill("#cpf", "12345678900");

    // Enviar
    await page.click('button:has-text("Enviar")');

    // Valida modal de erro
    await expect(page.locator("#modalMensagemErro")).toBeVisible();
    await expect(page.locator("#modalTextoErro")).toContainText(
      "Preencher corretamente o campo Telefone",
    );

    await page.click("#modalOkErro");
  });

  test("Validação - CPF vazio", async ({ page }) => {
    // Seleciona sexo
    await page.check("#masculino");

    // Seleciona ao menos um interesse
    await page.check("#qa");

    // Preenche campos obrigatórios válidos
    await page.fill("#dataNascimento", "2000-01-01");
    await page.fill("#telefone", "11999999999");

    // Enviar
    await page.click('button:has-text("Enviar")');

    // Valida modal de erro
    await expect(page.locator("#modalMensagemErro")).toBeVisible();
    await expect(page.locator("#modalTextoErro")).toContainText(
      "Preencher corretamente o campo CPF",
    );

    await page.click("#modalOkErro");
  });

  test("Validação - Telefone com letras", async ({ page }) => {
    // Seleciona sexo
    await page.check("#masculino");

    // Seleciona ao menos um interesse
    await page.check("#qa");

    // Preenche campos válidos
    await page.fill("#dataNascimento", "2000-01-01");
    await page.fill("#cpf", "12345678900");

    // Telefone inválido (com letras)
    await page.fill("#telefone", "11ABC999999");

    // Enviar
    await page.click('button:has-text("Enviar")');

    // Valida modal de erro
    await expect(page.locator("#modalMensagemErro")).toBeVisible();
    await expect(page.locator("#modalTextoErro")).toContainText(
      "Preencher corretamente o campo Telefone, dúvida entrar em requisitos!",
    );

    await page.click("#modalOkErro");
  });

  test("Validação - CPF com letras ou caracteres especiais", async ({
    page,
  }) => {
    // Assume que o beforeEach já abriu a página
    // Seleciona sexo
    await page.check("#masculino");

    // Seleciona ao menos um interesse
    await page.check("#qa");

    // Preenche campos válidos
    await page.fill("#dataNascimento", "2000-01-01");
    await page.fill("#telefone", "99999999999");

    // CPF inválido com letras e caracteres especiais
    await page.fill("#cpf", "abc123!@#");

    // Clica em enviar
    await page.click('button:has-text("Enviar")');

    // Valida modal de erro
    await expect(page.locator("#modalMensagemErro")).toBeVisible();
    await expect(page.locator("#modalTextoErro")).toContainText(
      "Preencher corretamente o campo CPF, dúvida entrar em requisitos!",
    );

    // Fecha o modal
    await page.click("#modalOkErro");
  });

  // 🧪 Validação - Data de Nascimento futura
  test("Validação - Data de Nascimento futura", async ({ page }) => {
    // Campos obrigatórios válidos
    await page.check("#masculino");
    await page.check("#qa");
    await page.fill("#cpf", "12345678900"); // CPF do fluxo feliz
    await page.fill("#telefone", "11999999999");

    // Data futura
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    const futureStr = futureDate.toISOString().split("T")[0];
    await page.fill("#dataNascimento", futureStr);

    // Enviar
    await page.click('button:has-text("Enviar")');

    // Valida modal de erro
    await expect(page.locator("#modalMensagemErro")).toBeVisible();
    await expect(page.locator("#modalTextoErro")).toContainText(
      "Data de Nascimento não pode ser futura!",
    );

    await page.click("#modalOkErro");
  });

  // 🧪 Validação - Data de Nascimento menor que 16 anos
  test("Validação - Data de Nascimento menor que 16 anos", async ({ page }) => {
    // Campos obrigatórios válidos
    await page.check("#masculino");
    await page.check("#qa");
    await page.fill("#cpf", "12345678900"); // CPF do fluxo feliz
    await page.fill("#telefone", "11999999999");

    // Data menor que 16 anos
    const today = new Date();
    const minorDate = new Date(
      today.getFullYear() - 15,
      today.getMonth(),
      today.getDate(),
    );
    const minorStr = minorDate.toISOString().split("T")[0];
    await page.fill("#dataNascimento", minorStr);

    // Enviar
    await page.click('button:has-text("Enviar")');

    // Valida modal de erro
    await expect(page.locator("#modalMensagemErro")).toBeVisible();
    await expect(page.locator("#modalTextoErro")).toContainText(
      "Idade mínima permitida é de 16 anos!",
    );

    await page.click("#modalOkErro");
  });

  // 🧪 Modal - Corrigir erro e enviar com sucesso
  test("Modal - Corrigir erro e enviar com sucesso", async ({ page }) => {
    // Preenche com CPF inválido primeiro
    await page.check("#masculino");
    await page.check("#qa");
    await page.fill("#cpf", "abc123!@#"); // CPF inválido
    await page.fill("#telefone", "11999999999");
    await page.fill("#dataNascimento", "2000-01-01");

    // Enviar
    await page.click('button:has-text("Enviar")');

    // Valida erro
    await expect(page.locator("#modalMensagemErro")).toBeVisible();
    await page.click("#modalOkErro");

    // Corrige CPF com o válido do fluxo feliz
    await page.fill("#cpf", "12345678900");

    // Enviar novamente
    await page.click('button:has-text("Enviar")');

    // Valida sucesso usando os IDs corretos do fluxo feliz
    await expect(page.locator("#modalMensagem")).toBeVisible();
    await expect(page.locator("#modalTexto")).toContainText(
      "Formulário enviado com sucesso!",
    );

    await page.click("#modalOk");
  });
});
