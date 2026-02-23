const { test, expect } = require("@playwright/test");

test.describe("Cadastro - E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/QAPlayground/frontend/pages/cadastro.html");

    console.log("URL aberta:", page.url());

    await page.evaluate(() => localStorage.clear());
  });

  test("Fluxo feliz - Deve cadastrar usuário com sucesso", async ({ page }) => {
    await page.fill("#nome", "Joao Silva");
    await page.fill("#email", "joao@teste.com");
    await page.fill("#senha", "Abc123!");
    await page.fill("#confirmarSenha", "Abc123!");

    await page.click("#btnCadastrar");

    await expect(page.locator("#modalMensagem")).toBeVisible();
    await expect(page.locator("#modalTexto")).toContainText(
      "Cadastro realizado com sucesso!",
    );

    await expect(page.locator("#nome")).toBeDisabled();
    await expect(page.locator("#email")).toBeDisabled({ timeout: 10000 });
    await expect(page.locator("#senha")).toBeDisabled();
    await expect(page.locator("#confirmarSenha")).toBeDisabled();
    await expect(page.locator("#btnCadastrar")).toBeDisabled();

    await expect(page.locator("#btnVerUsuario")).toBeVisible();
    await expect(page.locator("#btnLimparCadastro")).toBeVisible();

    const usuarioSalvo = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("qaplayground_usuario")),
    );

    expect(usuarioSalvo.nome).toBe("Joao Silva");
    expect(usuarioSalvo.email).toBe("joao@teste.com");
  });

  test("Validação - Não deve permitir cadastro com nome inválido", async ({
    page,
  }) => {
    await page.fill("#nome", "Joao");
    await page.fill("#email", "joao@teste.com");
    await page.fill("#senha", "Abc123!");
    await page.fill("#confirmarSenha", "Abc123!");

    await page.click("#btnCadastrar");

    await expect(page.locator("#modalMensagemErro")).toBeVisible();
    await expect(page.locator("#modalTextoErro")).toContainText(
      "Preencher corretamente o campo Nome",
    );

    const usuarioSalvo = await page.evaluate(() =>
      localStorage.getItem("qaplayground_usuario"),
    );

    expect(usuarioSalvo).toBeNull();

    await expect(page.locator("#nome")).not.toBeDisabled();
    await expect(page.locator("#btnCadastrar")).not.toBeDisabled();
  });

  test("Validação - Não deve permitir cadastro com senhas diferentes", async ({
    page,
  }) => {
    await page.fill("#nome", "Maria Souza");
    await page.fill("#email", "maria@teste.com");
    await page.fill("#senha", "Abc123!");
    await page.fill("#confirmarSenha", "Diferente123!");

    await page.click("#btnCadastrar");

    await expect(page.locator("#modalMensagemErro")).toBeVisible();
    await expect(page.locator("#modalTextoErro")).toContainText(
      "As senhas não conferem",
    );

    await expect(page.locator("#nome")).not.toBeDisabled();
    await expect(page.locator("#email")).not.toBeDisabled();
    await expect(page.locator("#senha")).not.toBeDisabled();
    await expect(page.locator("#confirmarSenha")).not.toBeDisabled();
    await expect(page.locator("#btnCadastrar")).not.toBeDisabled();

    const usuarioSalvo = await page.evaluate(() =>
      localStorage.getItem("qaplayground_usuario"),
    );

    expect(usuarioSalvo).toBeNull();
  });

  test("Validação - Não deve permitir cadastro com email inválido", async ({
    page,
  }) => {
    await page.fill("#nome", "Joao Silva");
    await page.fill("#email", "joaoemail.com");
    await page.fill("#senha", "Abc123!");
    await page.fill("#confirmarSenha", "Abc123!");

    await page.click("#btnCadastrar");

    await expect(page.locator("#modalMensagemErro")).toBeVisible();
    await expect(page.locator("#modalTextoErro")).toContainText(
      "Preencher corretamente o campo E-mail",
    );

    const usuarioSalvo = await page.evaluate(() =>
      localStorage.getItem("qaplayground_usuario"),
    );

    expect(usuarioSalvo).toBeNull();

    await expect(page.locator("#email")).not.toBeDisabled();
    await expect(page.locator("#btnCadastrar")).not.toBeDisabled();
  });
  test("Navegação - Deve acessar página de requisitos e voltar para cadastro", async ({
    page,
  }) => {
    // Já estamos no cadastro por causa do beforeEach

    // Botão Requisitos existe e está visível
    const botaoRequisitos = page.locator("button:has-text('Requisitos')");
    await expect(botaoRequisitos).toBeVisible();

    // Clicar no botão
    await botaoRequisitos.click();

    // Validar que mudou a URL
    await expect(page).toHaveURL(/cadastro-requisitos.html/);

    // Validar título da página de requisitos
    await expect(page.locator("h1")).toHaveText("Requisitos 'Cadastro'");

    // Clicar no botão Voltar
    const botaoVoltar = page.locator("button:has-text('Voltar')");
    await expect(botaoVoltar).toBeVisible();
    await botaoVoltar.click();

    // Validar que voltou para cadastro
    await expect(page).toHaveURL(/cadastro.html/);
  });
});
