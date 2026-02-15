const { test, expect } = require("@playwright/test");

test("Home - validação da chamada e botões do menu", async ({
  page,
  browserName,
}) => {
  // Aumenta timeout do teste completo
  test.setTimeout(60000);

  // 1️⃣ Abrir página inicial
  await page.goto("/QAPlayground/");

  // 🔹 Log da URL inicial
  console.log("URL inicial aberta:", page.url());

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

  for (const nomeBotao of botoesMenu) {
    const botao = page.getByRole("button", { name: nomeBotao });

    // Espera o botão estar visível e habilitado, até 10s
    await expect(botao).toBeVisible({ timeout: 10000 });

    // Se for Firefox, rola até o botão antes de qualquer interação futura
    if (browserName === "firefox") {
      await botao.scrollIntoViewIfNeeded();
    }
  }
});
