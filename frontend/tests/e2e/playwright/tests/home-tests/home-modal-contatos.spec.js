const { test, expect } = require("@playwright/test");

test("Home - abrir modal Contatos e validar links", async ({ page }) => {
  // Abrir página inicial
  await page.goto("/QAPlayground/");

  // 🔹 Log da URL inicial
  console.log("URL inicial aberta:", page.url());

  const btnContatos = page.locator("#btnContatos");
  const modalContatos = page.locator("#modal-contatos");

  // Abrir modal
  await btnContatos.click();
  await expect(modalContatos).toBeVisible();

  const links = modalContatos.locator("a");

  const expectedLinks = [
    "https://www.linkedin.com/in/carlos-f%C3%A9lix-9427676b",
    "https://carlosfelixpenha-create.github.io/Portfolio/",
    "https://github.com/carlosfelixpenha-create",
  ];

  await expect(links).toHaveCount(expectedLinks.length);

  for (let i = 0; i < expectedLinks.length; i++) {
    const link = links.nth(i);

    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", expectedLinks[i]);
  }

  // Fechar modal
  await page.locator("#modalContatosOk").click();
  await expect(modalContatos).not.toBeVisible();
});
