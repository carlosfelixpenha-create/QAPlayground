const { test, expect } = require("@playwright/test");

test("Home - validar avaliação com 1 estrela", async ({ page }) => {
  await page.goto("/QAPlayground/", { waitUntil: "domcontentloaded" });

  // Log da URL aberta
  console.log("URL inicial aberta:", page.url());

  await page.evaluate(() => sessionStorage.clear());

  const btnAvaliar = page.locator("button[onclick='abrirModalAvaliacao()']");
  const modalAvaliacao = page.locator("#modal-avaliacao");

  await btnAvaliar.click();
  await expect(modalAvaliacao).toBeVisible();

  const primeiraEstrela = page.locator("#estrelas span").nth(0);
  await primeiraEstrela.click();

  const resultado = page.locator("#resultado");

  await expect(resultado).toBeVisible();
  await expect(resultado).toHaveText(
    "Você avaliou nossa plataforma com 1 estrela! Estamos nos atualizando!",
  );

  await expect(btnAvaliar).toBeDisabled();
});

test("Home - validar avaliação com 3 estrelas", async ({ page }) => {
  await page.goto("/QAPlayground/", { waitUntil: "domcontentloaded" });

  // 🔹 Log da URL aberta
  console.log("URL inicial aberta:", page.url());

  await page.evaluate(() => sessionStorage.clear());

  const btnAvaliar = page.locator("button[onclick='abrirModalAvaliacao()']");
  const modalAvaliacao = page.locator("#modal-avaliacao");

  await btnAvaliar.click();
  await expect(modalAvaliacao).toBeVisible();

  const terceiraEstrela = page.locator("#estrelas span").nth(2);
  await terceiraEstrela.click();

  const resultado = page.locator("#resultado");

  await expect(resultado).toBeVisible();
  await expect(resultado).toHaveText(
    "Você avaliou nossa plataforma com 3 estrelas! Vamos chegar la juntos!",
  );

  await expect(btnAvaliar).toBeDisabled();
});

test("Home - validar avaliação com 5 estrelas", async ({ page }) => {
  await page.goto("/QAPlayground/", { waitUntil: "domcontentloaded" });

  // Log da URL aberta
  console.log("URL inicial aberta:", page.url());

  await page.evaluate(() => sessionStorage.clear());

  const btnAvaliar = page.locator("button[onclick='abrirModalAvaliacao()']");
  const modalAvaliacao = page.locator("#modal-avaliacao");

  await btnAvaliar.click();
  await expect(modalAvaliacao).toBeVisible();

  const quintaEstrela = page.locator("#estrelas span").nth(4);
  await quintaEstrela.click();

  const resultado = page.locator("#resultado");

  await expect(resultado).toBeVisible();
  await expect(resultado).toHaveText(
    "Você avaliou nossa plataforma com 5 estrelas! Uhuuuu, sinal que gostou!",
  );

  await expect(btnAvaliar).toBeDisabled();
});
