const { Builder, By, until } = require("selenium-webdriver");

async function formulario2Completo() {
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.manage().window().maximize();

    await driver.get(
      "https://carlosfelixpenha-create.github.io/QAPlayground/frontend/pages/formulario-2.html",
    );

    console.log("Página formulário 2 aberta");

    /*
    =========================
    FLUXO FELIZ
    =========================
    */

    await driver.findElement(By.id("masculino")).click();
    await driver.findElement(By.id("frontend")).click();
    await driver.findElement(By.id("qa")).click();

    await driver.findElement(By.id("dataNascimento")).sendKeys("1990-10-10");
    await driver.findElement(By.id("telefone")).sendKeys("41999999999");
    await driver.findElement(By.id("cpf")).sendKeys("12345678910");

    await driver.findElement(By.css("button[type='submit']")).click();

    let modal = await driver.wait(
      until.elementLocated(By.id("modalMensagem")),
      5000,
    );

    let textoModal = await modal.findElement(By.id("modalTexto")).getText();
    console.log("Texto modal sucesso:", textoModal);

    await driver.findElement(By.id("modalOk")).click();

    /*
    =========================
    ERRO - SEXO NÃO SELECIONADO
    =========================
    */

    await driver.findElement(By.id("frontend")).click();

    await driver.findElement(By.id("dataNascimento")).sendKeys("1990-10-10");
    await driver.findElement(By.id("telefone")).sendKeys("41999999999");
    await driver.findElement(By.id("cpf")).sendKeys("12345678910");

    await driver.findElement(By.css("button[type='submit']")).click();

    let modalErro = await driver.wait(
      until.elementLocated(By.id("modalMensagemErro")),
      5000,
    );

    let textoErro = await modalErro
      .findElement(By.id("modalTextoErro"))
      .getText();

    console.log("Erro sexo vazio:", textoErro);

    await driver.findElement(By.id("modalOkErro")).click();

    /*
    =========================
    ERRO - INTERESSE VAZIO
    =========================
    */
    await driver.findElement(By.id("frontend")).click();
    await driver.findElement(By.id("masculino")).click();

    await driver.findElement(By.id("dataNascimento")).clear();
    await driver.findElement(By.id("telefone")).clear();
    await driver.findElement(By.id("cpf")).clear();

    await driver.findElement(By.id("dataNascimento")).sendKeys("1990-10-10");
    await driver.findElement(By.id("telefone")).sendKeys("41999999999");
    await driver.findElement(By.id("cpf")).sendKeys("12345678910");

    await driver.findElement(By.css("button[type='submit']")).click();

    modalErro = await driver.wait(
      until.elementLocated(By.id("modalMensagemErro")),
      5000,
    );

    textoErro = await modalErro.findElement(By.id("modalTextoErro")).getText();

    console.log("Erro interesse vazio:", textoErro);

    await driver.findElement(By.id("modalOkErro")).click();

    /*
    =========================
    ERRO TELEFONE INVÁLIDO
    =========================
    */

    await driver.findElement(By.id("frontend")).click();

    await driver.findElement(By.id("telefone")).clear();
    await driver.findElement(By.id("telefone")).sendKeys("abc");

    await driver.findElement(By.css("button[type='submit']")).click();

    modalErro = await driver.wait(
      until.elementLocated(By.id("modalMensagemErro")),
      5000,
    );

    textoErro = await modalErro.findElement(By.id("modalTextoErro")).getText();

    console.log("Erro telefone inválido:", textoErro);

    await driver.findElement(By.id("modalOkErro")).click();

    /*
    =========================
    ERRO CPF INVÁLIDO
    =========================
    */

    await driver.findElement(By.id("telefone")).clear();
    await driver.findElement(By.id("telefone")).sendKeys("41999999999");

    await driver.findElement(By.id("cpf")).clear();
    await driver.findElement(By.id("cpf")).sendKeys("abc");

    await driver.findElement(By.css("button[type='submit']")).click();

    modalErro = await driver.wait(
      until.elementLocated(By.id("modalMensagemErro")),
      5000,
    );

    textoErro = await modalErro.findElement(By.id("modalTextoErro")).getText();

    console.log("Erro CPF inválido:", textoErro);

    await driver.findElement(By.id("modalOkErro")).click();

    /*
    =========================
    DATA FUTURA
    =========================
    */

    await driver.findElement(By.id("cpf")).clear();
    await driver.findElement(By.id("cpf")).sendKeys("12345678910");

    await driver.findElement(By.id("dataNascimento")).clear();
    await driver.findElement(By.id("dataNascimento")).sendKeys("2999-01-01");

    await driver.findElement(By.css("button[type='submit']")).click();

    modalErro = await driver.wait(
      until.elementLocated(By.id("modalMensagemErro")),
      5000,
    );

    textoErro = await modalErro.findElement(By.id("modalTextoErro")).getText();

    console.log("Erro data futura:", textoErro);

    await driver.findElement(By.id("modalOkErro")).click();

    /*
    =========================
    IDADE MENOR QUE 16
    =========================
    */

    await driver.findElement(By.id("dataNascimento")).clear();
    await driver.findElement(By.id("dataNascimento")).sendKeys("2015-01-01");

    await driver.findElement(By.css("button[type='submit']")).click();

    modalErro = await driver.wait(
      until.elementLocated(By.id("modalMensagemErro")),
      5000,
    );

    textoErro = await modalErro.findElement(By.id("modalTextoErro")).getText();

    console.log("Idade mínima permitida é de 16 anos!", textoErro);
  } finally {
    await driver.quit();
  }
}

formulario2Completo();
