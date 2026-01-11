/**
 * @jest-environment jsdom
 *
 * Testes unitários para formulario-1.js
 */

// Cria o DOM ANTES de importar formulario-1.js
document.body.innerHTML = `
  <div id="modalMensagem" style="display:none"></div>
  <div id="modalTexto"></div>
  <button id="modalFechar"></button>
  <button id="modalOk"></button>

  <div id="modalMensagemErro" style="display:none"></div>
  <div id="modalTextoErro"></div>
  <button id="modalFecharErro"></button>
  <button id="modalOkErro"></button>

  <form class="form-container">
    <input id="logradouro" />
    <input id="numero" />
    <input id="complemento" />
    <input id="bairro" />
    <input id="cidade" />
    <input id="estado" />
    <input id="cep" />
    <button id="btnSalvar"></button>
  </form>
  <button id="btnVerEndereco" style="display:none"></button>
  <button id="btnLimparEndereco" style="display:none"></button>
`;

const {
  executarEndereco,
  verEnderecoSalvo,
  limparEndereco,
  mascaraCep,
} = require("../formulario-1");

beforeEach(() => {
  document.body.innerHTML = `
    <div id="modalMensagem" style="display:none"></div>
    <div id="modalTexto"></div>
    <button id="modalFechar"></button>
    <button id="modalOk"></button>

    <div id="modalMensagemErro" style="display:none"></div>
    <div id="modalTextoErro"></div>
    <button id="modalFecharErro"></button>
    <button id="modalOkErro"></button>

    <form class="form-container">
      <input id="logradouro" />
      <input id="numero" />
      <input id="complemento" />
      <input id="bairro" />
      <input id="cidade" />
      <input id="estado" />
      <input id="cep" />
      <button id="btnSalvar"></button>
    </form>
    <button id="btnVerEndereco" style="display:none"></button>
    <button id="btnLimparEndereco" style="display:none"></button>
  `;

  // Mock localStorage
  const store = {};
  global.localStorage = {
    getItem: (key) => (key in store ? store[key] : null),
    setItem: (key, value) => (store[key] = value),
    removeItem: (key) => delete store[key],
    clear: () => Object.keys(store).forEach((key) => delete store[key]),
  };

  localStorage.clear();
});

