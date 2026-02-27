import { test, expect } from "@playwright/test";

test.describe("Quebra-Cabeça - E2E", () => {
  test.beforeEach(async ({ page }) => {
    console.log("Abrindo página do Quebra-Cabeça...");
    await page.goto("/QAPlayground/frontend/pages/quebra-cabeca.html");
    console.log("URL aberta:", page.url());
  });

  test("Página deve carregar corretamente", async ({ page }) => {
    const h1 = page.locator("h1");
    console.log("Validando título da página...");
    await expect(h1).toHaveText("Quebra-Cabeças");

    const tabuleiro = page.locator("#tabuleiro");
    console.log("Validando visibilidade do tabuleiro...");
    await expect(tabuleiro).toBeVisible();

    const btnEmbaralhar = page.locator("#embaralhar");
    console.log("Validando botão Embaralhar desabilitado...");
    await expect(btnEmbaralhar).toBeDisabled();
  });

  test("Selecionar níveis altera quantidade de peças corretamente", async ({
    page,
  }) => {
    const niveis = [
      { btn: "4 peças", count: 4 },
      { btn: "8 peças", count: 8 },
      { btn: "16 peças", count: 16 },
      { btn: "32 peças", count: 32 },
    ];

    for (const nivel of niveis) {
      const btnNivel = page.locator(
        `#botoes-niveis button:has-text("${nivel.btn}")`,
      );
      console.log(`Selecionando nível ${nivel.btn}...`);
      await btnNivel.click();

      const pecas = page.locator("#tabuleiro .peca");
      console.log(`Validando quantidade de peças: ${nivel.count}...`);
      await expect(pecas).toHaveCount(nivel.count);
    }
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
    await expect(page).toHaveURL(/quebra-cabeca-requisitos\.html$/);

    const h1Req = page.locator("h1");
    console.log("Validando título da página de requisitos...");
    await expect(h1Req).toHaveText(/Requisitos/);

    const botaoVoltar = page.locator("button:has-text('Voltar')");
    console.log("Validando botão Voltar visível...");
    await expect(botaoVoltar).toBeVisible();

    console.log("Clicando no botão Voltar...");
    await botaoVoltar.click();

    console.log("Validando retorno à página do quebra-cabeça...");
    await expect(page).toHaveURL(/quebra-cabeca\.html$/);
  });

  test("Botão Voltar leva para a página inicial", async ({ page }) => {
    const btnVoltar = page.locator("button:has-text('Voltar')");
    console.log("Validando botão Voltar visível...");
    await expect(btnVoltar).toBeVisible();

    console.log("Clicando no botão Voltar...");
    await btnVoltar.click();

    console.log("Validando retorno para a página inicial...");
    await expect(page).toHaveURL(/index\.html$/);
  });

  test("Modal de vitória é exibido ao completar o quebra-cabeça", async ({
    page,
  }) => {
    console.log("Simulando conclusão do quebra-cabeça...");
    await page.evaluate(() => {
      const pecas = document.querySelectorAll("#tabuleiro .peca");
      pecas.forEach((p, i) => (p.dataset.index = i));
      window.verificarVitoria();
    });

    const modal = page.locator("#modalMensagem");
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

    const modal = page.locator("#modalMensagem");
    console.log("Validando modal de tabuleiro embaralhado...");
    await expect(modal).toHaveText(/Tabuleiro embaralhado/);

    console.log("Validando botão Embaralhar desabilitado após clique...");
    await expect(btnEmbaralhar).toBeDisabled();
  });
});
