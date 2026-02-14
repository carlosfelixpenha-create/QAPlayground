const { test, expect } = require("@playwright/test");

test("Home - validação da chamada e botões do menu", async ({
  page,
  browserName,
}) => {
  // Aumenta timeout do teste completo
  test.setTimeout(60000);

  await page.goto("/QAPlayground/");

  const botoesMenu = [
    /Cadastro/,
    /Login/,
    /Formulário 1/,
    /Formulário 2/,
    /Formulário 3/,
    /Botões/,
    /Modais/,
    /Tabelas/,
    /Arrastando Imagens/,
    /Quebra Cabeças/,
    /Quebra Cabeça 104pcs/,
    /Acessibilidades/,
    /Instruções\/Testes/,
    /Referências/,
    /Avaliar Plataforma/,
    /Sugestões/,
  ];

  for (const [index, nomeBotao] of botoesMenu.entries()) {
    const botao = page.getByRole("button", { name: nomeBotao });

    // Falha proposital apenas no primeiro botão
    if (index === 0) {
      await expect(botao).toHaveCount(999); // impossível, vai falhar
    } else {
      // Espera o botão estar visível e habilitado, até 10s
      await expect(botao).toBeVisible({ timeout: 10000 });
    }

    // Se for Firefox, rola até o botão antes de qualquer interação futura
    if (browserName === "firefox") {
      await botao.scrollIntoViewIfNeeded();
    }
  }
});
