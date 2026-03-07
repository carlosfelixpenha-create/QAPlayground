// frontend/tests/e2e/seleniumwebdriver/botoes.spec.js
const { Builder, By, Key, until } = require("selenium-webdriver");

async function botoesCompleto() {
  // Configuração do driver Chrome
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    // Maximiza a janela
    await driver.manage().window().maximize();

    // Abre a página local do catálogo de botões
    await driver.get(
      "https://carlosfelixpenha-create.github.io/QAPlayground/frontend/pages/botoes.html",
    );

    // TESTE 1: Botão Primário - Confirmar
    const btnConfirmar = await driver.findElement(
      By.id("btn-primario-confirmar"),
    );
    await btnConfirmar.click();

    const retorno = await driver.findElement(By.id("retorno-primario"));
    await driver.wait(
      async () =>
        (await retorno.getText()) ===
        "Sucesso: Ação Confirmar executada com sucesso!",
      5000,
    );

    const classes = await retorno.getAttribute("class");
    if (!/sucesso/.test(classes))
      throw new Error("Classe de sucesso não encontrada");

    const botoesPrimarios = await driver.findElements(
      By.css("[id^='btn-primario']"),
    );
    for (let btn of botoesPrimarios) {
      const enabled = await btn.isEnabled();
      if (enabled)
        throw new Error("Botão primário ainda habilitado após clique");
    }

    const modalOk = await driver.findElement(By.id("modalOk"));
    await modalOk.click();

    const btnReset = await driver.findElement(By.css(".resetar"));
    await btnReset.click();

    await driver.wait(async () => (await retorno.getText()) === "", 5000);
    for (let btn of botoesPrimarios) {
      const enabled = await btn.isEnabled();
      if (!enabled)
        throw new Error("Botão primário não reabilitado após reset");
    }

    console.log("Teste Botão Primário - Confirmar finalizado com sucesso!");

    // TESTE 2: Botão Primário - Clicar em botão incorreto
    const btnSalvar = await driver.findElement(By.id("btn-primario-salvar"));
    await btnSalvar.click();

    // Valida texto de retorno de erro
    await driver.wait(
      async () =>
        (await retorno.getText()) ===
        'Erro: Clicar no botão "Salvar" não é permitido. Use o botão Confirmar.',
      5000,
    );

    // Valida classe de erro
    const classesErro = await retorno.getAttribute("class");
    if (!/erro/.test(classesErro))
      throw new Error("Classe de erro não encontrada");

    // Verifica que o botão clicado está desabilitado
    const enabledSalvar = await btnSalvar.isEnabled();
    if (enabledSalvar)
      throw new Error("Botão incorreto ainda habilitado após clique");

    // Fecha o modal de erro
    const modalOkErro = await driver.findElement(By.id("modalOkErro"));
    await modalOkErro.click();

    // Reseta a página usando o botão Limpar
    await btnReset.click();

    // Valida retorno zerado e botões primários habilitados novamente
    await driver.wait(async () => (await retorno.getText()) === "", 5000);
    for (let btn of botoesPrimarios) {
      const enabled = await btn.isEnabled();
      if (!enabled)
        throw new Error("Botão primário não reabilitado após reset");
    }

    console.log(
      "Teste Botão Primário - Clicar em botão incorreto finalizado com sucesso!",
    );

    // TESTE 3: Botão Secundário - Cancelar funciona corretamente
    const btnCancelar = await driver.findElement(
      By.id("btn-secundario-cancelar"),
    );
    await btnCancelar.click();

    const retornoSec = await driver.findElement(By.id("retorno-secundario"));

    // Valida texto de sucesso
    await driver.wait(
      async () =>
        (await retornoSec.getText()).match(
          /Sucesso: Ação Cancelar realizada com sucesso!/,
        ),
      5000,
    );

    // Valida classe de sucesso
    const classesSec = await retornoSec.getAttribute("class");
    if (!/sucesso/.test(classesSec))
      throw new Error("Classe de sucesso não encontrada");

    // Verifica todos os botões secundários desabilitados
    const botoesSecundarios = await driver.findElements(
      By.css("[id^='btn-secundario']"),
    );
    for (let btn of botoesSecundarios) {
      const enabled = await btn.isEnabled();
      if (enabled)
        throw new Error("Botão secundário ainda habilitado após clique");
    }

    // Fecha modal de sucesso
    const modalOkSec = await driver.findElement(By.id("modalOk"));
    await modalOkSec.click();

    // Reseta a página
    await btnReset.click();

    // Valida retorno zerado e botões secundários habilitados
    await driver.wait(async () => (await retornoSec.getText()) === "", 5000);
    for (let btn of botoesSecundarios) {
      const enabled = await btn.isEnabled();
      if (!enabled)
        throw new Error("Botão secundário não reabilitado após reset");
    }

    console.log("Teste Botão Secundário - Cancelar finalizado com sucesso!");

    // TESTE 4: Botão Secundário - Clicar em botão incorreto mostra erro
    const btnVoltar = await driver.findElement(By.id("btn-secundario-voltar"));
    await btnVoltar.click();

    // Valida texto de erro
    await driver.wait(
      async () =>
        (await retornoSec.getText()).match(
          /Erro: Clicar no botão "Voltar" não é permitido. Use o botão Cancelar./,
        ),
      5000,
    );

    // Valida classe de erro
    const classesSecErro = await retornoSec.getAttribute("class");
    if (!/erro/.test(classesSecErro))
      throw new Error("Classe de erro não encontrada");

    // Verifica que o botão clicado está desabilitado
    const enabledVoltar = await btnVoltar.isEnabled();
    if (enabledVoltar)
      throw new Error("Botão incorreto ainda habilitado após clique");

    // Fecha modal de erro
    const modalOkSecErro = await driver.findElement(By.id("modalOkErro"));
    await modalOkSecErro.click();

    // Reseta a página
    await btnReset.click();

    // Valida retorno zerado e botões secundários habilitados
    await driver.wait(async () => (await retornoSec.getText()) === "", 5000);
    for (let btn of botoesSecundarios) {
      const enabled = await btn.isEnabled();
      if (!enabled)
        throw new Error("Botão secundário não reabilitado após reset");
    }

    console.log(
      "Teste Botão Secundário - Clicar em botão incorreto finalizado com sucesso!",
    );

    // TESTE 5: Botão Terciário - Exportar funciona corretamente
    const btnExportar = await driver.findElement(
      By.id("btn-terciario-exportar"),
    );
    await btnExportar.click();

    const retornoTerciario = await driver.findElement(
      By.id("retorno-terciario"),
    );

    // Valida texto de sucesso
    await driver.wait(
      async () =>
        (await retornoTerciario.getText()).match(
          /Sucesso: Ação Exportar executada com sucesso!/,
        ),
      5000,
    );

    // Valida classe de sucesso
    const classesTerciario = await retornoTerciario.getAttribute("class");
    if (!/sucesso/.test(classesTerciario))
      throw new Error("Classe de sucesso não encontrada");

    // Verifica todos os botões terciários desabilitados
    const botoesTerciario = await driver.findElements(
      By.css("[id^='btn-terciario']"),
    );
    for (let btn of botoesTerciario) {
      const enabled = await btn.isEnabled();
      if (enabled)
        throw new Error("Botão terciário ainda habilitado após clique");
    }

    // Fecha modal de sucesso
    const modalOkTerciario = await driver.findElement(By.id("modalOk"));
    await modalOkTerciario.click();

    // Reseta a página
    await btnReset.click();

    // Valida retorno zerado e botões terciários habilitados
    await driver.wait(
      async () => (await retornoTerciario.getText()) === "",
      5000,
    );
    for (let btn of botoesTerciario) {
      const enabled = await btn.isEnabled();
      if (!enabled)
        throw new Error("Botão terciário não reabilitado após reset");
    }

    console.log("Teste Botão Terciário - Exportar finalizado com sucesso!");

    // TESTE 6: Botão Terciário - Clicar em botão incorreto mostra erro
    const btnImprimir = await driver.findElement(
      By.id("btn-terciario-imprimir"),
    );
    await btnImprimir.click();

    // Valida texto de erro
    await driver.wait(
      async () =>
        (await retornoTerciario.getText()).match(
          /Erro: Clicar no botão "Imprimir" não é permitido. Use o botão Exportar./,
        ),
      5000,
    );

    // Valida classe de erro
    const classesTerciarioErro = await retornoTerciario.getAttribute("class");
    if (!/erro/.test(classesTerciarioErro))
      throw new Error("Classe de erro não encontrada");

    // Verifica que o botão clicado está desabilitado
    const enabledImprimir = await btnImprimir.isEnabled();
    if (enabledImprimir)
      throw new Error("Botão incorreto ainda habilitado após clique");

    // Fecha modal de erro
    const modalOkTerciarioErro = await driver.findElement(By.id("modalOkErro"));
    await modalOkTerciarioErro.click();

    // Reseta a página
    await btnReset.click();

    // Valida retorno zerado e botões terciários habilitados
    await driver.wait(
      async () => (await retornoTerciario.getText()) === "",
      5000,
    );
    for (let btn of botoesTerciario) {
      const enabled = await btn.isEnabled();
      if (!enabled)
        throw new Error("Botão terciário não reabilitado após reset");
    }

    console.log(
      "Teste Botão Terciário - Clicar em botão incorreto finalizado com sucesso!",
    );

    // TESTE 7: Botão de Perigo - Excluir funciona corretamente
    const btnExcluir = await driver.findElement(By.id("btn-danger-excluir"));
    await btnExcluir.click();

    const retornoDanger = await driver.findElement(By.id("retorno-danger"));

    // Valida texto de sucesso
    await driver.wait(
      async () =>
        (await retornoDanger.getText()).match(/Excluir concluído com sucesso!/),
      5000,
    );

    // Valida classe de sucesso
    const classesDanger = await retornoDanger.getAttribute("class");
    if (!/sucesso/.test(classesDanger))
      throw new Error("Classe de sucesso não encontrada");

    // Verifica todos os botões de perigo desabilitados
    const botoesDanger = await driver.findElements(
      By.css("[id^='btn-danger']"),
    );
    for (let btn of botoesDanger) {
      const enabled = await btn.isEnabled();
      if (enabled)
        throw new Error("Botão de perigo ainda habilitado após clique");
    }

    // Fecha modal de sucesso
    const modalOkDanger = await driver.findElement(By.id("modalOk"));
    await modalOkDanger.click();

    // Reseta a página
    await btnReset.click();

    // Valida retorno zerado e botões de perigo habilitados
    await driver.wait(async () => (await retornoDanger.getText()) === "", 5000);
    for (let btn of botoesDanger) {
      const enabled = await btn.isEnabled();
      if (!enabled)
        throw new Error("Botão de perigo não reabilitado após reset");
    }

    console.log("Teste Botão de Perigo - Excluir finalizado com sucesso!");

    // TESTE 8: Botão de Perigo - Clicar em botão incorreto mostra erro
    const btnRemover = await driver.findElement(By.id("btn-danger-remover"));
    await btnRemover.click();

    // Valida texto de erro
    await driver.wait(
      async () =>
        (await retornoDanger.getText()).match(
          /Erro: Clicar no botão "Remover" não é permitido. Use o botão Excluir./,
        ),
      5000,
    );

    // Valida classe de erro
    const classesDangerErro = await retornoDanger.getAttribute("class");
    if (!/erro/.test(classesDangerErro))
      throw new Error("Classe de erro não encontrada");

    // Verifica que o botão clicado está desabilitado
    const enabledRemover = await btnRemover.isEnabled();
    if (enabledRemover)
      throw new Error("Botão incorreto ainda habilitado após clique");

    // Fecha modal de erro
    const modalOkDangerErro = await driver.findElement(By.id("modalOkErro"));
    await modalOkDangerErro.click();

    // Reseta a página
    await btnReset.click();

    // Valida retorno zerado e botões de perigo habilitados
    await driver.wait(async () => (await retornoDanger.getText()) === "", 5000);
    for (let btn of botoesDanger) {
      const enabled = await btn.isEnabled();
      if (!enabled)
        throw new Error("Botão de perigo não reabilitado após reset");
    }

    console.log(
      "Teste Botão de Perigo - Clicar em botão incorreto finalizado com sucesso!",
    );

    // TESTE 9: Botão Loading - Processar funciona corretamente
    const btnProcessar = await driver.findElement(
      By.id("btn-loading-processar"),
    );
    await btnProcessar.click();

    const retornoLoading = await driver.findElement(By.id("retorno-loading"));

    // Aguarda tempo do loading (4s + buffer)
    await driver.sleep(4100);

    // Valida texto de sucesso
    await driver.wait(
      async () =>
        (await retornoLoading.getText()).match(
          /Sucesso: Ação Processar concluída com sucesso!/,
        ),
      5000,
    );

    // Valida classe de sucesso
    const classesLoading = await retornoLoading.getAttribute("class");
    if (!/sucesso/.test(classesLoading))
      throw new Error("Classe de sucesso não encontrada");

    // Verifica todos os botões Loading desabilitados
    const botoesLoading = await driver.findElements(
      By.css("[id^='btn-loading']"),
    );
    for (let btn of botoesLoading) {
      const enabled = await btn.isEnabled();
      if (enabled)
        throw new Error("Botão Loading ainda habilitado após clique");
    }

    // Fecha modal de sucesso
    const modalOkLoading = await driver.findElement(By.id("modalOk"));
    await modalOkLoading.click();

    // Reseta a página
    await btnReset.click();

    // Valida retorno zerado e botões Loading habilitados
    await driver.wait(
      async () => (await retornoLoading.getText()) === "",
      5000,
    );
    for (let btn of botoesLoading) {
      const enabled = await btn.isEnabled();
      if (!enabled) throw new Error("Botão Loading não reabilitado após reset");
    }

    console.log("Teste Botão Loading - Processar finalizado com sucesso!");

    // TESTE 10: Botão Loading - Clicar em botão incorreto mostra erro
    const btnEnviar = await driver.findElement(By.id("btn-loading-enviar"));
    await btnEnviar.click();

    // Aguarda tempo do loading (4s + buffer)
    await driver.sleep(4100);

    // Valida texto de erro
    await driver.wait(
      async () =>
        (await retornoLoading.getText()).match(
          /Erro: Clicar no botão "Enviar" não é permitido. Use o botão Processar./,
        ),
      5000,
    );

    // Valida classe de erro
    const classesLoadingErro = await retornoLoading.getAttribute("class");
    if (!/erro/.test(classesLoadingErro))
      throw new Error("Classe de erro não encontrada");

    // Verifica que o botão clicado está desabilitado
    const enabledEnviar = await btnEnviar.isEnabled();
    if (enabledEnviar)
      throw new Error("Botão incorreto ainda habilitado após clique");

    // Fecha modal de erro
    const modalOkLoadingErro = await driver.findElement(By.id("modalOkErro"));
    await modalOkLoadingErro.click();

    // Reseta a página
    await btnReset.click();

    // Valida retorno zerado e botões Loading habilitados
    await driver.wait(
      async () => (await retornoLoading.getText()) === "",
      5000,
    );
    for (let btn of botoesLoading) {
      const enabled = await btn.isEnabled();
      if (!enabled) throw new Error("Botão Loading não reabilitado após reset");
    }

    console.log(
      "Teste Botão Loading - Clicar em botão incorreto finalizado com sucesso!",
    );

    // TESTE 11: Botão de Ícone - Lápis funciona corretamente
    const btnLapis = await driver.findElement(By.id("btn-icone-lapis"));
    await btnLapis.click();

    const retornoIcone = await driver.findElement(By.id("retorno-icone"));

    // Valida texto de sucesso
    await driver.wait(
      async () =>
        (await retornoIcone.getText()).match(
          /Sucesso: Ação Lápis executada com sucesso!/,
        ),
      5000,
    );

    // Valida classe de sucesso
    const classesIcone = await retornoIcone.getAttribute("class");
    if (!/sucesso/.test(classesIcone))
      throw new Error("Classe de sucesso não encontrada");

    // Verifica todos os botões de ícone desabilitados
    const botoesIcone = await driver.findElements(By.css("[id^='btn-icone']"));
    for (let btn of botoesIcone) {
      const enabled = await btn.isEnabled();
      if (enabled)
        throw new Error("Botão de ícone ainda habilitado após clique");
    }

    // Fecha modal de sucesso
    const modalOkIcone = await driver.findElement(By.id("modalOk"));
    await modalOkIcone.click();

    // Reseta a página
    await btnReset.click();

    // Valida retorno zerado e botões de ícone habilitados
    await driver.wait(async () => (await retornoIcone.getText()) === "", 5000);
    for (let btn of botoesIcone) {
      const enabled = await btn.isEnabled();
      if (!enabled)
        throw new Error("Botão de ícone não reabilitado após reset");
    }

    console.log("Teste Botão de Ícone - Lápis finalizado com sucesso!");

    // TESTE 12: Botão de Ícone - Clicar em botão incorreto mostra erro
    const btnOlhoAberto = await driver.findElement(
      By.id("btn-icone-olho-aberto"),
    );
    await btnOlhoAberto.click();

    // Valida texto de erro
    await driver.wait(
      async () =>
        (await retornoIcone.getText()).match(
          /Erro: Clicar no botão "Olho Aberto" não é permitido. Use o botão Lápis./,
        ),
      5000,
    );

    // Valida classe de erro
    const classesIconeErro = await retornoIcone.getAttribute("class");
    if (!/erro/.test(classesIconeErro))
      throw new Error("Classe de erro não encontrada");

    // Verifica que o botão clicado está desabilitado
    const enabledOlho = await btnOlhoAberto.isEnabled();
    if (enabledOlho)
      throw new Error("Botão incorreto ainda habilitado após clique");

    // Fecha modal de erro
    const modalOkIconeErro = await driver.findElement(By.id("modalOkErro"));
    await modalOkIconeErro.click();

    // Reseta a página
    await btnReset.click();

    // Valida retorno zerado e botões de ícone habilitados
    await driver.wait(async () => (await retornoIcone.getText()) === "", 5000);
    for (let btn of botoesIcone) {
      const enabled = await btn.isEnabled();
      if (!enabled)
        throw new Error("Botão de ícone não reabilitado após reset");
    }

    console.log(
      "Teste Botão de Ícone - Clicar em botão incorreto finalizado com sucesso!",
    );

    // TESTES DE NAVEGAÇÃO
    console.log("Iniciando testes de navegação...");

    try {
      // Botão Requisitos
      const btnRequisitos = await driver.findElement(
        By.css("button.requisitos"),
      );
      await driver.wait(until.elementIsVisible(btnRequisitos), 5000);
      await driver.wait(until.elementIsEnabled(btnRequisitos), 5000);
      await btnRequisitos.click();
      await driver.wait(until.urlContains("botoes-requisitos.html"), 5000);
      console.log(
        "Teste Botão Requisitos - navegação para página de requisitos finalizado com sucesso!",
      );

      // Botão Voltar
      const btnVoltar = await driver.findElement(
        By.xpath("//button[normalize-space(text())='Voltar']"),
      );
      await driver.wait(until.elementIsVisible(btnVoltar), 5000);
      await driver.wait(until.elementIsEnabled(btnVoltar), 5000);
      await btnVoltar.click();
      await driver.wait(until.urlContains("botoes.html"), 5000);
      console.log(
        "Teste Botão Voltar - retorno para página principal finalizado com sucesso!",
      );
    } catch (err) {
      console.error("Erro nos testes de navegação:", err);
    }

    // Aqui adicionaremos os próximos testes incrementais
  } finally {
    // Fecha o driver
    await driver.quit();
  }
}

// Executa todos os testes
botoesCompleto();
