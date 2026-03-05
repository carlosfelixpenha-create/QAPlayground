import { test, expect } from "@playwright/test";

test.describe("Quebra-Cabeça 104 Peças - E2E", () => {
  test.beforeEach(async ({ page }) => {
    console.log("Abrindo página do Quebra-Cabeça 104 Peças...");
    await page.goto("/QAPlayground/frontend/pages/quebra-cabeca-104pcs.html");
    console.log("URL aberta:", page.url());
  });

  test("Deve carregar o tabuleiro e referência corretamente", async ({
    page,
  }) => {
    console.log("Validando visibilidade do tabuleiro...");
    const tabuleiro = page.locator("#tabuleiro104pcs");
    await expect(tabuleiro).toBeVisible();

    console.log("Validando total de peças...");
    const pecas = tabuleiro.locator(".peca");
    await expect(pecas).toHaveCount(104);

    console.log("Validando imagem de referência...");
    const referencia = page.locator("#referencia img");
    await expect(referencia).toBeVisible();

    console.log("Validando botão Embaralhar desabilitado...");
    const btnEmbaralhar = page.locator("#embaralhar");
    await expect(btnEmbaralhar).toBeDisabled();
  });

  test("Botão Requisitos deve navegar para a página de requisitos e voltar", async ({
    page,
  }) => {
    const botaoRequisitos = page.locator("button.requisitos");
    console.log("Validando botão Requisitos visível...");
    await expect(botaoRequisitos).toBeVisible();
    console.log("Clicando no botão Requisitos...");
    await botaoRequisitos.click();

    console.log("Validando URL da página de requisitos...");
    await expect(page).toHaveURL(
      /\/QAPlayground\/frontend\/pages\/quebra-cabeca-104pcs-requisitos.html/,
    );
    console.log("URL atual:", page.url());

    console.log("Validando título da página de requisitos...");
    await expect(page.locator("h1")).toHaveText(
      "Requisitos 'Quebra-Cabeça 104 Peças'",
    );

    const botaoVoltar = page.locator("button:has-text('Voltar')");
    console.log("Validando botão Voltar visível...");
    await expect(botaoVoltar).toBeVisible();
    console.log("Clicando no botão Voltar...");
    await botaoVoltar.click();

    console.log("Validando retorno para a página do quebra-cabeça...");
    await expect(page).toHaveURL(
      /\/QAPlayground\/frontend\/pages\/quebra-cabeca-104pcs.html/,
    );
    console.log("URL atual:", page.url());
  });

  test("Botão Voltar leva para a página inicial", async ({ page }) => {
    const btnVoltar = page.locator("button:has-text('Voltar')");
    console.log("Validando botão Voltar visível...");
    await expect(btnVoltar).toBeVisible();
    console.log("Clicando no botão Voltar...");
    await btnVoltar.click();

    console.log("Validando retorno para a página inicial...");
    await expect(page).toHaveURL(/\/QAPlayground\/index.html/);
    console.log("URL atual:", page.url());
  });

  test("Modal de vitória é exibido ao completar o quebra-cabeça", async ({
    page,
  }) => {
    console.log("Simulando conclusão do quebra-cabeça...");
    await page.evaluate(() => {
      const pecas = document.querySelectorAll("#tabuleiro104pcs .peca");
      pecas.forEach((p, i) => (p.dataset.index = i));
      window.verificarConclusao();
    });

    const modal = page.locator("#modal-mensagem");
    console.log("Validando modal de vitória...");
    await expect(modal).toHaveText(/Parabéns/);

    const btnEmbaralhar = page.locator("#embaralhar");
    console.log("Validando botão Embaralhar habilitado...");
    await expect(btnEmbaralhar).toBeEnabled();
  });

  test("Botão Embaralhar reembaralha o tabuleiro e mostra modal", async ({
    page,
  }) => {
    const btnEmbaralhar = page.locator("#embaralhar");

    console.log("Habilitando botão Embaralhar manualmente para teste...");
    await page.evaluate(
      () => (document.getElementById("embaralhar").disabled = false),
    );

    console.log("Clicando no botão Embaralhar...");
    await btnEmbaralhar.click();

    const modal = page.locator("#modal-mensagem");
    console.log("Validando modal de tabuleiro embaralhado...");
    await expect(modal).toHaveText(/Tabuleiro embaralhado/);

    console.log("Validando botão Embaralhar desabilitado após clique...");
    await expect(btnEmbaralhar).toBeDisabled();
  });
});
