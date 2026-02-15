const { test, expect } = require("@playwright/test");

test("Home - validar fluxo completo da modal Sugestões", async ({ page }) => {
  // 1️⃣ Abrir página inicial
  await page.goto("/QAPlayground/", { waitUntil: "domcontentloaded" });

  // 🔹 Log da URL inicial
  console.log("URL inicial aberta:", page.url());

  const btnSugestoes = page.locator("#btn-sugestoes");
  const modalSugestoes = page.locator("#modal-sugestoes");

  // Abrir modal
  await btnSugestoes.click();
  await expect(modalSugestoes).toBeVisible();

  const textarea = page.locator("#texto-sugestao");

  // Preencher textarea
  await textarea.fill("Teste automático Playwright");
  await expect(textarea).toHaveValue("Teste automático Playwright");

  // Clicar em Sair
  const btnSair = page.locator("#modal-sugestoes button.btn-secondary");
  await btnSair.click();
  await expect(modalSugestoes).not.toBeVisible();

  // Reabrir modal
  await btnSugestoes.click();
  await expect(modalSugestoes).toBeVisible();

  // Validar que o textarea está vazio
  await expect(textarea).toHaveValue("");

  // Preencher novamente
  await textarea.fill("Segundo envio automático");

  // Clicar em Enviar
  const btnEnviar = page.locator("#modal-sugestoes button.btn-primary");
  await btnEnviar.click();

  // Validar mensagem de sucesso
  const mensagem = page.locator("#texto-mensagem");

  await expect(mensagem).toBeVisible();
  await expect(mensagem).toHaveText("Sua sugestão foi enviada com sucesso!");
  await expect(btnSugestoes).toBeDisabled();
});
