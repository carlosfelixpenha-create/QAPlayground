const { test, expect } = require("@playwright/test");

test.describe("Catálogo de Modais - E2E (Fluxo Feliz Inicial)", () => {
  test.beforeEach(async ({ page }) => {
    // Abre a página real dos modais (mesmo padrão do login)
    await page.goto("/QAPlayground/frontend/pages/modais.html", {
      waitUntil: "domcontentloaded",
    });

    console.log("URL aberta:", page.url());

    // Garante estado limpo
    await page.evaluate(() => localStorage.clear());
  });

  test("Modal de Confirmação - fluxo feliz deve funcionar corretamente", async ({
    page,
  }) => {
    const btnAbrirConfirmacao = page.locator(
      "button[onclick=\"abrirModal('confirmacao')\"]",
    );

    // Botão principal deve existir e estar habilitado
    await expect(btnAbrirConfirmacao).toBeVisible();
    await expect(btnAbrirConfirmacao).toBeEnabled();

    // Abre o modal
    await btnAbrirConfirmacao.click();

    const modal = page.locator("#modal-confirmacao");
    await expect(modal).toBeVisible();

    // Botão confirmar começa desabilitado
    const btnConfirmar = page.locator("#btn-confirmar");
    await expect(btnConfirmar).toBeDisabled();

    // Digita senha válida
    await page.fill("#senha-confirmacao", "Abc@12");

    // Botão deve habilitar após validação da regex
    await expect(btnConfirmar).toBeEnabled();

    // Confirma ação
    await btnConfirmar.click();

    // Modal deve fechar
    await expect(modal).toBeHidden();

    // Retorno deve aparecer corretamente
    const retorno = page.locator("#retorno-confirmacao");
    await expect(retorno).toContainText(
      "Usuário confirmou a ação com senha válida!",
    );

    // Botão principal deve ficar desabilitado após uso
    await expect(btnAbrirConfirmacao).toBeDisabled();
  });

  test("Modal de Alerta - fluxo feliz deve funcionar corretamente", async ({
    page,
  }) => {
    const btnAbrirAlerta = page.locator(
      "button[onclick=\"abrirModal('alerta')\"]",
    );

    // Botão principal deve existir e estar habilitado
    await expect(btnAbrirAlerta).toBeVisible();
    await expect(btnAbrirAlerta).toBeEnabled();

    // Abre o modal
    await btnAbrirAlerta.click();

    const modal = page.locator("#modal-alerta");
    await expect(modal).toBeVisible();

    // Botão OK começa desabilitado
    const btnOk = page.locator("#btn-alerta-ok");
    await expect(btnOk).toBeDisabled();

    // Marca o checkbox
    await page.check("#checkbox-alerta");

    // Botão deve habilitar
    await expect(btnOk).toBeEnabled();

    // Confirma alerta
    await btnOk.click();

    // Modal deve fechar
    await expect(modal).toBeHidden();

    // Retorno deve aparecer corretamente
    const retorno = page.locator("#retorno-alerta");
    await expect(retorno).toContainText("Usuário confirmou que leu o alerta.");

    // Botão principal deve ficar desabilitado após uso
    await expect(btnAbrirAlerta).toBeDisabled();
  });

  test("Modal de Sucesso - fluxo feliz deve funcionar corretamente", async ({
    page,
  }) => {
    const btnAbrirSucesso = page.locator(
      "button[onclick=\"abrirModal('sucesso')\"]",
    );

    // Botão principal deve existir e estar habilitado
    await expect(btnAbrirSucesso).toBeVisible();
    await expect(btnAbrirSucesso).toBeEnabled();

    // Abre o modal
    await btnAbrirSucesso.click();

    const modal = page.locator("#modal-sucesso");
    await expect(modal).toBeVisible();

    // Preenche feedback (mesmo sabendo que será limpo pela regra atual)
    const feedback = page.locator("#feedback-sucesso");
    await feedback.fill("Teste E2E funcionando corretamente");

    // Clica no botão "Fechar"
    const btnFechar = modal.getByRole("button", { name: "Fechar" });
    await btnFechar.click();

    // Modal deve fechar
    await expect(modal).toBeHidden();

    // Retorno deve refletir o comportamento REAL atual do sistema
    const retorno = page.locator("#retorno-sucesso");
    await expect(retorno).toContainText(
      "Usuário fechou o modal de sucesso sem comentário.",
    );

    // Botão principal deve ficar desabilitado após uso
    await expect(btnAbrirSucesso).toBeDisabled();
  });

  test("Modal de Erro - deve validar campo obrigatório e funcionar no fluxo feliz", async ({
    page,
  }) => {
    const btnAbrirErro = page.locator("button[onclick=\"abrirModal('erro')\"]");

    // Botão principal visível e habilitado
    await expect(btnAbrirErro).toBeVisible();
    await expect(btnAbrirErro).toBeEnabled();

    // Abre o modal
    await btnAbrirErro.click();

    const modal = page.locator("#modal-erro");
    await expect(modal).toBeVisible();

    const textarea = page.locator("#justificativa-erro");
    const btnFechar = modal.getByRole("button", { name: "Fechar" });
    const msgErro = page.locator("#erro-msg");

    // Fluxo inválido (vazio)
    await btnFechar.click();

    // Modal continua aberto
    await expect(modal).toBeVisible();

    // Mensagem de erro aparece
    await expect(msgErro).toContainText(
      "Por favor, descreva o que estava fazendo.",
    );

    // Fluxo feliz (preenchido)
    await textarea.fill("Teste E2E do modal de erro funcionando");

    await btnFechar.click();

    // Modal fecha
    await expect(modal).toBeHidden();

    // Retorno correto
    const retorno = page.locator("#retorno-erro");
    await expect(retorno).toContainText(
      'Usuário relatou: "Teste E2E do modal de erro funcionando"',
    );

    // Botão principal deve ficar desabilitado
    await expect(btnAbrirErro).toBeDisabled();
  });

  test("Botão Limpar - deve habilitar apenas após concluir todas as modais e resetar a página", async ({
    page,
  }) => {
    const btnLimpar = page.locator("button.resetar");

    // Começa desabilitado
    await expect(btnLimpar).toBeDisabled();

    // Concluir ALERTA
    await page.click("button[onclick=\"abrirModal('alerta')\"]");
    await page.check("#checkbox-alerta");
    await page.click("#btn-alerta-ok");

    // Concluir CONFIRMAÇÃO
    await page.click("button[onclick=\"abrirModal('confirmacao')\"]");
    await page.fill("#senha-confirmacao", "Aa@123");
    await page.click("#btn-confirmar");

    // Concluir SUCESSO
    await page.click("button[onclick=\"abrirModal('sucesso')\"]");
    const modalSucesso = page.locator("#modal-sucesso");
    await modalSucesso.getByRole("button", { name: "Fechar" }).click();

    // Concluir ERRO
    await page.click("button[onclick=\"abrirModal('erro')\"]");
    await page.fill("#justificativa-erro", "Fluxo completo E2E");
    const modalErro = page.locator("#modal-erro");
    await modalErro.getByRole("button", { name: "Fechar" }).click();

    // Agora deve estar habilitado
    await expect(btnLimpar).toBeEnabled();

    // Clica em Limpar
    await btnLimpar.click();

    // Validar reset completo

    // Botão Limpar volta a ficar desabilitado
    await expect(btnLimpar).toBeDisabled();

    // Botões principais reabilitados
    await expect(
      page.locator("button[onclick=\"abrirModal('alerta')\"]"),
    ).toBeEnabled();
    await expect(
      page.locator("button[onclick=\"abrirModal('confirmacao')\"]"),
    ).toBeEnabled();
    await expect(
      page.locator("button[onclick=\"abrirModal('sucesso')\"]"),
    ).toBeEnabled();
    await expect(
      page.locator("button[onclick=\"abrirModal('erro')\"]"),
    ).toBeEnabled();

    // Retornos limpos
    await expect(page.locator("#retorno-alerta")).toBeEmpty();
    await expect(page.locator("#retorno-confirmacao")).toBeEmpty();
    await expect(page.locator("#retorno-sucesso")).toBeEmpty();
    await expect(page.locator("#retorno-erro")).toBeEmpty();
  });

  test("Botão Requisitos - deve navegar corretamente para a página de requisitos", async ({
    page,
  }) => {
    const btnRequisitos = page.locator("button.requisitos");

    // Botão deve existir e estar habilitado
    await expect(btnRequisitos).toBeVisible();
    await expect(btnRequisitos).toBeEnabled();

    // Clica no botão
    await btnRequisitos.click();

    // Valida navegação
    await expect(page).toHaveURL(/modais-requisitos\.html$/);
  });
});
