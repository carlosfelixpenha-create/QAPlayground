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
    VALIDAÇÃO - PÁGINA CARREGADA
    =========================
    */

    await driver.wait(until.elementLocated(By.id("masculino")), 5000);
    await driver.wait(until.elementLocated(By.id("feminino")), 5000);
    await driver.wait(until.elementLocated(By.id("dataNascimento")), 5000);
    await driver.wait(until.elementLocated(By.id("telefone")), 5000);
    await driver.wait(until.elementLocated(By.id("cpf")), 5000);
    await driver.wait(
      until.elementLocated(By.css("button[type='submit']")),
      5000,
    );

    console.log("Elementos principais carregados");

    /*
    =========================
    FLUXO FELIZ
    =========================
    */

    await driver.findElement(By.id("masculino")).click();
    await driver.findElement(By.id("qa")).click();

    await driver.findElement(By.id("dataNascimento")).sendKeys("2000-01-01");
    await driver.findElement(By.id("telefone")).sendKeys("11999999999");
    await driver.findElement(By.id("cpf")).sendKeys("12345678900");

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
    VALIDA CAMPOS LIMPOS
    =========================
    */

    let dataValue = await driver
      .findElement(By.id("dataNascimento"))
      .getAttribute("value");
    let telValue = await driver
      .findElement(By.id("telefone"))
      .getAttribute("value");
    let cpfValue = await driver.findElement(By.id("cpf")).getAttribute("value");

    console.log("Campos após envio:", dataValue, telValue, cpfValue);

    /*
    =========================
    ERRO - SEXO NÃO SELECIONADO
    =========================
    */

    await driver.findElement(By.id("qa")).click();

    await driver.findElement(By.id("dataNascimento")).sendKeys("2000-01-01");
    await driver.findElement(By.id("telefone")).sendKeys("11999999999");
    await driver.findElement(By.id("cpf")).sendKeys("12345678900");

    await driver.findElement(By.css("button[type='submit']")).click();

    let modalErro = await driver.wait(
      until.elementLocated(By.id("modalMensagemErro")),
      5000,
    );

    let textoErro = await modalErro
      .findElement(By.id("modalTextoErro"))
      .getText();

    console.log("Erro sexo vazio:", textoErro);

    let btnOkErro = await driver.findElement(By.id("modalOkErro"));
    await driver.wait(until.elementIsVisible(btnOkErro), 5000);
    await btnOkErro.click();

    await driver.wait(until.elementLocated(By.id("dataNascimento")), 5000);

    /*
=========================
ERRO - INTERESSE VAZIO
=========================
*/

    // garante que nenhum interesse esteja marcado
    let qaCheckbox = await driver.findElement(By.id("qa"));
    let qaSelecionado = await qaCheckbox.isSelected();

    if (qaSelecionado) {
      await qaCheckbox.click();
    }

    await driver.findElement(By.id("masculino")).click();

    await driver.findElement(By.id("dataNascimento")).clear();
    await driver.findElement(By.id("telefone")).clear();
    await driver.findElement(By.id("cpf")).clear();

    await driver.findElement(By.id("dataNascimento")).sendKeys("2000-01-01");
    await driver.findElement(By.id("telefone")).sendKeys("11999999999");
    await driver.findElement(By.id("cpf")).sendKeys("12345678900");

    await driver.findElement(By.css("button[type='submit']")).click();

    // espera o modal aparecer no DOM
    modalErro = await driver.wait(
      until.elementLocated(By.id("modalMensagemErro")),
      5000,
    );

    // espera o modal ficar visível na tela
    await driver.wait(until.elementIsVisible(modalErro), 5000);

    // agora captura o texto
    textoErro = await modalErro.findElement(By.id("modalTextoErro")).getText();

    console.log("Erro interesse vazio:", textoErro);

    // espera o botão OK aparecer e clica
    let btnOkErroInteresse = await driver.wait(
      until.elementLocated(By.id("modalOkErro")),
      5000,
    );

    await driver.wait(until.elementIsVisible(btnOkErroInteresse), 5000);
    await btnOkErroInteresse.click();

    /*
=========================
ERRO - DATA NASCIMENTO VAZIA
=========================
*/

    // garante interesse selecionado
    await driver.findElement(By.id("qa")).click();

    // força limpar o campo data corretamente
    let campoData = await driver.findElement(By.id("dataNascimento"));
    await driver.executeScript("arguments[0].value = '';", campoData);

    await driver.findElement(By.id("telefone")).clear();
    await driver.findElement(By.id("cpf")).clear();

    await driver.findElement(By.id("telefone")).sendKeys("11999999999");
    await driver.findElement(By.id("cpf")).sendKeys("12345678900");

    await driver.findElement(By.css("button[type='submit']")).click();

    modalErro = await driver.wait(
      until.elementLocated(By.id("modalMensagemErro")),
      5000,
    );

    await driver.wait(until.elementIsVisible(modalErro), 5000);

    textoErro = await modalErro.findElement(By.id("modalTextoErro")).getText();
    console.log("Erro data nascimento vazia:", textoErro);

    let btnOkErroData = await driver.wait(
      until.elementLocated(By.id("modalOkErro")),
      5000,
    );

    await driver.wait(until.elementIsVisible(btnOkErroData), 5000);
    await btnOkErroData.click();

    /*
=========================
ERRO TELEFONE VAZIO
=========================
*/

    await driver.findElement(By.id("dataNascimento")).sendKeys("2000-01-01");

    await driver.findElement(By.id("telefone")).clear();

    await driver.findElement(By.id("cpf")).clear();
    await driver.findElement(By.id("cpf")).sendKeys("12345678900");

    await driver.findElement(By.css("button[type='submit']")).click();

    modalErro = await driver.wait(
      until.elementLocated(By.id("modalMensagemErro")),
      5000,
    );

    await driver.wait(until.elementIsVisible(modalErro), 5000);

    textoErro = await modalErro.findElement(By.id("modalTextoErro")).getText();
    console.log("Erro telefone vazio:", textoErro);

    let btnOkErroTelefone = await driver.wait(
      until.elementLocated(By.id("modalOkErro")),
      5000,
    );

    await driver.wait(until.elementIsVisible(btnOkErroTelefone), 5000);

    await btnOkErroTelefone.click();

    // esperar o modal desaparecer da tela
    await driver.wait(until.elementIsNotVisible(modalErro), 5000);

    /*
=========================
ERRO CPF VAZIO
=========================
*/

    // limpar CPF
    await driver.findElement(By.id("cpf")).clear();

    // garantir telefone válido
    await driver.findElement(By.id("telefone")).clear();
    await driver.findElement(By.id("telefone")).sendKeys("11999999999");

    // submit
    await driver.findElement(By.css("button[type='submit']")).click();

    // esperar modal aparecer no DOM
    modalErro = await driver.wait(
      until.elementLocated(By.id("modalMensagemErro")),
      5000,
    );

    // esperar modal ficar visível (timeout aumentado para 10000ms)
    await driver.wait(until.elementIsVisible(modalErro), 10000);

    // capturar mensagem
    textoErro = await modalErro.findElement(By.id("modalTextoErro")).getText();
    console.log("Erro CPF vazio:", textoErro);

    // localizar botão OK
    let btnOkErroCpf = await driver.wait(
      until.elementLocated(By.id("modalOkErro")),
      5000,
    );

    // esperar botão visível
    await driver.wait(until.elementIsVisible(btnOkErroCpf), 5000);

    // clicar no OK
    await btnOkErroCpf.click();

    // AGUARDAR MODAL SUMIR
    await driver.wait(until.elementIsNotVisible(modalErro), 5000);

    /*
    =========================
    TELEFONE COM LETRAS
    =========================
    */

    await driver.findElement(By.id("cpf")).sendKeys("12345678900");

    await driver.findElement(By.id("telefone")).clear();
    await driver.findElement(By.id("telefone")).sendKeys("11ABC999999");

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
    CPF COM LETRAS
    =========================
    */

    await driver.findElement(By.id("telefone")).clear();
    await driver.findElement(By.id("telefone")).sendKeys("11999999999");

    await driver.findElement(By.id("cpf")).clear();
    await driver.findElement(By.id("cpf")).sendKeys("abc123!@#");

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

    const future = new Date();
    future.setDate(future.getDate() + 1);
    const futureStr = future.toISOString().split("T")[0];

    await driver.findElement(By.id("cpf")).clear();
    await driver.findElement(By.id("cpf")).sendKeys("12345678900");

    await driver.findElement(By.id("dataNascimento")).clear();
    await driver.findElement(By.id("dataNascimento")).sendKeys(futureStr);

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
    CORRIGIR ERRO E ENVIAR
    =========================
    */

    await driver.findElement(By.id("cpf")).clear();
    await driver.findElement(By.id("cpf")).sendKeys("abc123");

    await driver.findElement(By.css("button[type='submit']")).click();

    modalErro = await driver.wait(
      until.elementLocated(By.id("modalMensagemErro")),
      5000,
    );

    await driver.findElement(By.id("modalOkErro")).click();

    await driver.findElement(By.id("cpf")).clear();
    await driver.findElement(By.id("cpf")).sendKeys("12345678900");

    await driver.findElement(By.id("dataNascimento")).clear();
    await driver.findElement(By.id("dataNascimento")).sendKeys("2000-01-01");

    await driver.findElement(By.css("button[type='submit']")).click();

    modal = await driver.wait(
      until.elementLocated(By.id("modalMensagem")),
      5000,
    );

    textoModal = await modal.findElement(By.id("modalTexto")).getText();
    console.log("Sucesso após correção:", textoModal);

    await driver.findElement(By.id("modalOk")).click();

    /*
    =========================
    NAVEGAÇÃO REQUISITOS
    =========================
    */

    await driver
      .findElement(By.xpath("//button[contains(text(),'Requisitos')]"))
      .click();

    await driver.wait(until.urlContains("formulario-2-requisitos.html"), 5000);

    console.log("Página requisitos aberta");

    await driver
      .findElement(By.xpath("//button[contains(text(),'Voltar')]"))
      .click();

    await driver.wait(until.urlContains("formulario-2.html"), 5000);

    console.log("Retornou ao formulário");
  } finally {
    await driver.quit();
  }
}

formulario2Completo();
