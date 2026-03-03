const { test, expect } = require("@playwright/test");

test.describe("Catálogo de Botões - Botões Primários", () => {
  test.beforeEach(async ({ page }) => {
    // Abre a página do catálogo de botões
    await page.goto("/QAPlayground/frontend/pages/botoes.html", {
      waitUntil: "domcontentloaded",
    });

    console.log("URL aberta:", page.url());
  });

  // Teste 1: Clique correto (Confirmar)
  test("Botão Primário - Confirmar funciona corretamente", async ({ page }) => {
    // Clica no botão correto
    await page.click("#btn-primario-confirmar");

    // Verifica o texto de retorno
    const retorno = await page.locator("#retorno-primario");
    await expect(retorno).toHaveText(
      "Sucesso: Ação Confirmar executada com sucesso!",
    );
    await expect(retorno).toHaveClass(/sucesso/);

    // Verifica se todos os botões primários estão desabilitados
    const botoes = await page.locator("[id^='btn-primario']");
    const botoesCount = await botoes.count();
    for (let i = 0; i < botoesCount; i++) {
      await expect(botoes.nth(i)).toBeDisabled();
    }

    // Fecha o modal de sucesso
    await page.click("#modalOk");

    // Reseta a página usando o botão Limpar
    await page.click(".resetar");
    await expect(retorno).toHaveText("");
    for (let i = 0; i < botoesCount; i++) {
      await expect(botoes.nth(i)).toBeEnabled();
    }
  });

  // Teste 2: Clique incorreto (Salvar)
  test("Botão Primário - Clicar em botão incorreto mostra erro", async ({
    page,
  }) => {
    // Clica no botão incorreto
    await page.click("#btn-primario-salvar");

    // Verifica o texto de retorno
    const retorno = await page.locator("#retorno-primario");
    await expect(retorno).toHaveText(
      'Erro: Clicar no botão "Salvar" não é permitido. Use o botão Confirmar.',
    );
    await expect(retorno).toHaveClass(/erro/);

    // Verifica se o botão clicado está desabilitado
    await expect(page.locator("#btn-primario-salvar")).toBeDisabled();

    // Fecha o modal de erro
    await page.click("#modalOkErro");

    // Reseta a página usando o botão Limpar
    await page.click(".resetar");
    const botoes = await page.locator("[id^='btn-primario']");
    const botoesCount = await botoes.count();
    await expect(retorno).toHaveText("");
    for (let i = 0; i < botoesCount; i++) {
      await expect(botoes.nth(i)).toBeEnabled();
    }
  });

  // ===============================
  // TESTES BOTÕES SECUNDÁRIOS
  // ===============================
  test("Botão Secundário - Cancelar funciona corretamente", async ({
    page,
  }) => {
    const btnCancelar = page.locator("#btn-secundario-cancelar");
    const retorno = page.locator("#retorno-secundario");
    const botoes = page.locator("[id^='btn-secundario']");

    // Clica no botão correto
    await btnCancelar.click();

    // Valida texto de retorno e classe de sucesso
    await expect(retorno).toHaveText(
      /Sucesso: Ação Cancelar realizada com sucesso!/,
    );
    await expect(retorno).toHaveClass(/sucesso/);

    // Verifica que todos os botões secundários estão desabilitados
    const botoesCount = await botoes.count();
    for (let i = 0; i < botoesCount; i++) {
      await expect(botoes.nth(i)).toBeDisabled();
    }

    // Fecha o modal de sucesso
    await page.click("#modalOk");

    // Reseta a página usando o botão Limpar
    await page.click(".resetar");
    await expect(retorno).toHaveText("");
    for (let i = 0; i < botoesCount; i++) {
      await expect(botoes.nth(i)).toBeEnabled();
    }
  });

  test("Botão Secundário - Clicar em botão incorreto mostra erro", async ({
    page,
  }) => {
    const btnVoltar = page.locator("#btn-secundario-voltar");
    const retorno = page.locator("#retorno-secundario");
    const botoes = page.locator("[id^='btn-secundario']");

    // Clica no botão incorreto
    await btnVoltar.click();

    // Valida texto de retorno e classe de erro
    await expect(retorno).toHaveText(
      /Erro: Clicar no botão "Voltar" não é permitido. Use o botão Cancelar./,
    );
    await expect(retorno).toHaveClass(/erro/);

    // Verifica que o botão clicado está desabilitado
    await expect(btnVoltar).toBeDisabled();

    // Verifica se o modal de erro aparece
    const modal = page.locator("#modalMensagemErro");
    await expect(modal).toBeVisible();

    // Fecha o modal de erro
    await page.click("#modalOkErro");

    // Reseta a página usando o botão Limpar
    await page.click(".resetar");
    await expect(retorno).toHaveText("");
    const botoesCount = await botoes.count();
    for (let i = 0; i < botoesCount; i++) {
      await expect(botoes.nth(i)).toBeEnabled();
    }
  });

  test("Botão Secundário - Resetar com Limpar", async ({ page }) => {
    const btnLimpar = page.locator(".resetar");
    const btnCancelar = page.locator("#btn-secundario-cancelar");
    const retorno = page.locator("#retorno-secundario");
    const botoes = page.locator("[id^='btn-secundario']");

    // Clica no botão Cancelar para desabilitar
    await btnCancelar.click();
    await expect(btnCancelar).toBeDisabled();

    // Fecha modal de sucesso antes de limpar
    await page.click("#modalOk");

    // Reseta todos os botões com o Limpar
    await page.click(".resetar");
    await expect(retorno).toHaveText("");
    const botoesCount = await botoes.count();
    for (let i = 0; i < botoesCount; i++) {
      await expect(botoes.nth(i)).toBeEnabled();
    }
  });

  // ===============================
  // TESTES BOTÕES DE PERIGO
  // ===============================
  test("Botão de Perigo - Excluir funciona corretamente", async ({ page }) => {
    const btnExcluir = page.locator("#btn-danger-excluir");
    const retorno = page.locator("#retorno-danger");
    const botoes = page.locator("[id^='btn-danger']");

    // Clica no botão correto
    await btnExcluir.click();

    // Valida texto de retorno e classe de sucesso
    await expect(retorno).toHaveText(/Excluir concluído com sucesso!/);
    await expect(retorno).toHaveClass(/sucesso/);

    // Verifica que todos os botões de perigo estão desabilitados
    const botoesCount = await botoes.count();
    for (let i = 0; i < botoesCount; i++) {
      await expect(botoes.nth(i)).toBeDisabled();
    }

    // Fecha o modal de sucesso
    await page.click("#modalOk");

    // Reseta a página usando o botão Limpar
    await page.click(".resetar");
    await expect(retorno).toHaveText("");
    for (let i = 0; i < botoesCount; i++) {
      await expect(botoes.nth(i)).toBeEnabled();
    }
  });

  test("Botão de Perigo - Clicar em botão incorreto mostra erro", async ({
    page,
  }) => {
    const btnRemover = page.locator("#btn-danger-remover");
    const retorno = page.locator("#retorno-danger");
    const botoes = page.locator("[id^='btn-danger']");

    // Clica no botão incorreto
    await btnRemover.click();

    // Valida texto de retorno e classe de erro
    await expect(retorno).toHaveText(
      /Erro: Clicar no botão "Remover" não é permitido. Use o botão Excluir./,
    );
    await expect(retorno).toHaveClass(/erro/);

    // Verifica que o botão clicado está desabilitado
    await expect(btnRemover).toBeDisabled();

    // Verifica se o modal de erro aparece
    const modal = page.locator("#modalMensagemErro");
    await expect(modal).toBeVisible();

    // Fecha o modal de erro
    await page.click("#modalOkErro");

    // Reseta a página usando o botão Limpar
    await page.click(".resetar");
    await expect(retorno).toHaveText("");
    const botoesCount = await botoes.count();
    for (let i = 0; i < botoesCount; i++) {
      await expect(botoes.nth(i)).toBeEnabled();
    }
  });

  test("Botão de Perigo - Resetar com Limpar", async ({ page }) => {
    const btnLimpar = page.locator(".resetar");
    const btnExcluir = page.locator("#btn-danger-excluir");
    const retorno = page.locator("#retorno-danger");
    const botoes = page.locator("[id^='btn-danger']");

    // Clica no botão correto para desabilitar
    await btnExcluir.click();
    await expect(btnExcluir).toBeDisabled();

    // Fecha modal de sucesso
    await page.click("#modalOk");

    // Reseta todos os botões com o Limpar
    await page.click(".resetar");
    await expect(retorno).toHaveText("");
    const botoesCount = await botoes.count();
    for (let i = 0; i < botoesCount; i++) {
      await expect(botoes.nth(i)).toBeEnabled();
    }
  });

  // ===============================
  // BOTÃO COM LOADING
  // ===============================
  test("Botão Loading - Processar funciona corretamente", async ({ page }) => {
    const btnProcessar = page.locator("#btn-loading-processar");
    const retorno = page.locator("#retorno-loading");
    const botoes = page.locator("[id^='btn-loading']");

    // Clica no botão correto
    await btnProcessar.click();

    // Aguarda o tempo do loading (4s)
    await page.waitForTimeout(4100);

    // Valida texto de retorno e classe de sucesso
    await expect(retorno).toHaveText(
      "Sucesso: Ação Processar concluída com sucesso!",
    );
    await expect(retorno).toHaveClass(/sucesso/);

    // Verifica se todos os botões estão desabilitados
    const botoesCount = await botoes.count();
    for (let i = 0; i < botoesCount; i++) {
      await expect(botoes.nth(i)).toBeDisabled();
    }

    // Fecha o modal de sucesso
    await page.click("#modalOk");

    // Reseta a página usando o botão Limpar
    await page.click(".resetar");
    await expect(retorno).toHaveText("");
    for (let i = 0; i < botoesCount; i++) {
      await expect(botoes.nth(i)).toBeEnabled();
    }
  });

  test("Botão Loading - Clicar em botão incorreto mostra erro", async ({
    page,
  }) => {
    const btnEnviar = page.locator("#btn-loading-enviar");
    const retorno = page.locator("#retorno-loading");
    const botoes = page.locator("[id^='btn-loading']");

    // Clica no botão incorreto
    await btnEnviar.click();

    // Aguarda o tempo do loading (4s)
    await page.waitForTimeout(4100);

    // Valida texto de retorno e classe de erro
    await expect(retorno).toHaveText(
      'Erro: Clicar no botão "Enviar" não é permitido. Use o botão Processar.',
    );
    await expect(retorno).toHaveClass(/erro/);

    // Verifica se o botão clicado está desabilitado
    await expect(btnEnviar).toBeDisabled();

    // Fecha o modal de erro
    await page.click("#modalOkErro");

    // Reseta a página usando o botão Limpar
    await page.click(".resetar");
    await expect(retorno).toHaveText("");
    const botoesCount = await botoes.count();
    for (let i = 0; i < botoesCount; i++) {
      await expect(botoes.nth(i)).toBeEnabled();
    }
  });

  // ===============================
  // BOTÃO DE ÍCONE (Lápis)
  // ===============================
  test("Botão de Ícone - Lápis funciona corretamente", async ({ page }) => {
    const btnLapis = page.locator("#btn-icone-lapis");
    const retorno = page.locator("#retorno-icone");
    const botoes = page.locator("[id^='btn-icone']");

    // Clica no botão correto
    await btnLapis.click();

    // Valida texto de retorno e classe de sucesso
    await expect(retorno).toHaveText(
      "Sucesso: Ação Lápis executada com sucesso!",
    );
    await expect(retorno).toHaveClass(/sucesso/);

    // Verifica que todos os botões estão desabilitados
    const botoesCount = await botoes.count();
    for (let i = 0; i < botoesCount; i++) {
      await expect(botoes.nth(i)).toBeDisabled();
    }

    // Fecha o modal de sucesso
    await page.click("#modalOk");

    // Reseta a página usando o botão Limpar
    await page.click(".resetar");
    await expect(retorno).toHaveText("");
    for (let i = 0; i < botoesCount; i++) {
      await expect(botoes.nth(i)).toBeEnabled();
    }
  });

  test("Botão de Ícone - Clicar em botão incorreto mostra erro", async ({
    page,
  }) => {
    const btnOlhoAberto = page.locator("#btn-icone-olho-aberto");
    const retorno = page.locator("#retorno-icone");
    const botoes = page.locator("[id^='btn-icone']");

    // Clica no botão incorreto
    await btnOlhoAberto.click();

    // Valida texto de retorno e classe de erro
    await expect(retorno).toHaveText(
      'Erro: Clicar no botão "Olho Aberto" não é permitido. Use o botão Lápis.',
    );
    await expect(retorno).toHaveClass(/erro/);

    // Verifica que o botão clicado está desabilitado
    await expect(btnOlhoAberto).toBeDisabled();

    // Verifica se o modal de erro aparece
    const modal = page.locator("#modalMensagemErro");
    await expect(modal).toBeVisible();

    // Fecha o modal de erro
    await page.click("#modalOkErro");

    // Reseta a página usando o botão Limpar
    await page.click(".resetar");
    await expect(retorno).toHaveText("");
    const botoesCount = await botoes.count();
    for (let i = 0; i < botoesCount; i++) {
      await expect(botoes.nth(i)).toBeEnabled();
    }
  });

  test("Botão de Ícone - Resetar com Limpar", async ({ page }) => {
    const btnLapis = page.locator("#btn-icone-lapis");
    const retorno = page.locator("#retorno-icone");
    const botoes = page.locator("[id^='btn-icone']");

    // Clica no botão correto para desabilitar
    await btnLapis.click();
    await expect(btnLapis).toBeDisabled();

    // Fecha modal de sucesso antes de limpar
    await page.click("#modalOk");

    // Reseta todos os botões com o Limpar
    await page.click(".resetar");
    await expect(retorno).toHaveText("");
    const botoesCount = await botoes.count();
    for (let i = 0; i < botoesCount; i++) {
      await expect(botoes.nth(i)).toBeEnabled();
    }
  });

  // ===============================
  // NAVEGAÇÃO - Botão Requisitos e Voltar
  // ===============================
  test("Botão Requisitos - deve navegar corretamente para a página de requisitos", async ({
    page,
  }) => {
    const btnRequisitos = page.locator("button.requisitos");

    // Botão deve existir e estar habilitado
    await expect(btnRequisitos).toBeVisible();
    await expect(btnRequisitos).toBeEnabled();

    // Clica no botão
    await btnRequisitos.click();

    // Valida navegação para a página de requisitos
    await expect(page).toHaveURL(/botoes-requisitos\.html$/);
  });

  test("Botão Voltar - deve retornar para a página principal de botões", async ({
    page,
  }) => {
    // Seleciona o botão Voltar pelo texto visível
    const btnVoltar = page.getByRole("button", { name: "Voltar" }).first();

    // Botão deve existir e estar habilitado
    await expect(btnVoltar).toBeVisible();
    await expect(btnVoltar).toBeEnabled();

    // Clica no botão Voltar
    await btnVoltar.click();

    // Valida navegação de volta para a página principal de botões
    await expect(page).toHaveURL(/botoes\.html$/);
  });
});
