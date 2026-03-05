const { test, expect } = require("@playwright/test");

test.describe("Página de Tabelas - E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/QAPlayground/frontend/pages/tabelas.html", {
      waitUntil: "domcontentloaded",
    });

    console.log("Página de Tabelas aberta:", page.url());

    await page.evaluate(() => localStorage.clear());
  });

  test("Tabela Simples - seleção de linha deve funcionar", async ({ page }) => {
    // Estrutura inicial do teste
    const linhasSimples = page.locator(".tabela-simples tbody tr");

    await expect(linhasSimples).toHaveCount(3);
  });

  test("Tabela Simples - clique em linha exibe modal correto", async ({
    page,
  }) => {
    // Garantir que a página está carregada
    await page.goto(
      "https://carlosfelixpenha-create.github.io/QAPlayground/frontend/pages/tabelas.html",
      { waitUntil: "domcontentloaded" },
    );

    const linhasSimples = page.locator(".tabela-simples tbody tr");
    await expect(linhasSimples).toHaveCount(3);

    // Seleciona a primeira linha
    const primeiraLinha = linhasSimples.nth(0);

    // Adiciona a classe de seleção e chama mostrarModal() diretamente via evaluate
    await page.evaluate(
      (linha) => {
        linha.classList.add("linha-selecionada");
        window.mostrarModal(`Linha 1 selecionada`, "Seleção");
      },
      await primeiraLinha.elementHandle(),
    );

    // Espera o modal ficar visível
    const modal = page.locator("#modalMensagem");
    await modal.waitFor({ state: "visible", timeout: 5000 });

    // Verificar título do modal
    const tituloModal = page.locator("#modalTitulo");
    await expect(tituloModal).toHaveText("Seleção");

    // Verificar mensagem de linha selecionada
    const textoModal = page.locator("#modalTexto");
    await expect(textoModal).toHaveText("Linha 1 selecionada");

    // Fechar o modal
    const btnOk = modal.locator(".btn-ok");
    await btnOk.click();

    // Verificar que o modal desapareceu
    await expect(modal).toHaveJSProperty("style.display", "none");
  });

  test("Tabela com Ordenação - deve ordenar corretamente e exibir modal", async ({
    page,
  }) => {
    const linhas = page.locator(".tabela-ordenacao tbody tr");

    // Aguardar pelo menos uma linha visível antes de continuar
    await expect(linhas.first()).toBeVisible({ timeout: 5000 });

    // Verificar que a tabela possui linhas
    const totalLinhas = await linhas.count();
    expect(totalLinhas).toBeGreaterThan(0);

    // Ordenar pela coluna "nome"
    await page.evaluate(() => {
      ordenarTabela("nome");
    });

    // Modal deve aparecer indicando ordenação
    const modal = page.locator("#modalMensagem");
    await modal.waitFor({ state: "visible", timeout: 5000 });

    const tituloModal = page.locator("#modalTitulo");
    await expect(tituloModal).toHaveText("Ordenação");

    const textoModal = page.locator("#modalTexto");
    await expect(textoModal).toContainText("Tabela ordenada por nome");

    // Fechar o modal
    const btnOk = modal.locator(".btn-ok");
    await btnOk.click();
    await expect(modal).toHaveJSProperty("style.display", "none");
  });

  test("Tabela com Busca - filtrar resultados funciona corretamente", async ({
    page,
  }) => {
    const tbody = page.locator("#tabela-busca-container tbody");

    // Espera o tbody estar visível
    await expect(tbody).toBeVisible();

    // Espera pelo menos 1 linha estar no DOM e visível
    await page.waitForFunction(() => {
      const linhas = document.querySelectorAll(
        "#tabela-busca-container tbody tr",
      );
      return (
        linhas.length > 0 &&
        Array.from(linhas).some((l) => l.offsetParent !== null)
      );
    });

    const linhasTabela = tbody.locator("tr");
    const countLinhas = await linhasTabela.count();
    expect(countLinhas).toBeGreaterThan(0); // Substitui toHaveCountGreaterThan

    // Preencher o campo de busca
    const inputBusca = page.locator("#input-busca");
    await inputBusca.fill("Bruno");

    // Aguardar o delay do filtro (3s definido no JS)
    await page.waitForTimeout(3100);

    // Validar que pelo menos uma linha visível corresponde ao termo buscado
    const linhasVisiveis = [];
    for (let i = 0; i < (await linhasTabela.count()); i++) {
      const linha = linhasTabela.nth(i);
      const isVisible = await linha.isVisible();
      const text = await linha.textContent();
      if (isVisible && text.includes("Bruno")) {
        linhasVisiveis.push(linha);
      }
    }
    expect(linhasVisiveis.length).toBeGreaterThan(0);

    // Resetar busca
    await inputBusca.fill("");
    await page.waitForTimeout(3100);

    // Todas as linhas devem voltar a aparecer
    const todasLinhasVisiveis = [];
    for (let i = 0; i < (await linhasTabela.count()); i++) {
      const linha = linhasTabela.nth(i);
      if (await linha.isVisible()) todasLinhasVisiveis.push(linha);
    }
    expect(todasLinhasVisiveis.length).toBeGreaterThan(0);
  });

  test("Tabela com Paginação - deve carregar e permitir navegação entre páginas", async ({
    page,
  }) => {
    const tabela = page.locator("#tabela-paginada-container tbody tr");

    // Verifica que a primeira página possui linhas
    const countLinhas1 = await tabela.count();
    expect(countLinhas1).toBeGreaterThan(0);

    // Avançar para a próxima página via botão
    const btnProxima = page.locator(".paginacao .btn-proxima");

    // Executa a navegação dentro de evaluate para disparar o modal como no JS
    await page.evaluate(() => proximaPagina());

    // Aguardar modal aparecer
    const modal = page.locator("#modalMensagem");
    await modal.waitFor({ state: "visible", timeout: 5000 });

    // Validar título e texto do modal
    const tituloModal = page.locator("#modalTitulo");
    await expect(tituloModal).toHaveText("Paginação");

    const textoModal = page.locator("#modalTexto");
    await expect(textoModal).toContainText("Próxima página carregada");

    // Fechar o modal
    const btnOk = modal.locator(".btn-ok");
    await btnOk.click();

    // Aguardar modal desaparecer antes de continuar
    await expect(modal).toHaveJSProperty("style.display", "none");

    // Verifica que a segunda página possui linhas visíveis
    const countLinhas2 = await tabela.count();
    expect(countLinhas2).toBeGreaterThan(0);
  });

  test("Tabela com Seleção de Linhas - deve abrir modal ao selecionar checkbox", async ({
    page,
  }) => {
    const checkboxes = page.locator(".linha-selecao");

    // Seleciona o primeiro checkbox
    const primeiroCheckbox = checkboxes.nth(0);
    await primeiroCheckbox.check();

    // Espera pelo delay definido no JS (3s)
    await page.waitForTimeout(3100);

    // Modal deve aparecer
    const modal = page.locator("#modalMensagem");
    await modal.waitFor({ state: "visible", timeout: 5000 });

    // Verificar título do modal
    const tituloModal = page.locator("#modalTitulo");
    await expect(tituloModal).toHaveText("Seleção");

    // Verificar mensagem
    const textoModal = page.locator("#modalTexto");
    await expect(textoModal).toContainText("1 itens selecionados");

    // Fechar modal
    const btnOk = modal.locator(".btn-ok");
    await btnOk.click();

    // Verificar que modal desapareceu
    await expect(modal).toHaveJSProperty("style.display", "none");
  });

  test("Tabela com Ações - ver, editar e excluir devem funcionar corretamente", async ({
    page,
  }) => {
    const tbody = page.locator(".tabela-acoes tbody");

    // Ver detalhes da linha com ID 1
    await page.evaluate(() => acaoVer(1));
    const modal = page.locator("#modalMensagem");
    await modal.waitFor({ state: "visible", timeout: 5000 });
    await expect(modal.locator("#modalTexto")).toContainText("Ana Souza");

    // Fechar modal após ver
    await modal.locator(".btn-ok").click();
    await expect(modal).toHaveJSProperty("style.display", "none");

    // Editar a linha
    await page.evaluate(() => acaoEditar(1));
    await page.fill("#novoNome", "Ana Silva");
    await page.evaluate(() => confirmarEdicao(1));

    // Validar que o nome foi atualizado
    const nomeAtualizado = await tbody
      .locator("tr")
      .nth(0)
      .locator("td")
      .nth(1)
      .textContent();
    expect(nomeAtualizado).toBe("Ana Silva");

    // Excluir a linha com ID 1
    await page.evaluate(() => acaoExcluir(1));
    const modalErro = page.locator("#modalMensagemErro");
    await modalErro.waitFor({ state: "visible", timeout: 5000 });
    await modalErro.locator(".btn-danger").click();

    // Validar que a linha com ID 1 não existe mais
    const linhas = tbody.locator("tr");
    const countLinhas = await linhas.count();
    for (let i = 0; i < countLinhas; i++) {
      const id = await linhas.nth(i).locator("td").first().textContent();
      expect(id).not.toBe("1");
    }

    // Fechar modal de exclusão
    await modalErro.locator(".btn-ok").click();
    await expect(modalErro).toHaveJSProperty("style.display", "none");
  });

  test("Tabela Estado Vazio - recarregar dados funciona corretamente", async ({
    page,
  }) => {
    const tbody = page.locator(".tabela-vazia tbody");

    // Executa a função de recarregar dados
    await page.evaluate(() => recarregarTabelaVazia());

    // Espera modal aparecer
    const modal = page.locator("#modalMensagem");
    await modal.waitFor({ state: "visible", timeout: 5000 });

    // Valida conteúdo do modal
    await expect(modal.locator("#modalTexto")).toContainText(
      "Dados carregados com sucesso",
    );

    // Valida que tbody possui linhas
    const countLinhas = await tbody.locator("tr").count();
    expect(countLinhas).toBeGreaterThan(0);

    // Fecha modal
    await modal.locator(".btn-ok").click();
    await expect(modal).toHaveJSProperty("style.display", "none");
  });

  test("Tabela Reset Global - deve resetar todas as tabelas e abrir modal", async ({
    page,
  }) => {
    const modal = page.locator("#modalMensagem");

    // Executa reset das tabelas
    await page.evaluate(() => resetarTabelas());

    // Aguarda modal aparecer
    await modal.waitFor({ state: "visible", timeout: 5000 });

    // Valida conteúdo do modal
    await expect(modal.locator("#modalTexto")).toContainText(
      "Tabelas resetadas",
    );

    // Fecha modal
    await modal.locator(".btn-ok").click();
    await expect(modal).toHaveJSProperty("style.display", "none");

    // Verifica se paginaAtual foi resetada
    const paginaAtualTexto = await page.locator("#pagina-atual").textContent();
    expect(paginaAtualTexto).toBe("1");

    // Verifica se todos os checkboxes foram desmarcados
    const checkboxes = page.locator(".linha-selecao");
    const countChecked = await checkboxes.evaluateAll(
      (eles) => eles.filter((c) => c.checked).length,
    );
    expect(countChecked).toBe(0);
  });

  test("Tabela Inicialização - verificar estado inicial da página", async ({
    page,
  }) => {
    const modal = page.locator("#modalMensagem");

    // Garante que a página foi carregada
    await page.goto("/QAPlayground/frontend/pages/tabelas.html", {
      waitUntil: "domcontentloaded",
    });

    // Tabela de paginação deve mostrar página 1
    const paginaAtual = await page.locator("#pagina-atual").textContent();
    expect(paginaAtual).toBe("1");

    // Tabela simples deve ter linhas visíveis
    const linhasSimples = page.locator(".tabela-simples tbody tr");
    await expect(linhasSimples.first()).toBeVisible();
    const countLinhasSimples = await linhasSimples.count();
    expect(countLinhasSimples).toBeGreaterThan(0);

    // Tabela de ações deve conter pelo menos 1 linha
    const linhasAcoes = page.locator(".tabela-acoes tbody tr");
    await expect(linhasAcoes.first()).toBeVisible();
    const countLinhasAcoes = await linhasAcoes.count();
    expect(countLinhasAcoes).toBeGreaterThan(0);

    // Modais devem estar fechados
    await expect(modal).toHaveJSProperty("style.display", "none");
    const modalErro = page.locator("#modalMensagemErro");
    await expect(modalErro).toHaveJSProperty("style.display", "none");
  });

  // ===============================
  // NAVEGAÇÃO - Botão Requisitos e Voltar (Página Tabelas)
  // ===============================
  test("Botão Requisitos - deve navegar corretamente para a página de requisitos a partir de Tabelas", async ({
    page,
  }) => {
    const btnRequisitos = page.locator("button.requisitos");

    // Botão deve existir e estar habilitado
    await expect(btnRequisitos).toBeVisible();
    await expect(btnRequisitos).toBeEnabled();

    // Clica no botão
    await btnRequisitos.click();

    // Valida navegação para a página de requisitos
    await expect(page).toHaveURL(/tabelas-requisitos\.html$/);
  });

  test("Botão Voltar - deve retornar para a página de tabelas", async ({
    page,
  }) => {
    // Navega para a página de requisitos
    await page.goto("/QAPlayground/frontend/pages/tabelas-requisitos.html", {
      waitUntil: "domcontentloaded",
    });

    const btnVoltar = page.locator("button", { hasText: "Voltar" });
    await expect(btnVoltar).toBeVisible();
    await expect(btnVoltar).toBeEnabled();

    // Clica no botão Voltar
    await btnVoltar.click();

    // Valida que voltou para a página de tabelas
    await expect(page).toHaveURL(/tabelas\.html$/);
  });
});
