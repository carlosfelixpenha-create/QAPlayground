const { Builder, By, until } = require("selenium-webdriver");

(async function formularioEnderecoTestes() {
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.manage().window().maximize();

    await driver.get(
      "https://carlosfelixpenha-create.github.io/QAPlayground/frontend/pages/formulario-1.html",
    );

    console.log("Página formulário de endereço aberta");

    await driver.executeScript("localStorage.clear();");

    // ---------- TESTE 1: FLUXO FELIZ ----------
    await driver.findElement(By.id("logradouro")).sendKeys("Rua das Flores");
    await driver.findElement(By.id("numero")).sendKeys("123");
    await driver.findElement(By.id("complemento")).sendKeys("Apto 1");
    await driver.findElement(By.id("bairro")).sendKeys("Centro");
    await driver.findElement(By.id("cidade")).sendKeys("Curitiba");
    await driver.findElement(By.id("estado")).sendKeys("PR");
    await driver.findElement(By.id("cep")).sendKeys("80000000");

    await driver.findElement(By.id("btnSalvar")).click();

    await driver.wait(until.elementLocated(By.id("modalMensagem")), 5000);

    let modalTexto = await driver.findElement(By.id("modalTexto")).getText();
    console.log("Texto modal:", modalTexto);

    let enderecoSalvo = await driver.executeScript(
      "return localStorage.getItem('endereco');",
    );
    console.log("Endereço salvo no localStorage:", enderecoSalvo);

    await driver.findElement(By.id("modalOk")).click();

    // valida campos desabilitados
    let logradouroDisabled = await driver
      .findElement(By.id("logradouro"))
      .getAttribute("disabled");
    console.log("Logradouro desabilitado?", logradouroDisabled !== null);

    // valida botões QA
    let btnVerEndereco = await driver
      .findElement(By.id("btnVerEndereco"))
      .isDisplayed();
    let btnLimparEndereco = await driver
      .findElement(By.id("btnLimparEndereco"))
      .isDisplayed();

    console.log("btnVerEndereco visível?", btnVerEndereco);
    console.log("btnLimparEndereco visível?", btnLimparEndereco);

    // ---------- TESTE 2: VER ENDEREÇO SALVO ----------
    await driver.findElement(By.id("btnVerEndereco")).click();

    await driver.wait(until.elementLocated(By.id("modalMensagem")), 5000);

    let enderecoModal = await driver.findElement(By.id("modalTexto")).getText();
    console.log("Modal endereço salvo:", enderecoModal);

    await driver.findElement(By.id("modalOk")).click();

    // ---------- TESTE 3: LIMPAR ENDEREÇO ----------
    await driver.findElement(By.id("btnLimparEndereco")).click();

    await driver.wait(until.elementLocated(By.id("modalMensagem")), 5000);

    let textoLimpeza = await driver.findElement(By.id("modalTexto")).getText();
    console.log("Modal limpeza:", textoLimpeza);

    await driver.findElement(By.id("modalOk")).click();

    let enderecoAposLimpeza = await driver.executeScript(
      "return localStorage.getItem('endereco');",
    );
    console.log("Endereço após limpeza:", enderecoAposLimpeza);

    let logradouroEnabled = await driver
      .findElement(By.id("logradouro"))
      .getAttribute("disabled");
    console.log("Logradouro habilitado novamente?", logradouroEnabled === null);

    // ---------- TESTE 4: LOGRADOURO INVÁLIDO ----------
    await driver.findElement(By.id("logradouro")).sendKeys("12345");
    await driver.findElement(By.id("numero")).sendKeys("10");
    await driver.findElement(By.id("bairro")).sendKeys("Centro");
    await driver.findElement(By.id("cidade")).sendKeys("Curitiba");
    await driver.findElement(By.id("estado")).sendKeys("PR");
    await driver.findElement(By.id("cep")).sendKeys("80000000");

    await driver.findElement(By.id("btnSalvar")).click();

    await driver.wait(until.elementLocated(By.id("modalMensagemErro")), 5000);

    let erroLogradouro = await driver
      .findElement(By.id("modalTextoErro"))
      .getText();
    console.log("Erro logradouro inválido:", erroLogradouro);

    await driver.findElement(By.id("modalOkErro")).click();

    await driver.navigate().refresh();

    // ---------- TESTE 5: NÚMERO INVÁLIDO ----------
    await driver.findElement(By.id("logradouro")).sendKeys("Rua Teste");
    await driver.findElement(By.id("numero")).sendKeys("ABC");
    await driver.findElement(By.id("bairro")).sendKeys("Centro");
    await driver.findElement(By.id("cidade")).sendKeys("Curitiba");
    await driver.findElement(By.id("estado")).sendKeys("PR");
    await driver.findElement(By.id("cep")).sendKeys("80000000");

    await driver.findElement(By.id("btnSalvar")).click();

    await driver.wait(until.elementLocated(By.id("modalMensagemErro")), 5000);

    let erroNumero = await driver
      .findElement(By.id("modalTextoErro"))
      .getText();
    console.log("Erro número inválido:", erroNumero);

    await driver.findElement(By.id("modalOkErro")).click();

    await driver.navigate().refresh();

    // ---------- TESTE 6: UF INVÁLIDA ----------
    await driver.findElement(By.id("logradouro")).sendKeys("Rua Teste");
    await driver.findElement(By.id("numero")).sendKeys("10");
    await driver.findElement(By.id("bairro")).sendKeys("Centro");
    await driver.findElement(By.id("cidade")).sendKeys("Curitiba");
    await driver.findElement(By.id("estado")).sendKeys("XX");
    await driver.findElement(By.id("cep")).sendKeys("80000000");

    await driver.findElement(By.id("btnSalvar")).click();

    await driver.wait(until.elementLocated(By.id("modalMensagemErro")), 5000);

    let erroUf = await driver.findElement(By.id("modalTextoErro")).getText();
    console.log("Erro UF inválida:", erroUf);

    await driver.findElement(By.id("modalOkErro")).click();

    await driver.navigate().refresh();

    // ---------- TESTE 7: CEP INVÁLIDO ----------
    await driver.findElement(By.id("logradouro")).sendKeys("Rua Teste");
    await driver.findElement(By.id("numero")).sendKeys("10");
    await driver.findElement(By.id("bairro")).sendKeys("Centro");
    await driver.findElement(By.id("cidade")).sendKeys("Curitiba");
    await driver.findElement(By.id("estado")).sendKeys("PR");
    await driver.findElement(By.id("cep")).sendKeys("123");

    await driver.findElement(By.id("btnSalvar")).click();

    await driver.wait(until.elementLocated(By.id("modalMensagemErro")), 5000);

    let erroCep = await driver.findElement(By.id("modalTextoErro")).getText();
    console.log("Erro CEP inválido:", erroCep);

    await driver.findElement(By.id("modalOkErro")).click();

    await driver.navigate().refresh();

    // ---------- TESTE 8: REQUISITOS ----------
    await driver.findElement(By.className("requisitos")).click();

    await driver.wait(until.urlContains("formulario-1-requisitos.html"), 5000);

    console.log("Página de requisitos aberta:", await driver.getCurrentUrl());

    await driver.findElement(By.tagName("button")).click();

    await driver.wait(until.urlContains("formulario-1.html"), 5000);

    console.log("Retornou para formulário:", await driver.getCurrentUrl());
  } finally {
    await driver.quit();
  }
})();
