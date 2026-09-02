# Teste de Nivelamento — SESP (área administrativa)

Teste diagnóstico de **30 questões** sobre análise de dados, estatística, planilhas,
Power BI, visualização e IA generativa, para os servidores da **área administrativa
da SESP** (gestão, planejamento, finanças, pessoal e apoio — **não a atividade
policial**).

Site estático (GitHub Pages). Duas telas:

- **Responder o teste** — o aluno abre o link, se identifica, responde e vê o
  próprio desempenho por tema.
- **Painel de análise** — protegido por senha, mostra os gráficos consolidados da
  turma: distribuição por nível, acerto médio por tema, acerto por questão,
  acerto por dificuldade e a tabela de respondentes (com exportação em CSV).

## Como está organizado

| Arquivo | Função |
|---|---|
| `index.html` | o teste + o painel |
| `config.js` | onde você cola a URL do coletor e as senhas |
| `apps-script.gs` | código do coletor de respostas (Google Apps Script) |

## 1. Publicar no GitHub Pages

No repositório: **Settings → Pages → Build and deployment → Source: `Deploy from a
branch` → Branch: `main` / `/ (root)` → Save**.

Em 1–2 minutos o link fica disponível em:

```
https://renato0503.github.io/Teste_Nivelamento_Sesp/
```

Esse é o link que vai para os alunos.

## 2. Ligar a coleta automática das respostas (recomendado)

Sem isso, o teste funciona no **modo código**: cada aluno recebe um código no final
e envia para você, que cola os códigos no painel (botão *Colar códigos*). Funciona,
mas dá trabalho. Para receber as respostas automaticamente:

1. Crie uma **Planilha Google** nova.
2. Nela: menu **Extensões → Apps Script**.
3. Apague o conteúdo e cole todo o arquivo `apps-script.gs`.
4. Troque o valor de `TOKEN` por um texto só seu.
5. Menu **Implantar → Nova implantação → App da Web**:
   - *Executar como:* **Eu**
   - *Quem pode acessar:* **Qualquer pessoa**
6. Autorize e **copie a URL do app da Web**.
7. Edite `config.js` neste repositório:

```js
window.NIV_CONFIG = {
  apiUrl: "COLE_AQUI_A_URL_DO_APP_DA_WEB",
  token: "o_mesmo_TOKEN_do_apps-script",
  painelSenha: "sesp-dados",
};
```

8. Faça commit. Pronto: as respostas passam a cair na planilha e a aparecer no
   painel automaticamente (atualiza a cada 25s ou no botão *Atualizar*).

## 3. Senha do painel

Padrão: **`sesp-dados`**. Troque em `config.js`, campo `painelSenha`.
(O painel é apenas uma barreira simples — não guarde nada sigiloso aqui; o teste
pede só nome, setor e as respostas.)

## Critério de nível

| Acerto | Nível |
|---|---|
| ≥ 85% | Avançado |
| 65–84% | Intermediário |
| 40–64% | Básico |
| < 40% | Iniciante |

## Temas (gabarito no `index.html`, lista `Q`)

A. Fundamentos de Dados · B. Estatística · C. Planilhas ·
D. Visualização e Comunicação · E. Power BI e Ferramentas · F. IA Generativa e Prompts
