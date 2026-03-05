import { test, expect } from "@playwright/test";

test.describe("Home - E2E", () => {
  test.beforeEach(async ({ page }) => {
    console.log("Abrindo página inicial...");
    await page.goto("/QAPlayground/index.html"); // Caminho relativo padronizado
    console.log("URL inicial aberta:", page.url());
  });

  test("Botão Instruções/Testes funciona corretamente e Voltar retorna à home", async ({
    page,
  }) => {
    // Localizar e validar botão Instruções/Testes
    const btnInstrucoes = page.locator("button", {
      hasText: "Instruções/Testes",
    });
    console.log("Verificando botão Instruções/Testes...");
    await expect(btnInstrucoes).toBeVisible();

    // Clicar no botão e validar página de instruções
    console.log("Clicando no botão Instruções/Testes...");
    await btnInstrucoes.click();
    await expect(page).toHaveURL(/instrucoes\.html$/);
    console.log("URL Instruções/Testes aberta:", page.url());

    // Localizar e validar botão Voltar
    const btnVoltar = page.locator("button", { hasText: "Voltar" });
    console.log("Clicando no botão Voltar...");
    await btnVoltar.click();
    await expect(page).toHaveURL(/index\.html$/);
    console.log("Retorno à página inicial confirmado!");
  });
});
