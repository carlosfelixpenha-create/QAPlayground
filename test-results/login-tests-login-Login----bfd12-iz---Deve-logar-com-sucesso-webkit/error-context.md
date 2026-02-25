# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - button "Ativar leitura em áudio para acessibilidade" [ref=e3] [cursor=pointer]: 📢 Leitura em Áudio
  - generic [ref=e4]:
    - heading "Login" [level=1] [ref=e5]
    - generic [ref=e6]:
      - generic [ref=e7]: "Usuário*:"
      - textbox "Usuário*:" [ref=e8]:
        - /placeholder: Digite seu e-mail
        - text: joao@teste.com
      - generic [ref=e9]: "Senha*:"
      - generic [ref=e10]:
        - textbox "Senha*:" [ref=e11]:
          - /placeholder: Digite sua senha
          - text: Abc123!
        - button "Mostrar/ocultar senha" [ref=e12] [cursor=pointer]: 👁️
      - generic [ref=e13]:
        - checkbox "Sou humano" [checked] [ref=e14] [cursor=pointer]
        - generic [ref=e15] [cursor=pointer]: Sou humano
        - img "Logo Captcha" [ref=e16]
      - generic [ref=e17]:
        - button "Requisitos" [ref=e18] [cursor=pointer]
        - button "Voltar" [ref=e19] [cursor=pointer]
        - button "Entrar" [ref=e20] [cursor=pointer]
  - generic [ref=e22] [cursor=pointer]:
    - img "Conteúdo acessível em Libras usando o VLibras Widget com opções dos Avatares Ícaro, Hosana ou Guga." [ref=e23]
    - img "Conteúdo acessível em Libras usando o VLibras Widget com opções dos Avatares Ícaro, Hosana ou Guga." [ref=e24]
```