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

    // TESTE SELECT LOCALIZAÇÃO
    const paisSelect = await driver.findElement(By.id("pais"));
    const estadoSelect = await driver.findElement(By.id("estado"));
    const cidadeSelect = await driver.findElement(By.id("cidade"));

    await paisSelect.sendKeys("Brasil");
    await driver.wait(until.elementTextContains(estadoSelect, "Paraná"), 3000);
    await estadoSelect.sendKeys("Paraná");
    await driver.wait(
      until.elementTextContains(cidadeSelect, "Curitiba"),
      3000,
    );
    await cidadeSelect.sendKeys("Curitiba");

    const modalLocalizacao = await driver.wait(
      until.elementLocated(By.id("modalTexto")),
      5000,
    );
    await driver.wait(until.elementIsVisible(modalLocalizacao), 5000);
    console.log("Modal localização:", await modalLocalizacao.getText());

    await driver.findElement(By.id("modalOk")).click();

    // TESTE UPLOAD DE ARQUIVOS
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

    const arquivos = [
      { id: "arquivoPdf", path: pdfPath },
      { id: "arquivoDocx", path: docxPath },
      { id: "arquivoJpg", path: jpgPath },
      { id: "arquivoXlsx", path: xlsxPath },
      { id: "arquivoTxt", path: txtPath },
    ];

    for (const { id, path: filePath } of arquivos) {
      const input = await driver.findElement(By.id(id));
      await driver.wait(until.elementIsVisible(input), 3000);
      await input.sendKeys(filePath);

      try {
        const modal = await driver.wait(
          until.elementLocated(By.id("modalTexto")),
          2000,
        );
        await driver.wait(until.elementIsVisible(modal), 2000);
        await driver.findElement(By.id("modalOk")).click();
      } catch (e) {}
    }

    // SUBMIT FORMULÁRIO VÁLIDO
    const submitBtn = await driver.findElement(By.css("button[type='submit']"));
    await driver.wait(until.elementIsVisible(submitBtn), 3000);
    await submitBtn.click();

    const modalSucesso = await driver.wait(
      until.elementLocated(By.id("modalTexto")),
      5000,
    );
    await driver.wait(until.elementIsVisible(modalSucesso), 5000);
    console.log("Modal sucesso:", await modalSucesso.getText());
    await driver.findElement(By.id("modalOk")).click();

    // TESTE SUBMIT INVÁLIDO PDF
    await submitBtn.click();
    const modalErro = await driver.wait(
      until.elementLocated(By.id("modalTextoErro")),
      5000,
    );
    await driver.wait(until.elementIsVisible(modalErro), 5000);
    console.log("Modal erro:", await modalErro.getText());
    await driver.findElement(By.id("modalOkErro")).click();

    async function testeUploadInvalido(driver) {
      const caminhoInvalido = path.resolve(
        "../../../frontend/fixtures/arquivo-invalido.pdf",
      );

      const inputPdf = await driver.findElement(By.id("arquivoPdf"));
      await inputPdf.sendKeys(caminhoInvalido);
      await driver.sleep(1000);

      const modalErro = await driver.wait(
        until.elementLocated(By.id("modalTextoErro")),
        5000,
      );
      console.log("Modal erro upload inválido:", await modalErro.getText());

      await driver.findElement(By.id("modalOkErro")).click();
      await driver.sleep(500);
    }

    // TESTE SUBMIT INVÁLIDO Uploads inválidos usando arquivos existentes
    const caminhosInvalidos = {
      arquivoPdf: path.resolve(
        __dirname,
        "../../../fixtures/Testes_QAPlayground.txt",
      ), //
      arquivoDocx: path.resolve(
        __dirname,
        "../../../fixtures/Testes_QAPlayground.txt",
      ),
      arquivoJpg: path.resolve(
        __dirname,
        "../../../fixtures/Testes_QAPlayground.txt",
      ),
      arquivoXlsx: path.resolve(
        __dirname,
        "../../../fixtures/Testes_QAPlayground.txt",
      ),
      arquivoTxt: path.resolve(
        __dirname,
        "../../../fixtures/Testes_QAPlayground.pdf",
      ),
    };

    for (const [inputId, caminho] of Object.entries(caminhosInvalidos)) {
      const input = await driver.findElement(By.id(inputId));
      await input.sendKeys(caminho);
      await driver.sleep(500);

      const modalErro = await driver.wait(
        until.elementLocated(By.id("modalTextoErro")),
        5000,
      );
      await driver.wait(until.elementIsVisible(modalErro), 5000);
      console.log(
        `Modal erro upload inválido (${inputId}):`,
        await modalErro.getText(),
      );

      await driver.findElement(By.id("modalOkErro")).click();
      await driver.sleep(500);
    }

    // TESTE BOTÃO REQUISITOS
    const btnRequisitos = await driver.findElement(By.css(".requisitos"));
    await btnRequisitos.click();
    await driver.wait(until.urlContains("formulario-3-requisitos"), 5000);
    console.log("Página de requisitos aberta:", await driver.getCurrentUrl());

    await driver.navigate().back();
    console.log("Retornou para formulário:", await driver.getCurrentUrl());
  } catch (erro) {
    console.error("Erro no teste:", erro);
  } finally {
    await driver.quit();
  }
})();
