// frontend/tests/e2e/seleniumwebdriver/index.spec.js
const { Builder, By, until } = require("selenium-webdriver");

(async function runTests() {
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    console.log("Abrindo página inicial do QAPlayground...");
    await driver.get("https://carlosfelixpenha-create.github.io/QAPlayground/");
    console.log("Página carregada com sucesso");

    // =========================
    // Validação de botões do menu
    // =========================
    const botoesMenu = [
      "Cadastro",
      "Login",
      "Formulário 1",
      "Formulário 2",
      "Formulário 3",
      "Botões",
      "Modais",
      "Tabelas",
      "Arrastando Imagens",
      "Quebra Cabeças",
      "Quebra Cabeça 104pcs",
      "Acessibilidades",
      "Instruções/Testes",
      "Referências",
      "Avaliar Plataforma",
      "Sugestões",
    ];

    for (const nome of botoesMenu) {
      const botao = await driver.findElement(
        By.xpath(`//button[contains(text(),'${nome}')]`),
      );
      await driver.wait(until.elementIsVisible(botao), 10000);
      console.log(`Botão "${nome}" visível`);
    }

    // =========================
    // Avaliação com 1 estrela
    // =========================
    const btnAvaliar = await driver.findElement(
      By.css("button[onclick='abrirModalAvaliacao()']"),
    );
    const modalAvaliacao = await driver.findElement(By.id("modal-avaliacao"));

    console.log("Abrindo modal de avaliação...");
    await btnAvaliar.click();
    await driver.wait(until.elementIsVisible(modalAvaliacao), 5000);

    const primeiraEstrela = await driver.findElement(
      By.css("#estrelas span:nth-child(1)"),
    );
    await primeiraEstrela.click();

    const resultado = await driver.findElement(By.id("resultado"));
    await driver.wait(until.elementIsVisible(resultado), 5000);
    const texto1 = await resultado.getText();
    if (
      texto1 ===
      "Você avaliou nossa plataforma com 1 estrela! Estamos nos atualizando!"
    ) {
      console.log("Avaliação de 1 estrela verificada");
    }

    // =========================
    // Modal Sugestões
    // =========================
    const btnSugestoes = await driver.findElement(By.id("btn-sugestoes"));
    const modalSugestoes = await driver.findElement(By.id("modal-sugestoes"));

    console.log("Abrindo modal Sugestões...");
    await btnSugestoes.click();
    await driver.wait(until.elementIsVisible(modalSugestoes), 5000);

    const textarea = await driver.findElement(By.id("texto-sugestao"));
    await textarea.sendKeys("Teste automático Selenium");
    const valorTextarea = await textarea.getAttribute("value");
    if (valorTextarea === "Teste automático Selenium")
      console.log("Textarea preenchido corretamente");

    const btnSair = await driver.findElement(
      By.css("#modal-sugestoes button.btn-secondary"),
    );
    console.log("Clicando em Sair...");
    await btnSair.click();
    await driver.wait(async () => !(await modalSugestoes.isDisplayed()), 5000);
    console.log("Modal Sugestões fechado");

    console.log("Reabrindo modal Sugestões...");
    await btnSugestoes.click();
    await driver.wait(until.elementIsVisible(modalSugestoes), 5000);

    const valorTextarea2 = await textarea.getAttribute("value");
    if (valorTextarea2 === "") console.log("Textarea limpo após reabertura");

    await textarea.sendKeys("Segundo envio automático");
    const btnEnviar = await driver.findElement(
      By.css("#modal-sugestoes button.btn-primary"),
    );
    console.log("Clicando em Enviar...");
    await btnEnviar.click();

    const mensagem = await driver.findElement(By.id("texto-mensagem"));
    await driver.wait(until.elementIsVisible(mensagem), 5000);
    const textoMsg = await mensagem.getText();
    if (textoMsg === "Sua sugestão foi enviada com sucesso!")
      console.log("Mensagem de sucesso exibida");

    // =========================
    // Modal Contatos
    // =========================
    const btnContatos = await driver.findElement(By.id("btnContatos"));
    const modalContatos = await driver.findElement(By.id("modal-contatos"));

    console.log("Abrindo modal Contatos...");
    await btnContatos.click();
    await driver.wait(until.elementIsVisible(modalContatos), 5000);

    const links = await modalContatos.findElements(By.tagName("a"));
    const expectedLinks = [
      "https://www.linkedin.com/in/carlos-f%C3%A9lix-9427676b",
      "https://carlosfelixpenha-create.github.io/Portfolio/",
      "https://github.com/carlosfelixpenha-create",
    ];

    for (let i = 0; i < expectedLinks.length; i++) {
      const href = await links[i].getAttribute("href");
      if (href === expectedLinks[i])
        console.log(`Link ${i + 1} validado: ${href}`);
    }

    console.log("Fechando modal Contatos...");
    const btnContatosOk = await driver.findElement(By.id("modalContatosOk"));
    await btnContatosOk.click();
    await driver.wait(async () => !(await modalContatos.isDisplayed()), 5000);
    console.log("Modal Contatos fechado com sucesso");
  } finally {
    await driver.quit();
    console.log("Driver encerrado");
  }
})();
