const { test, expect } = require("@playwright/test");

test.describe("Login - E2E", () => {
  test.beforeEach(async ({ page }) => {
    // Abre a página local/publicada do login
    await page.goto("/QAPlayground/frontend/pages/login.html");

    console.log("URL aberta:", page.url());

    // Limpa localStorage antes de cada teste
    await page.evaluate(() => localStorage.clear());
  });

  test("Página deve carregar corretamente", async ({ page }) => {
    await expect(page.locator("#usuario")).toBeVisible();
    await expect(page.locator("#senha")).toBeVisible();
    await expect(page.locator("#captcha")).toBeVisible();
    await expect(page.locator("#btnEntrar")).toBeVisible();
    await expect(page.locator("#toggleSenha")).toBeVisible();
  });

  test("Fluxo feliz - Deve logar com sucesso", async ({ page }) => {
    // Preenche campos
    await page.fill("#usuario", "carlos@teste.com");
    await page.fill("#senha", "Senha1!");
    await page.check("#captcha");

    // Salva cadastro no localStorage (simulando cadastro já existente)
    await page.evaluate(() => {
      localStorage.setItem(
        "qaplayground_usuario",
        JSON.stringify({
          nome: "Carlos Silva",
          email: "carlos@teste.com",
          senha: "Senha1!",
        }),
      );
    });

    // Clica no botão Entrar
    await page.click("#btnEntrar");

    // Valida sucesso
    await expect(page.locator("#modalMensagem")).toBeVisible();
    await expect(page.locator("#modalTexto")).toContainText(
      "Login realizado com sucesso!",
    );
  });

  test("Validação - Não deve permitir login com senha incorreta", async ({
    page,
  }) => {
    await page.fill("#usuario", "carlos@teste.com");
    await page.fill("#senha", "SenhaErrada");
    await page.check("#captcha");

    // Salva cadastro no localStorage
    await page.evaluate(() => {
      localStorage.setItem(
        "qaplayground_usuario",
        JSON.stringify({
          nome: "Carlos Silva",
          email: "carlos@teste.com",
          senha: "Senha1!",
        }),
      );
    });

    await page.click("#btnEntrar");

    await expect(page.locator("#modalMensagemErro")).toBeVisible();
    await expect(page.locator("#modalTextoErro")).toContainText(
      "Usuário ou senha inválidos",
    );
  });

  test("Validação - Não deve permitir login sem marcar captcha", async ({
    page,
  }) => {
    await page.fill("#usuario", "carlos@teste.com");
    await page.fill("#senha", "Senha1!");
    await page.uncheck("#captcha");

    await page.click("#btnEntrar");

    await expect(page.locator("#modalMensagemErro")).toBeVisible();
    await expect(page.locator("#modalTextoErro")).toContainText(
      "Marque o captcha",
    );
  });

  test("Validação - Não deve permitir login com usuário inexistente", async ({
    page,
  }) => {
    await page.fill("#usuario", "naoexiste@teste.com");
    await page.fill("#senha", "Senha1!");
    await page.check("#captcha");

    // Garante que localStorage está vazio
    await page.evaluate(() => localStorage.clear());

    await page.click("#btnEntrar");

    await expect(page.locator("#modalMensagemErro")).toBeVisible();
    await expect(page.locator("#modalTextoErro")).toContainText(
      "Nenhum cadastro encontrado",
    );
  });

  test("Toggle de senha funciona corretamente", async ({ page }) => {
    const btn = page.locator("#toggleSenha");
    const input = page.locator("#senha");

    // Inicialmente password
    await expect(input).toHaveAttribute("type", "password");

    await btn.click();
    await expect(input).toHaveAttribute("type", "text");
    await expect(btn).toHaveAttribute("aria-label", "Ocultar senha");

    await btn.click();
    await expect(input).toHaveAttribute("type", "password");
    await expect(btn).toHaveAttribute("aria-label", "Mostrar senha");
  });
});
