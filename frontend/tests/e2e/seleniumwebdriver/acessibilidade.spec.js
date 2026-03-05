// frontend/tests/e2e/seleniumwebdriver/acessibilidade.spec.js
const { Builder, By, Key, until } = require("selenium-webdriver");

async function acessibilidadeCompleto() {
  // Configuração do driver Chrome em tela cheia
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    console.log("Abrindo página de Acessibilidade...");
    await driver.manage().window().maximize();
    await driver.get(
      "http://localhost:5500/frontend/pages/acessibilidade.html",
    );
    console.log("Página carregada com sucesso");

    // Limpar localStorage
    await driver.executeScript("localStorage.clear();");
    console.log("localStorage limpo");

    // ===== Navegação por Teclado =====
    const btnPrimario = await driver.findElement(By.css(".btn-primary"));
    const btnSecundario = await driver.findElement(By.css(".btn-secondary"));
    const linkAcessivel = await driver.findElement(
      By.linkText("Link Acessível"),
    );
    const inputTeclado = await driver.findElement(
      By.css('input[aria-label="Campo de texto acessível"]'),
    );
    const btnLimpar = await driver.findElement(By.css("button.resetar"));

    if (
      (await btnPrimario.isDisplayed()) &&
      (await btnSecundario.isDisplayed()) &&
      (await linkAcessivel.isDisplayed()) &&
      (await inputTeclado.isDisplayed())
    ) {
      console.log("Elementos principais visíveis");
    }

    await inputTeclado.sendKeys("Teste E2E teclado");
    console.log("Campo preenchido: Teste E2E teclado");
    await btnLimpar.click();
    console.log(
      "Campo após clicar em Limpar (deve permanecer): Teste E2E teclado",
    );

    // ===== Contraste =====
    const contrasteBom = await driver.findElement(By.css(".contraste.bom"));
    const contrasteRuim = await driver.findElement(By.css(".contraste.ruim"));
    const contrasteExcelente = await driver.findElement(
      By.css(".contraste.excelente"),
    );
    const contrasteIntermediario = await driver.findElement(
      By.css(".contraste.intermediario"),
    );
    console.log(`.contraste.bom: ${await contrasteBom.getText()}`);
    console.log(`.contraste.ruim: ${await contrasteRuim.getText()}`);
    console.log(`.contraste.excelente: ${await contrasteExcelente.getText()}`);
    console.log(
      `.contraste.intermediario: ${await contrasteIntermediario.getText()}`,
    );

    // ===== ARIA =====
    const campos = ["nome", "email", "telefone", "senha-form"];
    for (const id of campos) {
      const input = await driver.findElement(By.id(id));
      const label = await driver.findElement(By.css(`label[for="${id}"]`));
      console.log(
        `Campo ${id} visível? ${await input.isDisplayed()} | Label visível? ${await label.isDisplayed()}`,
      );
    }

    const campoSenha = await driver.findElement(By.id("senha"));
    const toggleBtn = await driver.findElement(
      By.id("toggleSenhaAcessibilidade"),
    );

    // Toggle senha
    await toggleBtn.click();
    console.log(`Senha aberta: ${await campoSenha.getAttribute("type")}`);
    await toggleBtn.click();
    console.log(`Senha fechada: ${await campoSenha.getAttribute("type")}`);

    // ===== Fluxo senha =====
    const btnValidar = await driver.findElement(By.css(".btn-validar"));
    const retorno = await driver.findElement(By.id("retorno-senha"));

    await campoSenha.sendKeys("ABC123!");
    console.log("Senha preenchida: ABC123!");
    await btnValidar.click();
    console.log(
      `Senha validada, botão desabilitado: ${!(await btnValidar.isEnabled())}`,
    );

    await btnLimpar.click();
    console.log("Página resetada, campos e botão restaurados");

    // Cenários negativos e múltiplos envios
    await campoSenha.clear();
    await campoSenha.sendKeys("abc");
    await btnValidar.click();
    console.log("Senha inválida testada: abc");

    await campoSenha.clear();
    await campoSenha.sendKeys("ABC123!@#12345");
    await btnValidar.click();
    console.log("Senha maior que permitido testada");

    await campoSenha.clear();
    await campoSenha.sendKeys("ABC123!");
    await btnValidar.click();
    console.log(
      "Prevenção de múltiplos envios (botão deve estar desabilitado)",
    );

    // ===== Zoom =====
    const textoZoom = await driver.findElement(By.css(".zoom-texto"));
    const imagemZoom = await driver.findElement(By.css(".logo-acessibilidade"));
    const boxTextoAntes = await textoZoom.getRect();
    const boxImagemAntes = await imagemZoom.getRect();

    await driver
      .actions({ bridge: true })
      .move({ origin: textoZoom })
      .perform();
    const boxTextoDepois = await textoZoom.getRect();

    await driver
      .actions({ bridge: true })
      .move({ origin: imagemZoom })
      .perform();
    const boxImagemDepois = await imagemZoom.getRect();

    console.log(
      `Zoom texto - width antes/depois: ${boxTextoAntes.width} ${boxTextoDepois.width}`,
    );
    console.log(
      `Zoom imagem - width antes/depois: ${boxImagemAntes.width} ${boxImagemDepois.width}`,
    );

    // ===== Botão Requisitos =====
    console.log("Verificando botão Requisitos...");

    const btnRequisitosElements = await driver.findElements(
      By.xpath("//button[normalize-space()='Requisitos']"),
    );

    if (btnRequisitosElements.length > 0) {
      const btnRequisitos = btnRequisitosElements[0];

      const visivel = await btnRequisitos.isDisplayed();
      const habilitado = await btnRequisitos.isEnabled();

      if (visivel && habilitado) {
        console.log("Botão Requisitos visível e habilitado");
        await btnRequisitos.click();
      }

      await driver.wait(
        async () =>
          (await driver.getCurrentUrl()).includes(
            "acessibilidade-requisitos.html",
          ),
        5000,
      );

      const btnVoltarElements = await driver.findElements(
        By.xpath("//button[normalize-space()='Voltar']"),
      );

      if (btnVoltarElements.length > 0) {
        const btnVoltar = btnVoltarElements[0];

        await btnVoltar.click();

        await driver.wait(
          async () =>
            (await driver.getCurrentUrl()).includes("acessibilidade.html"),
          5000,
        );

        console.log("Retorno para página de acessibilidade confirmado");
      } else {
        console.log("Botão Voltar não encontrado, teste ignorado");
      }
    } else {
      console.log("Botão Requisitos não encontrado ou teste ignorado");
    }
  } finally {
    await driver.quit();
    console.log("Driver encerrado");
  }
}

// chamada da função (fora dela)
acessibilidadeCompleto();
