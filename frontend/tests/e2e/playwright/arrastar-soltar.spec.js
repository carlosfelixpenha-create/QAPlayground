import { test, expect } from "@playwright/test";

// Helper para drag & drop usando DataTransfer
async function dragAndDrop(page, sourceSelector, targetSelector) {
  const source = await page.locator(sourceSelector);
  const target = await page.locator(targetSelector);

  const img = await target.locator("img");
  await expect(img).toHaveCount(1);
  await expect(img).toBeVisible();

  const dataTransfer = await page.evaluateHandle(() => new DataTransfer());

  await source.dispatchEvent("dragstart", { dataTransfer });
  await target.dispatchEvent("dragover", { dataTransfer });
  await target.dispatchEvent("drop", { dataTransfer });
  await source.dispatchEvent("dragend", { dataTransfer });
}

test.describe("Arrastar e Soltar - E2E (Cobertura Máxima)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/QAPlayground/frontend/pages/arrastar-soltar.html");
    console.log("Página Arrastar e Soltar aberta:", page.url());
  });

  test("Página deve carregar com HUD, botões e imagens visíveis", async ({
    page,
  }) => {
    await expect(page.locator("#movimentos")).toBeVisible();
    await expect(page.locator("#acertos")).toBeVisible();
    await expect(page.locator("#erros")).toBeVisible();
    await expect(page.locator("button.requisitos")).toBeVisible();
    await expect(page.locator("button:has-text('Voltar')")).toBeVisible();
    await expect(page.locator("#reiniciar")).toBeVisible();

    const slots = page.locator(".item-slot");
    const count = await slots.count();
    for (let i = 0; i < count; i++) {
      const slot = slots.nth(i);
      const img = slot.locator("img");
      await expect(img).toHaveCount(1);
      await expect(img).toBeVisible();
    }
  });

  test("Drag & Drop correto incrementa acertos e movimentos e bloqueia palavra", async ({
    page,
  }) => {
    await dragAndDrop(
      page,
      '.tag-palavra[data-tipo="casa"]',
      '.item-slot[data-tipo="casa"]',
    );
    await expect(page.locator("#acertos")).toHaveText("1");
    await expect(page.locator("#movimentos")).toHaveText("1");
    await expect(page.locator("#erros")).toHaveText("0");

    const palavra = page.locator('.tag-palavra[data-tipo="casa"]');
    await expect(palavra).toHaveAttribute("draggable", "false");
    await expect(palavra).toHaveCSS("opacity", "0.5");
  });

  test("Drag & Drop errado incrementa erros e mantém slot com imagem", async ({
    page,
  }) => {
    await dragAndDrop(
      page,
      '.tag-palavra[data-tipo="casa"]',
      '.item-slot[data-tipo="carro"]',
    );
    await expect(page.locator("#erros")).toHaveText("1");
    await expect(page.locator("#acertos")).toHaveText("0");
    await expect(page.locator("#movimentos")).toHaveText("1");

    const slot = page.locator('.item-slot[data-tipo="carro"] p');
    await expect(slot).toHaveText(/✖ Casa/);
    await expect(
      page.locator('.item-slot[data-tipo="carro"] img'),
    ).toBeVisible();
  });

  test("Reiniciar reseta HUD, slots, palavras e mantém imagens", async ({
    page,
  }) => {
    await dragAndDrop(
      page,
      '.tag-palavra[data-tipo="casa"]',
      '.item-slot[data-tipo="casa"]',
    );
    await page.click("#reiniciar");

    await expect(page.locator("#acertos")).toHaveText("0");
    await expect(page.locator("#erros")).toHaveText("0");
    await expect(page.locator("#movimentos")).toHaveText("0");

    const palavra = page.locator('.tag-palavra[data-tipo="casa"]');
    await expect(palavra).toHaveAttribute("draggable", "true");
    await expect(palavra).toHaveCSS("opacity", "1");

    const slot = page.locator('.item-slot[data-tipo="casa"]');
    await expect(slot.locator("p")).toHaveCount(0);
    await expect(slot.locator("img")).toBeVisible();
  });

  test("Botão Requisitos navega e Voltar retorna corretamente", async ({
    page,
  }) => {
    const botaoRequisitos = page.locator("button.requisitos");
    await Promise.all([page.waitForNavigation(), botaoRequisitos.click()]);
    await expect(page).toHaveURL(/arrastar-soltar-requisitos\.html$/);

    const botaoVoltar = page.locator("button:has-text('Voltar')");
    await Promise.all([page.waitForNavigation(), botaoVoltar.click()]);
    await expect(page).toHaveURL(/arrastar-soltar\.html$/);
  });

  test("Completar todos os pares dispara modal final com mensagem adequada", async ({
    page,
  }) => {
    const pares = [
      "casa",
      "campo",
      "morro",
      "predio",
      "ponte",
      "carro",
      "barco",
    ];
    for (const tipo of pares) {
      await dragAndDrop(
        page,
        `.tag-palavra[data-tipo="${tipo}"]`,
        `.item-slot[data-tipo="${tipo}"]`,
      );
    }

    await page.waitForSelector("#mensagem-final p", { timeout: 5000 });
    const mensagemFinal = page.locator("#mensagem-final p").first();
    await expect(mensagemFinal).toBeVisible();
    await expect(mensagemFinal).toHaveText(
      /Uhuuuuuuu!!! Sucesso|Sucesso|Parabéns|Boa! Mas dá pra melhorar/,
    );
  });

  test("Todas imagens nos slots são válidas antes de iniciar o jogo", async ({
    page,
  }) => {
    const slots = page.locator(".item-slot");
    const count = await slots.count();
    for (let i = 0; i < count; i++) {
      const slot = slots.nth(i);
      const img = slot.locator("img");
      await expect(img).toHaveCount(1);
      await expect(img).toBeVisible();
    }
  });
});
