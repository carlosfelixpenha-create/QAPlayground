// frontend/tests/e2e/seleniumwebdriver/arrastar-soltar.spec.js
const { Builder, By, Key, until } = require("selenium-webdriver");

async function arrastarSoltarCompleto() {
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.manage().window().maximize();
    await driver.get(
      "https://carlosfelixpenha-create.github.io/QAPlayground/frontend/pages/arrastar-soltar.html",
    );
    console.log(
      "Página Arrastar e Soltar aberta:",
      await driver.getCurrentUrl(),
    );

    // -----------------------------
    // Drag & Drop correto
    // -----------------------------
    const palavraCasa = await driver.findElement(
      By.css('.tag-palavra[data-tipo="casa"]'),
    );
    const slotCasa = await driver.findElement(
      By.css('.item-slot[data-tipo="casa"]'),
    );

    await driver.executeScript(
      `const src = arguments[0]; const tgt = arguments[1];
       const dt = new DataTransfer();
       src.dispatchEvent(new DragEvent('dragstart', { dataTransfer: dt }));
       tgt.dispatchEvent(new DragEvent('dragover', { dataTransfer: dt }));
       tgt.dispatchEvent(new DragEvent('drop', { dataTransfer: dt }));
       src.dispatchEvent(new DragEvent('dragend', { dataTransfer: dt }));`,
      palavraCasa,
      slotCasa,
    );

    const acertos1 = await driver.findElement(By.id("acertos")).getText();
    const erros1 = await driver.findElement(By.id("erros")).getText();
    const movimentos1 = await driver.findElement(By.id("movimentos")).getText();
    console.log(
      `HUD após drag & drop - Acertos: ${acertos1} Erros: ${erros1} Movimentos: ${movimentos1}`,
    );

    const draggableCasa = await palavraCasa.getAttribute("draggable");
    const opacityCasa = await palavraCasa.getCssValue("opacity");
    console.log(
      `Palavra 'casa' - draggable: ${draggableCasa} opacity: ${opacityCasa}`,
    );

    // -----------------------------
    // Drag & Drop errado
    // -----------------------------
    const palavraCarro = await driver.findElement(
      By.css('.tag-palavra[data-tipo="casa"]'),
    );
    const slotCarro = await driver.findElement(
      By.css('.item-slot[data-tipo="carro"]'),
    );

    await driver.executeScript(
      `const src = arguments[0]; const tgt = arguments[1];
       const dt = new DataTransfer();
       src.dispatchEvent(new DragEvent('dragstart', { dataTransfer: dt }));
       tgt.dispatchEvent(new DragEvent('dragover', { dataTransfer: dt }));
       tgt.dispatchEvent(new DragEvent('drop', { dataTransfer: dt }));
       src.dispatchEvent(new DragEvent('dragend', { dataTransfer: dt }));`,
      palavraCarro,
      slotCarro,
    );

    const acertos2 = await driver.findElement(By.id("acertos")).getText();
    const erros2 = await driver.findElement(By.id("erros")).getText();
    const movimentos2 = await driver.findElement(By.id("movimentos")).getText();
    console.log(
      `HUD após drag & drop errado - Acertos: ${acertos2} Erros: ${erros2} Movimentos: ${movimentos2}`,
    );

    const slotParagrafoErro = await slotCarro.findElements(By.css("p"));
    const slotImgErro = await slotCarro.findElement(By.css("img"));
    console.log(
      `Texto do slot após erro: ${slotParagrafoErro.length > 0 ? await slotParagrafoErro[0].getText() : ""}`,
    );
    console.log(`Imagem do slot visível: ${await slotImgErro.isDisplayed()}`);

    // -----------------------------
    // Reiniciar
    // -----------------------------
    const reiniciarBtn = await driver.findElement(By.id("reiniciar"));
    await reiniciarBtn.click();

    const acertos3 = await driver.findElement(By.id("acertos")).getText();
    const erros3 = await driver.findElement(By.id("erros")).getText();
    const movimentos3 = await driver.findElement(By.id("movimentos")).getText();
    console.log(
      `HUD após reiniciar - Acertos: ${acertos3} Erros: ${erros3} Movimentos: ${movimentos3}`,
    );

    const palavraReset = await driver.findElement(
      By.css('.tag-palavra[data-tipo="casa"]'),
    );
    const draggableReset = await palavraReset.getAttribute("draggable");
    const opacityReset = await palavraReset.getCssValue("opacity");
    console.log(
      `Palavra 'casa' - draggable: ${draggableReset} opacity: ${opacityReset}`,
    );

    const slotParagrafo = await slotCasa.findElements(By.css("p"));
    const slotImg = await slotCasa.findElement(By.css("img"));
    console.log(`Slot parágrafo após reinício: ${slotParagrafo.length}`);
    console.log(`Imagem do slot visível: ${await slotImg.isDisplayed()}`);

    // -----------------------------
    // Navegação Requisitos e Voltar
    // -----------------------------
    const botaoRequisitos = await driver.findElement(
      By.css("button.requisitos"),
    );
    await botaoRequisitos.click();
    await driver.wait(
      until.urlContains("arrastar-soltar-requisitos.html"),
      5000,
    );
    console.log("Navegou para Requisitos:", await driver.getCurrentUrl());

    const botaoVoltar = await driver.findElement(
      By.xpath("//button[normalize-space()='Voltar']"),
    );
    await botaoVoltar.click();
    await driver.wait(until.urlContains("arrastar-soltar.html"), 5000);
    console.log(
      "Retornou para Arrastar e Soltar:",
      await driver.getCurrentUrl(),
    );

    // -----------------------------
    // Completar todos os pares
    // -----------------------------
    const pares = [
      "casa",
      "campo",
      "morro",
      "predio",
      "ponte",
      "carro",
      "barco",
    ];
    for (const tipo of pares) {
      const palavraPar = await driver.findElement(
        By.css(`.tag-palavra[data-tipo="${tipo}"]`),
      );
      const slotPar = await driver.findElement(
        By.css(`.item-slot[data-tipo="${tipo}"]`),
      );
      await driver.executeScript(
        `const src = arguments[0]; const tgt = arguments[1];
         const dt = new DataTransfer();
         src.dispatchEvent(new DragEvent('dragstart', { dataTransfer: dt }));
         tgt.dispatchEvent(new DragEvent('dragover', { dataTransfer: dt }));
         tgt.dispatchEvent(new DragEvent('drop', { dataTransfer: dt }));
         src.dispatchEvent(new DragEvent('dragend', { dataTransfer: dt }));`,
        palavraPar,
        slotPar,
      );
    }

    const mensagemFinal = await driver.findElement(By.css("#mensagem-final p"));
    console.log("Mensagem final visível:", await mensagemFinal.isDisplayed());
    console.log("Texto da mensagem final:", await mensagemFinal.getText());

    // Validar todas as imagens nos slots antes de iniciar o jogo
    const todosSlots = await driver.findElements(By.css(".item-slot"));
    for (let i = 0; i < todosSlots.length; i++) {
      const img = await todosSlots[i].findElement(By.css("img"));
      const visivel = await img.isDisplayed();
      console.log(`Slot ${i + 1} imagem visível: ${visivel}`);
    }
  } finally {
    await driver.quit();
  }
}

// Executa o teste
arrastarSoltarCompleto();
