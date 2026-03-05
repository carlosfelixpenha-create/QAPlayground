const { test, expect } = require("@playwright/test");
const path = require("path");

test.describe("Formulário 3 - Novos Campos - E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/QAPlayground/frontend/pages/formulario-3.html");
    console.log("URL aberta:", page.url());
  });

  test("Deve carregar a página corretamente", async ({ page }) => {
    // Valida título da aba
    await expect(page).toHaveTitle("QAPlayground - Formulário 3");

    // Valida título principal
    await expect(page.locator("h1")).toHaveText("Novos Campos");

    // Valida uploads
    await expect(page.locator("#arquivoPdf")).toBeVisible();
    await expect(page.locator("#arquivoDocx")).toBeVisible();
    await expect(page.locator("#arquivoJpg")).toBeVisible();
    await expect(page.locator("#arquivoXlsx")).toBeVisible();
    await expect(page.locator("#arquivoTxt")).toBeVisible();

    // Valida selects
    await expect(page.locator("#pais")).toBeVisible();
    await expect(page.locator("#estado")).toBeVisible();
    await expect(page.locator("#cidade")).toBeVisible();

    // Valida botão Enviar
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("Deve enviar formulário com sucesso no fluxo feliz", async ({
    page,
  }) => {
    // Caminhos absolutos dos arquivos
    const pdfPath = path.resolve(
      __dirname,
      "../../../fixtures/Testes_QAPlayground.pdf",
    );
    const docxPath = path.resolve(
      __dirname,
      "../../../fixtures/Testes_QAPlayground.docx",
    );
    const jpgPath = path.resolve(
      __dirname,
      "../../../fixtures/Testes_QAPlayground.jpg",
    );
    const xlsxPath = path.resolve(
      __dirname,
      "../../../fixtures/Testes_QAPlayground.xlsx",
    );
    const txtPath = path.resolve(
      __dirname,
      "../../../fixtures/Testes_QAPlayground.txt",
    );

    // Upload PDF
    await page.setInputFiles("#arquivoPdf", pdfPath);
    await page.click("#modalOk");

    // Upload DOCX
    await page.setInputFiles("#arquivoDocx", docxPath);
    await page.click("#modalOk");

    // Upload JPG
    await page.setInputFiles("#arquivoJpg", jpgPath);
    await page.click("#modalOk");

    // Upload XLSX
    await page.setInputFiles("#arquivoXlsx", xlsxPath);
    await page.click("#modalOk");

    // Upload TXT
    await page.setInputFiles("#arquivoTxt", txtPath);
    await page.click("#modalOk");

    // Seleciona localização
    await page.selectOption("#pais", "brasil");
    await page.selectOption("#estado", "pr");
    await page.selectOption("#cidade", "curitiba");

    // Fecha modal da localização
    await page.click("#modalOk");

    // Envia formulário
    await page.click('button[type="submit"]');

    // Valida modal sucesso final
    await expect(page.locator("#modalMensagem")).toBeVisible();
    await expect(page.locator("#modalTexto")).toHaveText(
      "Formulário enviado com sucesso!",
    );

    // Fecha modal final
    await page.click("#modalOk");

    // Valida reset dos campos
    await expect(page.locator("#pais")).toHaveValue("");
    await expect(page.locator("#estado option")).toHaveCount(1);
    await expect(page.locator("#cidade option")).toHaveCount(1);
  });

  test("Não deve permitir envio sem anexar arquivos", async ({ page }) => {
    // Seleciona localização
    await page.selectOption("#pais", "brasil");
    await page.selectOption("#estado", "pr");
    await page.selectOption("#cidade", "curitiba");

    await page.click("#modalOk");

    // Tenta enviar sem arquivos
    await page.click('button[type="submit"]');

    // Garante que o modal de sucesso NÃO apareceu
    await expect(page.locator("#modalMensagem")).not.toBeVisible();

    // Garante que a página continua no formulário
    await expect(page.locator("h1")).toHaveText("Novos Campos");
  });

  test("Deve bloquear envio quando houver arquivo inválido", async ({
    page,
  }) => {
    const path = require("path");

    const txtPath = path.resolve(
      __dirname,
      "../../../fixtures/Testes_QAPlayground.txt",
    );

    // Seta arquivo inválido
    await page.setInputFiles("#arquivoPdf", txtPath);

    // Aguarda modal de erro abrir
    await expect(page.locator("#modalMensagemErro")).toBeVisible();

    // Fecha modal de erro
    await page.click("#modalOkErro");

    // Preenche localização
    await page.selectOption("#pais", "brasil");
    await page.selectOption("#estado", "sp");
    await page.selectOption("#cidade", "campinas");

    await page.click("#modalOk");

    // Tenta enviar formulário
    await page.click('button[type="submit"]');

    // Deve continuar bloqueando por campo inválido
    await expect(page.locator("#modalMensagemErro")).toBeVisible();
    await expect(page.locator("#modalTextoErro")).toContainText("inválidos");
  });

  test("Selecionar Brasil deve popular estados corretamente", async ({
    page,
  }) => {
    await page.selectOption("#pais", "brasil");

    const estados = page.locator("#estado option");

    await expect(estados).toHaveCount(4);

    await expect(estados.nth(1)).toHaveAttribute("value", "pr");
    await expect(estados.nth(2)).toHaveAttribute("value", "sp");
    await expect(estados.nth(3)).toHaveAttribute("value", "rj");
  });

  test("Selecionar PR deve popular cidades corretamente", async ({ page }) => {
    await page.selectOption("#pais", "brasil");
    await page.selectOption("#estado", "pr");

    const cidades = page.locator("#cidade option");

    await expect(cidades).toHaveCount(3);

    await expect(cidades.nth(1)).toHaveAttribute("value", "curitiba");
    await expect(cidades.nth(2)).toHaveAttribute("value", "matinhos");
  });

  test("Trocar país deve resetar estado e cidade", async ({ page }) => {
    await page.selectOption("#pais", "brasil");
    await page.selectOption("#estado", "pr");
    await page.selectOption("#cidade", "curitiba");

    // Troca país
    await page.selectOption("#pais", "");

    // Estado deve resetar
    await expect(page.locator("#estado")).toHaveValue("");

    // Cidade deve resetar
    await expect(page.locator("#cidade")).toHaveValue("");
  });

  test("Selecionar cidade válida deve exibir modal de sucesso", async ({
    page,
  }) => {
    await page.selectOption("#pais", "brasil");
    await page.selectOption("#estado", "pr");

    await page.selectOption("#cidade", "curitiba");

    await expect(page.locator("#modalMensagem")).toBeVisible();

    await expect(page.locator("#modalTexto")).toContainText(
      "Localização selecionada corretamente",
    );

    await page.click("#modalOk");
  });

  test("Navegação - Deve acessar página de requisitos e voltar para formulário 3", async ({
    page,
  }) => {
    // Já estamos no formulário-3 por causa do beforeEach

    // Botão Requisitos existe e está visível
    const botaoRequisitos = page.locator("button:has-text('Requisitos')");
    await expect(botaoRequisitos).toBeVisible();

    // Clicar no botão
    await botaoRequisitos.click();

    // Validar que mudou a URL
    await expect(page).toHaveURL(/formulario-3-requisitos.html/);

    // Validar título da página de requisitos
    await expect(page.locator("h1")).toHaveText("Requisitos 'Novos Campos'");

    // Clicar no botão Voltar
    const botaoVoltar = page.locator("button:has-text('Voltar')");
    await expect(botaoVoltar).toBeVisible();
    await botaoVoltar.click();

    // Validar que voltou para formulário-3
    await expect(page).toHaveURL(/formulario-3.html/);
  });
});
