import { test, expect } from "@playwright/test";

test.describe("Referências - E2E", () => {
  test.beforeEach(async ({ page }) => {
    console.log("Abrindo página de Referências...");
    await page.goto("/QAPlayground/frontend/pages/referencias.html");
    console.log("URL aberta:", page.url());
  });

  test("Botão Voltar existe e redireciona corretamente", async ({ page }) => {
    const botaoVoltar = page.locator("button", { hasText: "Voltar" });
    console.log("Verificando botão Voltar...");
    await expect(botaoVoltar).toBeVisible();

    console.log("Clicando no botão Voltar...");
    await botaoVoltar.click();
    await expect(page).toHaveURL(/index\.html$/);
    console.log("Redirecionamento confirmado!");
  });

  test("Links de títulos/logos estão corretos, logos visíveis, alt preenchido e abrem em nova aba", async ({
    page,
  }) => {
    const h2Links = page.locator("h2 a");
    const h2Count = await h2Links.count();
    console.log(`Verificando ${h2Count} links de títulos/logos...`);

    for (let i = 0; i < h2Count; i++) {
      const link = h2Links.nth(i);
      const href = await link.getAttribute("href");
      console.log(`Link ${i + 1}: ${href}`);
      expect(href).toBeTruthy();

      // Validar target="_blank" e rel="noopener noreferrer"
      const target = await link.getAttribute("target");
      const rel = await link.getAttribute("rel");
      expect(target).toBe("_blank");
      expect(rel).toBe("noopener noreferrer");
      console.log(`Link ${i + 1} abre em nova aba corretamente`);

      // Validar logo
      const img = link.locator("img");
      await expect(img).toBeVisible();
      const src = await img.getAttribute("src");
      const alt = await img.getAttribute("alt");
      console.log(`Logo ${i + 1} src: ${src}, alt: ${alt}`);
      expect(src).toBeTruthy();
      expect(alt).toBeTruthy();
    }
  });

  test("Links nas descrições estão corretos e abrem em nova aba", async ({
    page,
  }) => {
    const liLinks = page.locator("ul li a");
    const liCount = await liLinks.count();
    console.log(`Verificando ${liCount} links nas descrições...`);

    for (let i = 0; i < liCount; i++) {
      const link = liLinks.nth(i);
      const href = await link.getAttribute("href");
      console.log(`Descrição Link ${i + 1}: ${href}`);
      expect(href).toBeTruthy();

      // Validar target="_blank" e rel="noopener noreferrer"
      const target = await link.getAttribute("target");
      const rel = await link.getAttribute("rel");
      expect(target).toBe("_blank");
      expect(rel).toBe("noopener noreferrer");
      console.log(`Descrição Link ${i + 1} abre em nova aba corretamente`);
    }
  });
});
