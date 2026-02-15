const { test, expect } = require("@playwright/test");

test("Home - validar botão Referências e links externos", async ({ page }) => {
  // 1️⃣ Abrir a página inicial com URL completa
  await page.goto("https://carlosfelixpenha-create.github.io/QAPlayground/", {
    waitUntil: "domcontentloaded",
  });

  console.log("URL inicial aberta:", page.url());

  // 2️⃣ Clicar no botão Referências
  const btnReferencias = page.locator("button", { hasText: "Referências" });
  await btnReferencias.click();

  // 3️⃣ Validar que abriu a página de referências
  await expect(page).toHaveURL(/referencias/i);

  // 4️⃣ Validar link do ChatGPT (apenas existência e href)
  const chatGPTLink = page.locator('a[href="https://openai.com/chatgpt"]');
  await expect(chatGPTLink).toHaveCount(1);

  // 5️⃣ Validar link do GitHub (apenas existência e href)
  const githubLink = page.locator('a[href="https://github.com/"]', {
    hasText: "Página oficial do GitHub",
  });
  await expect(githubLink).toHaveCount(1);

  // 6️⃣ Clicar no botão Voltar e validar retorno para index.html
  const btnVoltar = page.locator('button:has-text("Voltar")');
  await btnVoltar.click();
  await expect(page).toHaveURL(/index\.html$/);
});
