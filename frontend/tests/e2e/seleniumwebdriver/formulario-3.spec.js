const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const path = require("path");

(async function testeFormulario3() {
  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(new chrome.Options())
    .build();

  try {
    await driver.manage().window().maximize();
    await driver.get(
      "https://carlosfelixpenha-create.github.io/QAPlayground/frontend/pages/formulario-3.html",
    );

    console.log("Página formulário 3 aberta");

    // ----------- TESTE SELECT LOCALIZAÇÃO -----------

    await driver.findElement(By.id("pais")).sendKeys("Brasil");
    await driver.sleep(1000);

    await driver.findElement(By.id("estado")).sendKeys("Paraná");
    await driver.sleep(1000);

    await driver.findElement(By.id("cidade")).sendKeys("Curitiba");
    await driver.sleep(1000);

    const modalLocalizacao = await driver.wait(
      until.elementLocated(By.id("modalTexto")),
      5000,
    );

    console.log("Modal localização:", await modalLocalizacao.getText());

    await driver.findElement(By.id("modalOk")).click();
    await driver.sleep(1000);

    // ----------- TESTE UPLOAD DE ARQUIVOS -----------

    const pdfPath = path.resolve("./frontend/tests/arquivos/teste.pdf");
    const docxPath = path.resolve("./frontend/tests/arquivos/teste.docx");
    const jpgPath = path.resolve("./frontend/tests/arquivos/teste.jpg");
    const xlsxPath = path.resolve("./frontend/tests/arquivos/teste.xlsx");
    const txtPath = path.resolve("./frontend/tests/arquivos/teste.txt");

    await driver.findElement(By.id("arquivoPdf")).sendKeys(pdfPath);
    await driver.sleep(1000);

    await driver.findElement(By.id("arquivoDocx")).sendKeys(docxPath);
    await driver.sleep(1000);

    await driver.findElement(By.id("arquivoJpg")).sendKeys(jpgPath);
    await driver.sleep(1000);

    await driver.findElement(By.id("arquivoXlsx")).sendKeys(xlsxPath);
    await driver.sleep(1000);

    await driver.findElement(By.id("arquivoTxt")).sendKeys(txtPath);
    await driver.sleep(1000);

    // Fechar modais de upload
    try {
      await driver.findElement(By.id("modalOk")).click();
    } catch {}

    await driver.sleep(1000);

    // ----------- SUBMIT FORMULÁRIO -----------

    await driver.findElement(By.css("button[type='submit']")).click();

    const modalSucesso = await driver.wait(
      until.elementLocated(By.id("modalTexto")),
      5000,
    );

    console.log("Modal sucesso:", await modalSucesso.getText());

    await driver.findElement(By.id("modalOk")).click();

    // ----------- TESTE ENVIO INVÁLIDO -----------

    await driver.findElement(By.css("button[type='submit']")).click();

    const modalErro = await driver.wait(
      until.elementLocated(By.id("modalTextoErro")),
      5000,
    );

    console.log("Modal erro:", await modalErro.getText());

    await driver.findElement(By.id("modalOkErro")).click();

    // ----------- TESTE BOTÃO REQUISITOS -----------

    await driver.findElement(By.css(".requisitos")).click();

    await driver.wait(until.urlContains("formulario-3-requisitos"), 5000);

    console.log("Página de requisitos aberta:", await driver.getCurrentUrl());

    await driver.navigate().back();

    console.log("Retornou para formulário:", await driver.getCurrentUrl());
  } catch (erro) {
    console.error("Erro no teste:", erro);
  } finally {
    await driver.sleep(2000);
    await driver.quit();
  }
})();
