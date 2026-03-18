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

Cadastro QAPlayground - Avaliar Plataforma (1 a 5 estrelas)
    Open Browser    https://carlosfelixpenha-create.github.io/QAPlayground/    chrome
    Maximize Browser Window
    Click Button    xpath://button[@onclick='abrirModalAvaliacao()']
    Wait Until Element Is Visible    id:modal-avaliacao    5s

    Click Element    xpath://div[@id='estrelas']/span[1]
    Element Text Should Be    xpath://div[@id='estrelas']/span[1]    ★

    Click Element    xpath://div[@id='estrelas']/span[2]
    Element Text Should Be    xpath://div[@id='estrelas']/span[2]    ★

    Click Element    xpath://div[@id='estrelas']/span[3]
    Element Text Should Be    xpath://div[@id='estrelas']/span[3]    ★

    Click Element    xpath://div[@id='estrelas']/span[4]
    Element Text Should Be    xpath://div[@id='estrelas']/span[4]    ★

    Click Element    xpath://div[@id='estrelas']/span[5]
    Element Text Should Be    xpath://div[@id='estrelas']/span[5]    ★

    Click Element    xpath://div[@id='modal-avaliacao']//span[@class='close']
    Wait Until Element Is Not Visible    id:modal-avaliacao    5s
    [Teardown]    Close Browser

Cadastro QAPlayground - Avaliar Plataforma (2 a 5 estrelas)
    Open Browser    https://carlosfelixpenha-create.github.io/QAPlayground/    chrome
    Maximize Browser Window
    Click Button    xpath://button[@onclick='abrirModalAvaliacao()']
    Wait Until Element Is Visible    id:modal-avaliacao    5s

    # Avaliando 2 estrelas
    Click Element    xpath://div[@id='estrelas']/span[2]
    Element Text Should Be    xpath://div[@id='estrelas']/span[1]    ★
    Element Text Should Be    xpath://div[@id='estrelas']/span[2]    ★

    # Avaliando 3 estrelas
    Click Element    xpath://div[@id='estrelas']/span[3]
    Element Text Should Be    xpath://div[@id='estrelas']/span[1]    ★
    Element Text Should Be    xpath://div[@id='estrelas']/span[2]    ★
    Element Text Should Be    xpath://div[@id='estrelas']/span[3]    ★

    # Avaliando 4 estrelas
    Click Element    xpath://div[@id='estrelas']/span[4]
    Element Text Should Be    xpath://div[@id='estrelas']/span[1]    ★
    Element Text Should Be    xpath://div[@id='estrelas']/span[2]    ★
    Element Text Should Be    xpath://div[@id='estrelas']/span[3]    ★
    Element Text Should Be    xpath://div[@id='estrelas']/span[4]    ★

    # Avaliando 5 estrelas
    Click Element    xpath://div[@id='estrelas']/span[5]
    Element Text Should Be    xpath://div[@id='estrelas']/span[1]    ★
    Element Text Should Be    xpath://div[@id='estrelas']/span[2]    ★
    Element Text Should Be    xpath://div[@id='estrelas']/span[3]    ★
    Element Text Should Be    xpath://div[@id='estrelas']/span[4]    ★
    Element Text Should Be    xpath://div[@id='estrelas']/span[5]    ★

    Click Element    xpath://div[@id='modal-avaliacao']//span[@class='close']
    Wait Until Element Is Not Visible    id:modal-avaliacao    5s
    [Teardown]    Close Browser
    
Cadastro QAPlayground - Abrir Modal de Avaliação
    Open Browser    https://carlosfelixpenha-create.github.io/QAPlayground/    chrome
    Maximize Browser Window
    Click Button    xpath://button[@onclick='abrirModalAvaliacao()']
    Wait Until Element Is Visible    id:modal-avaliacao    5s
    Element Should Be Visible       id:modal-avaliacao
    Click Element    xpath://div[@id='modal-avaliacao']//span[@class='close']
    Wait Until Element Is Not Visible    id:modal-avaliacao    5s
    [Teardown]    Close Browser

Cadastro QAPlayground - Modal Contatos e Validação de Links
    Open Browser    https://carlosfelixpenha-create.github.io/QAPlayground/    chrome
    Maximize Browser Window
    Click Button    id:btnContatos
    Wait Until Element Is Visible    id:modal-contatos    5s

    # Validar links dentro do modal usando contains(@href)
    Element Should Be Visible    xpath://div[@id='modal-contatos']//a[contains(@href,'linkedin.com/in/carlos-f')]
    Element Should Be Visible    xpath://div[@id='modal-contatos']//a[contains(@href,'Portfolio')]
    Element Should Be Visible    xpath://div[@id='modal-contatos']//a[contains(@href,'github.com/carlosfelixpenha-create')]

    # Fechar modal
    Click Button    id:modalContatosOk
    Wait Until Element Is Not Visible    id:modal-contatos    5s
    [Teardown]    Close Browser

