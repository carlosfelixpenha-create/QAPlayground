const { Builder, By, until } = require("selenium-webdriver");

async function cadastroCompleto() {
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.manage().window().maximize();

    await driver.get(
      "https://carlosfelixpenha-create.github.io/QAPlayground/frontend/pages/cadastro.html",
    );

    console.log("Página Cadastro aberta:", await driver.getCurrentUrl());

    await driver.executeScript("localStorage.clear();");
    await driver.navigate().refresh();

    // -----------------------------
    // FLUXO FELIZ
    // -----------------------------

    await driver.findElement(By.id("nome")).sendKeys("Joao Silva");
    await driver.findElement(By.id("email")).sendKeys("joao@teste.com");
    await driver.findElement(By.id("senha")).sendKeys("Abc123!");
    await driver.findElement(By.id("confirmarSenha")).sendKeys("Abc123!");
    await driver.findElement(By.id("btnCadastrar")).click();

    const modal = await driver.findElement(By.id("modalMensagem"));
    await driver.wait(until.elementIsVisible(modal), 5000);

    await driver.findElement(By.id("modalOk")).click();

    await driver.wait(until.elementIsNotVisible(modal), 5000);

    console.log("Cadastro realizado com sucesso!");

    const usuarioSalvo = await driver.executeScript(
      "return JSON.parse(localStorage.getItem('qaplayground_usuario'))",
    );

    console.log("Usuário salvo no LocalStorage:", usuarioSalvo);

    // -----------------------------
    // VALIDA BOTÕES QA
    // -----------------------------

    const btns = ["btnVerUsuario", "btnLimparCadastro"];

    for (let btn of btns) {
      const el = await driver.findElement(By.id(btn));
      console.log(btn, "visível?", await el.isDisplayed());
    }

    // -----------------------------
    // TESTE BOTÃO VER USUÁRIO
    // -----------------------------

    await driver.findElement(By.id("btnVerUsuario")).click();

    const modalUsuario = await driver.findElement(By.id("modalMensagem"));
    await driver.wait(until.elementIsVisible(modalUsuario), 5000);

    const textoUsuario = await driver
      .findElement(By.id("modalTexto"))
      .getText();

    console.log("Texto modal usuário:", textoUsuario);

    await driver.findElement(By.id("modalOk")).click();

    await driver.wait(until.elementIsNotVisible(modalUsuario), 5000);

    // -----------------------------
    // TESTE BOTÃO LIMPAR CADASTRO
    // -----------------------------

    await driver.findElement(By.id("btnLimparCadastro")).click();

    const modalLimpeza = await driver.findElement(By.id("modalMensagem"));
    await driver.wait(until.elementIsVisible(modalLimpeza), 5000);

    await driver.findElement(By.id("modalOk")).click();

    await driver.wait(until.elementIsNotVisible(modalLimpeza), 5000);

    const usuarioRemovido = await driver.executeScript(
      "return localStorage.getItem('qaplayground_usuario')",
    );

    console.log("Usuário após limpeza:", usuarioRemovido);

    // -----------------------------
    // TESTE NOME INVÁLIDO
    // -----------------------------

    await driver.findElement(By.id("nome")).sendKeys("Joao");
    await driver.findElement(By.id("email")).sendKeys("teste@teste.com");
    await driver.findElement(By.id("senha")).sendKeys("Abc123!");
    await driver.findElement(By.id("confirmarSenha")).sendKeys("Abc123!");
    await driver.findElement(By.id("btnCadastrar")).click();

    const modalErroNome = await driver.findElement(By.id("modalMensagemErro"));

    await driver.wait(until.elementIsVisible(modalErroNome), 5000);

    const textoErroNome = await driver
      .findElement(By.id("modalTextoErro"))
      .getText();

    console.log("Erro nome inválido:", textoErroNome);

    await driver.findElement(By.id("modalOkErro")).click();

    await driver.wait(until.elementIsNotVisible(modalErroNome), 5000);

    await driver.findElement(By.id("nome")).clear();
    await driver.findElement(By.id("email")).clear();
    await driver.findElement(By.id("senha")).clear();
    await driver.findElement(By.id("confirmarSenha")).clear();

    // -----------------------------
    // TESTE SENHA INVÁLIDA
    // -----------------------------

    await driver.findElement(By.id("nome")).sendKeys("Maria Souza");
    await driver.findElement(By.id("email")).sendKeys("maria@teste.com");
    await driver.findElement(By.id("senha")).sendKeys("abcdef");
    await driver.findElement(By.id("confirmarSenha")).sendKeys("abcdef");

    await driver.findElement(By.id("btnCadastrar")).click();

    const modalErroSenha = await driver.findElement(By.id("modalMensagemErro"));

    await driver.wait(until.elementIsVisible(modalErroSenha), 5000);

    const textoErroSenha = await driver
      .findElement(By.id("modalTextoErro"))
      .getText();

    console.log("Erro senha inválida:", textoErroSenha);

    await driver.findElement(By.id("modalOkErro")).click();

    await driver.wait(until.elementIsNotVisible(modalErroSenha), 5000);

    await driver.findElement(By.id("nome")).clear();
    await driver.findElement(By.id("email")).clear();
    await driver.findElement(By.id("senha")).clear();
    await driver.findElement(By.id("confirmarSenha")).clear();

    // -----------------------------
    // TESTE WINDOW.ONLOAD
    // -----------------------------

    await driver.executeScript(() => {
      localStorage.setItem(
        "qaplayground_usuario",
        JSON.stringify({
          nome: "Teste Persistido",
          email: "persistido@teste.com",
          senha: "Abc123!",
        }),
      );
    });

    await driver.navigate().refresh();

    const campos = ["nome", "email", "senha", "confirmarSenha", "btnCadastrar"];

    for (let campo of campos) {
      const el = await driver.findElement(By.id(campo));
      const disabled = await el.getAttribute("disabled");

      console.log(campo, "desabilitado?", disabled ? true : false);
    }

    const btnVer = await driver.findElement(By.id("btnVerUsuario"));
    const btnLimpar = await driver.findElement(By.id("btnLimparCadastro"));

    console.log("btnVerUsuario visível?", await btnVer.isDisplayed());
    console.log("btnLimparCadastro visível?", await btnLimpar.isDisplayed());

    // -----------------------------
    // TESTE BOTÃO REQUISITOS
    // -----------------------------

    await driver.findElement(By.css("button.requisitos")).click();

    // espera a página de requisitos carregar
    await driver.wait(until.urlContains("cadastro-requisitos.html"), 5000);

    console.log("Página de requisitos aberta:", await driver.getCurrentUrl());

    // valida botão voltar dentro da página
    await driver
      .findElement(By.xpath("//button[contains(text(),'Voltar')]"))
      .click();

    // espera voltar para página de cadastro
    await driver.wait(until.urlContains("cadastro.html"), 5000);

    console.log(
      "Retornou para página de cadastro:",
      await driver.getCurrentUrl(),
    );
  } catch (error) {
    console.error("Erro durante os testes:", error);
  } finally {
    await driver.quit();
  }
}

cadastroCompleto();
