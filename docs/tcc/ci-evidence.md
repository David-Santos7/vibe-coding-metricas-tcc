# Evidência de CI

- Workflow: `.github/workflows/ci.yml`.
- Jobs definidos: instalação com `npm ci`, lint, formatação e testes com cobertura nativa.
- Repositório remoto: nenhum estava configurado na inspeção local.
- Classificação do resultado: `NOT_EXECUTED`.
- `repository`, `commit_sha` de uma execução, `run_id`, URL, data da execução remota, jobs concluídos e tentativas: NÃO DISPONÍVEL — não houve execução no GitHub Actions.
- Evidência local distinta da CI: clone temporário do commit `1ab049bfb1fe767d632ba503e70324813c5e9dc7`; `npm ci` e `npm run check` concluíram com sucesso e o clone ficou sem alterações rastreadas.

A definição do workflow não é evidência de aprovação. A validação local e a reprodução em clone local estão registradas separadamente e não alteram a classificação da CI remota.

Não foi configurado hook Git local. Sem distribuição/ativação do hook e sem exportação de conversa, um hook não comprovaria prompts ou intervenções humanas e poderia produzir metadados incompletos.
