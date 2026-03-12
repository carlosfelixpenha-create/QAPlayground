import { test, expect } from "@playwright/test";

test.describe("Home - Validação de botões do menu", () => {
  test.beforeEach(async ({ page }) => {
    console.log("Abrindo página inicial...");
    await page.goto("/QAPlayground/index.html");
    console.log("URL inicial aberta:", page.url());
  });

  test("Verifica todos os botões do menu estão visíveis", async ({
    page,
    browserName,
  }) => {
    // Aumenta timeout do teste completo testando
    test.setTimeout(60000);

    const botoesMenu = [
      /Cadastro/,
      /Login/,
      /Formulário 1/,
      /Formulário 2/,
      /Formulário 3/,
      /Botões/,
      /Modais/,
      /Tabelas/,
      /Arrastando Imagens/,
      /Quebra Cabeças/,
      /Quebra Cabeça 104pcs/,
      /Acessibilidades/,
      /Instruções\/Testes/,
      /Referências/,
      /Avaliar Plataforma/,
      /Sugestões/,
    ];

    for (const nomeBotao of botoesMenu) {
      const botao = page.getByRole("button", { name: nomeBotao });
      console.log(`Verificando botão: ${nomeBotao}`);

      // Espera o botão estar visível e habilitado, até 10s
      await expect(botao).toBeVisible({ timeout: 10000 });

      // Se for Firefox, rola até o botão antes de qualquer interação futura
      if (browserName === "firefox") {
        await botao.scrollIntoViewIfNeeded();
      }

      console.log(`Botão ${nomeBotao} visível`);
    }
  });

  test("Validar avaliação com 1 estrela", async ({ page }) => {
    const btnAvaliar = page.locator("button[onclick='abrirModalAvaliacao()']");
    const modalAvaliacao = page.locator("#modal-avaliacao");

    console.log("Abrindo modal de avaliação...");
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

  test("Validar avaliação com 3 estrelas", async ({ page }) => {
    const btnAvaliar = page.locator("button[onclick='abrirModalAvaliacao()']");
    const modalAvaliacao = page.locator("#modal-avaliacao");

    console.log("Abrindo modal de avaliação...");
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

  test("Validar avaliação com 5 estrelas", async ({ page }) => {
    const btnAvaliar = page.locator("button[onclick='abrirModalAvaliacao()']");
    const modalAvaliacao = page.locator("#modal-avaliacao");

    console.log("Abrindo modal de avaliação...");
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

  test("Validar fluxo completo do modal Sugestões", async ({ page }) => {
    const btnSugestoes = page.locator("#btn-sugestoes");
    const modalSugestoes = page.locator("#modal-sugestoes");

    console.log("Abrindo modal Sugestões...");
    await btnSugestoes.click();
    await expect(modalSugestoes).toBeVisible();
    console.log("Modal Sugestões visível");

    const textarea = page.locator("#texto-sugestao");

    console.log("Preenchendo textarea...");
    await textarea.fill("Teste automático Playwright");
    await expect(textarea).toHaveValue("Teste automático Playwright");
    console.log("Textarea preenchido corretamente");

    const btnSair = page.locator("#modal-sugestoes button.btn-secondary");
    console.log("Clicando em Sair...");
    await btnSair.click();
    await expect(modalSugestoes).not.toBeVisible();
    console.log("Modal fechado");

    console.log("Reabrindo modal Sugestões...");
    await btnSugestoes.click();
    await expect(modalSugestoes).toBeVisible();

    console.log("Validando textarea limpo...");
    await expect(textarea).toHaveValue("");

    console.log("Preenchendo textarea novamente...");
    await textarea.fill("Segundo envio automático");

    const btnEnviar = page.locator("#modal-sugestoes button.btn-primary");
    console.log("Clicando em Enviar...");
    await btnEnviar.click();

    const mensagem = page.locator("#texto-mensagem");
    await expect(mensagem).toBeVisible();
    await expect(mensagem).toHaveText("Sua sugestão foi enviada com sucesso!");
    console.log("Mensagem de sucesso exibida");

    await expect(btnSugestoes).toBeDisabled();
    console.log("Botão Sugestões desabilitado após envio");
  });

  test("Abrir modal Contatos e validar links", async ({ page }) => {
    const btnContatos = page.locator("#btnContatos");
    const modalContatos = page.locator("#modal-contatos");

    console.log("Clicando no botão Contatos...");
    await btnContatos.click();
    await expect(modalContatos).toBeVisible();
    console.log("Modal Contatos visível");

    const links = modalContatos.locator("a");
    const expectedLinks = [
      "https://www.linkedin.com/in/carlos-f%C3%A9lix-9427676b",
      "https://carlosfelixpenha-create.github.io/Portfolio/",
      "https://github.com/carlosfelixpenha-create",
    ];

    console.log(`Validando ${expectedLinks.length} links do modal...`);
    await expect(links).toHaveCount(expectedLinks.length);

    for (let i = 0; i < expectedLinks.length; i++) {
      const link = links.nth(i);
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute("href", expectedLinks[i]);
      console.log(`Link ${i + 1} validado: ${expectedLinks[i]}`);
    }

    console.log("Fechando modal Contatos...");
    await page.locator("#modalContatosOk").click();
    await expect(modalContatos).not.toBeVisible();
    console.log("Modal Contatos fechado com sucesso");
  });

  test("Deve validar funcionamento completo do botão Dark Mode", async ({
    page,
  }) => {
    const toggleButton = page.locator("#toggle-dark");
    const content = page.locator(".content");

    // Verifica que o botão está visível
    await expect(toggleButton).toBeVisible();

    // Captura estado inicial
    const initialText = await toggleButton.textContent();
    const initialClass = await content.getAttribute("class");

    // 1️⃣ Primeiro clique: alterna o modo
    await toggleButton.click();

    const afterFirstClickClass = await content.getAttribute("class");
    const afterFirstClickText = await toggleButton.textContent();

    if (initialClass?.includes("dark")) {
      await expect(content).not.toHaveClass(/dark/);
      await expect(afterFirstClickText).toContain("🌙");
    } else {
      await expect(content).toHaveClass(/dark/);
      await expect(afterFirstClickText).toContain("☀️");
    }

    // 2️⃣ Segundo clique: retorna ao estado original
    await toggleButton.click();

    const afterSecondClickClass = await content.getAttribute("class");
    const afterSecondClickText = await toggleButton.textContent();

    // Valida retorno ao estado inicial
    if (initialClass?.includes("dark")) {
      await expect(content).toHaveClass(/dark/);
      await expect(afterSecondClickText).toContain("☀️");
    } else {
      await expect(content).not.toHaveClass(/dark/);
      await expect(afterSecondClickText).toContain("🌙");
    }
  });
});