describe("Função executarEndereco", () => {
  test("deve mostrar erro se campo obrigatório vazio", () => {
    document.getElementById("logradouro").value = "";
    const event = { preventDefault: jest.fn() };
    executarEndereco(event);
    expect(document.getElementById("modalTextoErro").textContent).toContain(
      "Logradouro"
    );
  });

  test("deve mostrar erro se logradouro for apenas números", () => {
    document.getElementById("logradouro").value = "12345";
    document.getElementById("numero").value = "10";
    document.getElementById("bairro").value = "Centro";
    document.getElementById("cidade").value = "Curitiba";
    document.getElementById("estado").value = "PR";
    document.getElementById("cep").value = "80000000";

    const event = { preventDefault: jest.fn() };
    executarEndereco(event);
    expect(document.getElementById("modalTextoErro").textContent).toContain(
      "Logradouro"
    );
  });

  test("deve mostrar erro se número contiver letras", () => {
    document.getElementById("logradouro").value = "Rua A";
    document.getElementById("numero").value = "10A";
    document.getElementById("bairro").value = "Centro";
    document.getElementById("cidade").value = "Curitiba";
    document.getElementById("estado").value = "PR";
    document.getElementById("cep").value = "80000000";

    const event = { preventDefault: jest.fn() };
    executarEndereco(event);
    expect(document.getElementById("modalTextoErro").textContent).toContain(
      "Número"
    );
  });

  test("deve mostrar erro se bairro tiver menos de 3 caracteres", () => {
    document.getElementById("logradouro").value = "Rua A";
    document.getElementById("numero").value = "10";
    document.getElementById("bairro").value = "AB";
    document.getElementById("cidade").value = "Curitiba";
    document.getElementById("estado").value = "PR";
    document.getElementById("cep").value = "80000000";

    const event = { preventDefault: jest.fn() };
    executarEndereco(event);
    expect(document.getElementById("modalTextoErro").textContent).toContain(
      "Bairro"
    );
  });

  test("deve mostrar erro se cidade tiver menos de 3 caracteres", () => {
    document.getElementById("logradouro").value = "Rua A";
    document.getElementById("numero").value = "10";
    document.getElementById("bairro").value = "Centro";
    document.getElementById("cidade").value = "AB";
    document.getElementById("estado").value = "PR";
    document.getElementById("cep").value = "80000000";

    const event = { preventDefault: jest.fn() };
    executarEndereco(event);
    expect(document.getElementById("modalTextoErro").textContent).toContain(
      "Cidade"
    );
  });

  test("deve mostrar erro se estado não tiver 2 caracteres", () => {
    document.getElementById("logradouro").value = "Rua A";
    document.getElementById("numero").value = "10";
    document.getElementById("bairro").value = "Centro";
    document.getElementById("cidade").value = "Curitiba";
    document.getElementById("estado").value = "Parana";
    document.getElementById("cep").value = "80000000";

    const event = { preventDefault: jest.fn() };
    executarEndereco(event);
    expect(document.getElementById("modalTextoErro").textContent).toContain(
      "Estado"
    );
  });

  test("deve mostrar erro se UF inválida", () => {
    document.getElementById("logradouro").value = "Rua A";
    document.getElementById("numero").value = "10";
    document.getElementById("bairro").value = "Centro";
    document.getElementById("cidade").value = "Curitiba";
    document.getElementById("estado").value = "XX";
    document.getElementById("cep").value = "80000000";

    const event = { preventDefault: jest.fn() };
    executarEndereco(event);
    expect(document.getElementById("modalTextoErro").textContent).toContain(
      "UF inválida"
    );
  });

  test("deve mostrar erro se CEP inválido", () => {
    document.getElementById("logradouro").value = "Rua A";
    document.getElementById("numero").value = "10";
    document.getElementById("bairro").value = "Centro";
    document.getElementById("cidade").value = "Curitiba";
    document.getElementById("estado").value = "PR";
    document.getElementById("cep").value = "123";

    const event = { preventDefault: jest.fn() };
    executarEndereco(event);
    expect(document.getElementById("modalTextoErro").textContent).toContain(
      "CEP"
    );
  });

  test("deve salvar endereço válido no localStorage", () => {
    document.getElementById("logradouro").value = "Rua A";
    document.getElementById("numero").value = "10";
    document.getElementById("bairro").value = "Centro";
    document.getElementById("cidade").value = "Curitiba";
    document.getElementById("estado").value = "pr";
    document.getElementById("cep").value = "80000-000";

    const event = { preventDefault: jest.fn() };
    executarEndereco(event);

    const salvo = JSON.parse(localStorage.getItem("endereco"));
    expect(salvo).toMatchObject({
      logradouro: "Rua A",
      numero: "10",
      bairro: "Centro",
      cidade: "Curitiba",
      estado: "PR",
      cep: "80000-000",
    });
    expect(document.getElementById("btnSalvar").disabled).toBe(true);
    expect(document.getElementById("btnVerEndereco").style.display).toBe(
      "inline-block"
    );
  });
});

describe("Função verEnderecoSalvo", () => {
  test("deve mostrar mensagem se não houver endereço salvo", () => {
    verEnderecoSalvo();
    expect(document.getElementById("modalTextoErro").textContent).toContain(
      "Nenhum endereço salvo"
    );
  });

  test("deve mostrar endereço salvo formatado", () => {
    localStorage.setItem(
      "endereco",
      JSON.stringify({
        logradouro: "Rua A",
        numero: "10",
        bairro: "Centro",
        cidade: "Curitiba",
        estado: "PR",
        cep: "80000-000",
      })
    );
    verEnderecoSalvo();
    expect(document.getElementById("modalTexto").textContent).toContain(
      "Curitiba/PR"
    );
  });
});

describe("Função limparEndereco", () => {
  test("deve limpar localStorage e reabilitar campos", () => {
    localStorage.setItem("endereco", "{}");
    limparEndereco();
    expect(localStorage.getItem("endereco")).toBe(null);
    expect(document.getElementById("btnSalvar").disabled).toBe(false);
    expect(document.getElementById("btnVerEndereco").style.display).toBe(
      "none"
    );
  });
});

describe("Função mascaraCep", () => {
  test("deve formatar CEP com traço após 5 dígitos", () => {
    const input = document.getElementById("cep");
    input.value = "12345678";
    mascaraCep(input);
    expect(input.value).toBe("12345-678");
  });

  test("deve manter apenas números", () => {
    const input = document.getElementById("cep");
    input.value = "12a34b";
    mascaraCep(input);
    expect(input.value).toBe("1234");
  });

  test("deve deixar valor parcial sem traço se menor que 6 dígitos", () => {
    const input = document.getElementById("cep");
    input.value = "1234";
    mascaraCep(input);
    expect(input.value).toBe("1234");
  });
});
