const { test, expect } = require("@playwright/test");

test("Home - validar botão Instruções/Testes", async ({ page }) => {
  // 1️⃣ Abrir a página inicial com URL completa
  await page.goto("https://carlosfelixpenha-create.github.io/QAPlayground/", {
    waitUntil: "domcontentloaded",
  });

  // 2️⃣ Clicar no botão Instruções/Testes
  const btnInstrucoes = page.locator("button", {
    hasText: "Instruções/Testes",
  });
  await btnInstrucoes.click();

  // 3️⃣ Validar que abriu a página de instruções/testes
  await expect(page).toHaveURL(/instrucoes/i);

  // 🔹 Log da URL aberta
  console.log("URL Instruções/Testes aberta:", page.url());

  // 4️⃣ Clicar no botão Voltar
  const btnVoltar = page.locator('button:has-text("Voltar")');
  await btnVoltar.click();

  // 5️⃣ Validar retorno para index.html
  await expect(page).toHaveURL(/index\.html$/);
});
