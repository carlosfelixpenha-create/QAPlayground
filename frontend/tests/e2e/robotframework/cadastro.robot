*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${URL}    https://carlosfelixpenha-create.github.io/QAPlayground/frontend/pages/cadastro.html


*** Test Cases ***
Abrir Página de Cadastro e Validar Campos
    Open Browser    ${URL}    chrome
    Maximize Browser Window
    Page Should Contain Element    id:nome
    Page Should Contain Element    id:email
    Page Should Contain Element    id:senha
    Page Should Contain Element    id:confirmarSenha
    [Teardown]    Close Browser

Cadastro Feliz - Preencher Campos e Clicar Cadastrar
    Open Browser    ${URL}    chrome
    Maximize Browser Window
    Input Text    id:nome    Joao Silva
    Input Text    id:email    joao@teste.com
    Input Text    id:senha    Abc123!
    Input Text    id:confirmarSenha    Abc123!
    Click Button    id:btnCadastrar
    [Teardown]    Close Browser

Cadastro Feliz - Validar Modal de Sucesso
    Open Browser    ${URL}    chrome
    Maximize Browser Window
    Input Text    id:nome    Joao Silva
    Input Text    id:email    joao@teste.com
    Input Text    id:senha    Abc123!
    Input Text    id:confirmarSenha    Abc123!
    Click Button    id:btnCadastrar
    Wait Until Element Is Visible    id:modalMensagem    5s
    Element Should Be Visible    id:modalMensagem
    Click Button    id:modalOk
    Wait Until Element Is Not Visible    id:modalMensagem    5s
    [Teardown]    Close Browser

Cadastro Feliz - Verificar Botões QA
    Open Browser    ${URL}    chrome
    Maximize Browser Window
    Input Text    id:nome    Joao Silva
    Input Text    id:email    joao@teste.com
    Input Text    id:senha    Abc123!
    Input Text    id:confirmarSenha    Abc123!
    Click Button    id:btnCadastrar
    Wait Until Element Is Visible    id:modalMensagem    5s
    Click Button    id:modalOk
    Wait Until Element Is Not Visible    id:modalMensagem    5s
    Element Should Be Visible    id:btnVerUsuario
    Element Should Be Visible    id:btnLimparCadastro
    [Teardown]    Close Browser

Cadastro Feliz - Validar Modal do Botão Ver Usuário
    Open Browser    ${URL}    chrome
    Maximize Browser Window
    Input Text    id:nome    Joao Silva
    Input Text    id:email    joao@teste.com
    Input Text    id:senha    Abc123!
    Input Text    id:confirmarSenha    Abc123!
    Click Button    id:btnCadastrar
    Wait Until Element Is Visible    id:modalMensagem    5s
    Click Button    id:modalOk
    Wait Until Element Is Not Visible    id:modalMensagem    5s
    Click Button    id:btnVerUsuario
    Wait Until Element Is Visible    id:modalMensagem    5s
    Element Text Should Be    id:modalTexto    Usuário salvo:\nNome: Joao Silva\nEmail: joao@teste.com
    Click Button    id:modalOk
    Wait Until Element Is Not Visible    id:modalMensagem    5s
    [Teardown]    Close Browser