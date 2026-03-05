const { test, expect } = require("@playwright/test");

test("Home - validar botão Instruções/Testes", async ({ page }) => {
  // Abrir a página inicial com URL completa
  await page.goto("https://carlosfelixpenha-create.github.io/QAPlayground/", {
    waitUntil: "domcontentloaded",
  });

  // Clicar no botão Instruções/Testes
  const btnInstrucoes = page.locator("button", {
    hasText: "Instruções/Testes",
  });
  await btnInstrucoes.click();

  // Validar que abriu a página de instruções/testes
  await expect(page).toHaveURL(/instrucoes/i);

  // Log da URL aberta
  console.log("URL Instruções/Testes aberta:", page.url());

  // Clicar no botão Voltar
  const btnVoltar = page.locator('button:has-text("Voltar")');
  await btnVoltar.click();

  // Validar retorno para index.html
  await expect(page).toHaveURL(/index\.html$/);
});
