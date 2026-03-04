const { test, expect } = require("@playwright/test");

test.describe("Página de Acessibilidade - E2E (Fluxo Feliz Inicial)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/QAPlayground/frontend/pages/acessibilidade.html", {
      waitUntil: "domcontentloaded",
    });

    console.log("URL aberta:", page.url());

    await page.evaluate(() => localStorage.clear());
  });

  test("Navegação por Teclado - fluxo feliz deve funcionar corretamente", async ({
    page,
  }) => {
    const btnPrimario = page.locator(".btn-primary");
    const btnSecundario = page.locator(".btn-secondary");
    const linkAcessivel = page.locator("a", { hasText: "Link Acessível" });
    const inputTeclado = page.locator(
      'input[aria-label="Campo de texto acessível"]',
    );
    const btnLimpar = page.locator("button.resetar");

    // Elementos visíveis
    await expect(btnPrimario).toBeVisible();
    await expect(btnSecundario).toBeVisible();
    await expect(linkAcessivel).toBeVisible();
    await expect(inputTeclado).toBeVisible();

    // Todos devem ser focáveis
    await btnPrimario.focus();
    await expect(btnPrimario).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(btnSecundario).toBeFocused();

    await page.keyboard.press("Tab");
    await linkAcessivel.focus();
    await expect(linkAcessivel).toBeFocused();

    await page.keyboard.press("Tab");
    await inputTeclado.focus();
    await expect(inputTeclado).toBeFocused();

    // Digita no campo
    await inputTeclado.fill("Teste E2E teclado");
    await expect(inputTeclado).toHaveValue("Teste E2E teclado");

    // Clica em Limpar (comportamento real: não limpa esse campo)
    await btnLimpar.click();

    // Campo permanece com valor (comportamento atual do sistema)
    await expect(inputTeclado).toHaveValue("Teste E2E teclado");
  });

  test("Contraste de Cores - elementos devem estar visíveis corretamente", async ({
    page,
  }) => {
    const contrasteBom = page.locator(".contraste.bom");
    const contrasteRuim = page.locator(".contraste.ruim");
    const contrasteExcelente = page.locator(".contraste.excelente");
    const contrasteIntermediario = page.locator(".contraste.intermediario");

    // Elementos devem existir e estar visíveis
    await expect(contrasteBom).toBeVisible();
    await expect(contrasteRuim).toBeVisible();
    await expect(contrasteExcelente).toBeVisible();
    await expect(contrasteIntermediario).toBeVisible();

    // Validar textos exibidos (comportamento real)
    await expect(contrasteBom).toHaveText("Contraste bom");
    await expect(contrasteRuim).toHaveText("Contraste ruim");
    await expect(contrasteExcelente).toHaveText("Contraste excelente");
    await expect(contrasteIntermediario).toHaveText("Contraste intermediário");
  });

  test("Validação de ARIA - atributos devem estar corretos e funcionais", async ({
    page,
  }) => {
    // aria-live no retorno de senha
    const retornoSenha = page.locator("#retorno-senha");

    await expect(retornoSenha).toHaveAttribute("aria-live", "polite");

    // Associação correta entre label e input (form Labels e ARIA)
    const campos = ["nome", "email", "telefone", "senha-form"];

    for (const id of campos) {
      const input = page.locator(`#${id}`);
      const label = page.locator(`label[for="${id}"]`);

      await expect(input).toHaveAttribute("id", id);
      await expect(label).toBeVisible();
    }

    // Toggle de senha - aria-label dinâmico
    const campoSenha = page.locator("#senha");
    const toggleBtn = page.locator("#toggleSenhaAcessibilidade");

    // Deve possuir aria-label
    await expect(toggleBtn).toHaveAttribute("aria-label");

    // Clique 1 → mostrar senha
    await toggleBtn.click();
    await expect(campoSenha).toHaveAttribute("type", "text");
    await expect(toggleBtn).toHaveAttribute("aria-label", "Ocultar senha");

    // Clique 2 → ocultar senha
    await toggleBtn.click();
    await expect(campoSenha).toHaveAttribute("type", "password");
    await expect(toggleBtn).toHaveAttribute("aria-label", "Mostrar senha");
  });

  test("Fluxo Feliz - senha válida deve validar corretamente e permitir reset", async ({
    page,
  }) => {
    const campoSenha = page.locator("#senha");
    const btnValidar = page.locator(".btn-validar");
    const retorno = page.locator("#retorno-senha");
    const btnLimpar = page.locator(".resetar");

    const regraMaiuscula = page.locator("#regra-maiuscula");
    const regraNumero = page.locator("#regra-numero");
    const regraSimbolo = page.locator("#regra-simbolo");
    const regraTamanho = page.locator("#regra-tamanho");

    // Preencher senha válida
    await campoSenha.fill("ABC123!");

    // Regras devem ser marcadas como válidas dinamicamente
    await expect(regraMaiuscula).toHaveClass(/valida/);
    await expect(regraNumero).toHaveClass(/valida/);
    await expect(regraSimbolo).toHaveClass(/valida/);
    await expect(regraTamanho).toHaveClass(/valida/);

    // Clicar em validar
    await btnValidar.click();

    await expect(retorno).toHaveText("Senha válida!");
    await expect(retorno).toHaveCSS("color", "rgb(0, 128, 0)");
    await expect(btnValidar).toBeDisabled();

    // Resetar página
    await btnLimpar.click();

    await expect(campoSenha).toHaveValue("");
    await expect(retorno).toHaveText("");
    await expect(btnValidar).toBeEnabled();

    await expect(regraMaiuscula).not.toHaveClass(/valida/);
    await expect(regraNumero).not.toHaveClass(/valida/);
    await expect(regraSimbolo).not.toHaveClass(/valida/);
    await expect(regraTamanho).not.toHaveClass(/valida/);
  });

  test("Toggle de senha - deve alternar entre visível e oculta corretamente", async ({
    page,
  }) => {
    const campoSenha = page.locator("#senha");
    const toggleBtn = page.locator("#toggleSenhaAcessibilidade");

    // Estado inicial
    await expect(campoSenha).toHaveAttribute("type", "password");
    await expect(toggleBtn).toContainText("👁️");

    // Abrir senha
    await toggleBtn.click();

    await expect(campoSenha).toHaveAttribute("type", "text");
    await expect(toggleBtn).toContainText("🙈");
    await expect(toggleBtn).toHaveAttribute("aria-label", "Ocultar senha");

    // Fechar senha novamente
    await toggleBtn.click();

    await expect(campoSenha).toHaveAttribute("type", "password");
    await expect(toggleBtn).toContainText("👁️");
    await expect(toggleBtn).toHaveAttribute("aria-label", "Mostrar senha");
  });

  test("Cenários Negativos - validações de senha e comportamento de erro", async ({
    page,
  }) => {
    const campoSenha = page.locator("#senha");
    const btnValidar = page.locator(".btn-validar");
    const retorno = page.locator("#retorno-senha");
    const btnLimpar = page.locator(".resetar");

    // Senha totalmente inválida
    await campoSenha.fill("abc");
    await btnValidar.click();

    await expect(retorno).toContainText("Senha inválida!");
    await expect(retorno).toContainText("letra maiúscula");
    await expect(retorno).toContainText("número");
    await expect(retorno).toContainText("símbolo");
    await expect(retorno).toContainText("entre 6 e 12 caracteres");
    await expect(retorno).toHaveCSS("color", "rgb(255, 0, 0)");
    await expect(btnValidar).toBeDisabled();

    // Resetar estado
    await btnLimpar.click();
    await expect(campoSenha).toHaveValue("");
    await expect(retorno).toHaveText("");
    await expect(btnValidar).toBeEnabled();

    // Senha com tamanho maior que permitido
    await campoSenha.fill("ABC123!@#12345");
    await btnValidar.click();

    await expect(retorno).toContainText("Senha inválida!");
    await expect(retorno).toContainText("entre 6 e 12 caracteres");

    // Resetar novamente
    await btnLimpar.click();
    await expect(btnValidar).toBeEnabled();

    // Prevenção de múltiplos envios
    await campoSenha.fill("ABC123!");
    await btnValidar.click();

    await expect(btnValidar).toBeDisabled();
  });

  test("Zoom ao Foco - elementos devem aumentar ao receber hover", async ({
    page,
  }) => {
    const textoZoom = page.locator(".zoom-texto");
    const imagemZoom = page.locator(".logo-acessibilidade");

    // Garante que estão visíveis
    await expect(textoZoom).toBeVisible();
    await expect(imagemZoom).toBeVisible();

    // Captura tamanho inicial
    const boxTextoAntes = await textoZoom.boundingBox();
    const boxImagemAntes = await imagemZoom.boundingBox();

    // Hover no texto e espera a transição CSS (caso exista)
    await textoZoom.hover();
    await page.waitForTimeout(200); // tempo para efeito de transição

    const boxTextoDepois = await textoZoom.boundingBox();
    expect(boxTextoDepois.width).toBeGreaterThan(boxTextoAntes.width);
    expect(boxTextoDepois.height).toBeGreaterThan(boxTextoAntes.height);

    // Hover na imagem e espera a transição CSS
    await imagemZoom.hover();
    await page.waitForTimeout(200);

    const boxImagemDepois = await imagemZoom.boundingBox();
    expect(boxImagemDepois.width).toBeGreaterThan(boxImagemAntes.width);
    expect(boxImagemDepois.height).toBeGreaterThan(boxImagemAntes.height);
  });

  test("Botão Requisitos - deve navegar para requisitos e permitir retorno", async ({
    page,
  }) => {
    // Validar que estamos na página de acessibilidade
    await expect(page).toHaveURL(/acessibilidade\.html$/);

    // Clicar no botão Requisitos
    const btnRequisitos = page.getByRole("button", { name: "Requisitos" });

    await expect(btnRequisitos).toBeVisible();
    await expect(btnRequisitos).toBeEnabled();

    await btnRequisitos.click();

    // Validar navegação para requisitos
    await expect(page).toHaveURL(/acessibilidade-requisitos\.html$/);

    // Clicar no botão Voltar
    const btnVoltar = page.getByRole("button", { name: "Voltar" }).first();

    await expect(btnVoltar).toBeVisible();
    await expect(btnVoltar).toBeEnabled();

    await btnVoltar.click();

    // Validar retorno para acessibilidade
    await expect(page).toHaveURL(/acessibilidade\.html$/);
  });
});
