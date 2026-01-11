/**
 * @jest-environment jsdom
 *
 * Testes de integração para formulario-1.js
 * Validam o fluxo completo de cadastro de endereço
 */

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

describe("Fluxo de integração - cadastro de endereço", () => {
  test("usuário tenta salvar com campo vazio", () => {
    document.getElementById("logradouro").value = "";
    const event = { preventDefault: jest.fn() };
    executarEndereco(event);
    expect(document.getElementById("modalTextoErro").textContent).toContain(
      "Logradouro"
    );
  });

  test("usuário tenta salvar com UF inválida", () => {
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

  test("usuário tenta salvar com CEP inválido", () => {
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

  test("usuário salva endereço válido", () => {
    document.getElementById("logradouro").value = "Rua A";
    document.getElementById("numero").value = "10";
    document.getElementById("bairro").value = "Centro";
    document.getElementById("cidade").value = "Curitiba";
    document.getElementById("estado").value = "pr";
    document.getElementById("cep").value = "80000-000";

    const event = { preventDefault: jest.fn() };
    executarEndereco(event);

    expect(document.getElementById("modalTexto").textContent).toContain(
      "sucesso"
    );
    expect(document.getElementById("btnSalvar").disabled).toBe(true);
    expect(document.getElementById("btnVerEndereco").style.display).toBe(
      "inline-block"
    );
    expect(document.getElementById("btnLimparEndereco").style.display).toBe(
      "inline-block"
    );
  });
});

describe("Fluxo de integração - ver e limpar endereço", () => {
  test("usuário clica em Ver Endereço sem nada salvo", () => {
    verEnderecoSalvo();
    expect(document.getElementById("modalTextoErro").textContent).toContain(
      "Nenhum endereço salvo"
    );
  });

  test("usuário clica em Ver Endereço com dados salvos", () => {
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

  test("usuário clica em Limpar Endereço", () => {
    localStorage.setItem("endereco", "{}");
    limparEndereco();
    expect(localStorage.getItem("endereco")).toBe(null);
    expect(document.getElementById("btnSalvar").disabled).toBe(false);
    expect(document.getElementById("btnVerEndereco").style.display).toBe(
      "none"
    );
    expect(document.getElementById("modalTexto").textContent).toContain(
      "limpo com sucesso"
    );
  });
});

describe("Fluxo de integração - máscara de CEP", () => {
  test("usuário digita CEP completo", () => {
    const input = document.getElementById("cep");
    input.value = "12345678";
    mascaraCep(input);
    expect(input.value).toBe("12345-678");
  });

  test("usuário digita CEP parcial", () => {
    const input = document.getElementById("cep");
    input.value = "1234";
    mascaraCep(input);
    expect(input.value).toBe("1234");
  });
});
