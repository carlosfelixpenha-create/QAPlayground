const { test, expect } = require("@playwright/test");

test("Home - validar botão Referências e links externos", async ({
  page,
  context,
}) => {
  // 1️⃣ Abrir a página inicial com URL completa
  await page.goto("https://carlosfelixpenha-create.github.io/QAPlayground/", {
    waitUntil: "domcontentloaded",
  });

  // 🔹 Log da URL inicial aberta
  console.log("URL inicial aberta:", page.url());

  // 2️⃣ Clicar no botão Referências
  const btnReferencias = page.locator("button", { hasText: "Referências" });
  await btnReferencias.click();

  // 3️⃣ Validar que abriu a página de referências
  await expect(page).toHaveURL(/referencias/i);

  // 4️⃣ Abrir link do ChatGPT (OpenAI)
  const chatGPTLink = page.locator('a[href="https://openai.com/chatgpt"]');
  const [chatGPTPage] = await Promise.all([
    context.waitForEvent("page"),
    chatGPTLink.click(),
  ]);

  await chatGPTPage.waitForLoadState("domcontentloaded");
  console.log("URL ChatGPT aberta:", chatGPTPage.url());
  await expect(chatGPTPage.url()).toMatch(/chatgpt\.com/);

  await chatGPTPage.close();

  // 5️⃣ Abrir link do GitHub
  const githubLink = page.locator('a[href="https://github.com/"]', {
    hasText: "Página oficial do GitHub",
  });
  const [githubPage] = await Promise.all([
    context.waitForEvent("page"),
    githubLink.click(),
  ]);

  //await githubPage.waitForLoadState("domcontentloaded");
  console.log("URL GitHub aberta:", githubPage.url());
  await expect(githubPage).toHaveURL(/github\.com/);

  await githubPage.close();

  // 6️⃣ Clicar no botão Voltar e validar retorno para index.html
  const btnVoltar = page.locator('button:has-text("Voltar")');
  await btnVoltar.click();

  await expect(page).toHaveURL(/index\.html$/);
});
