# Evidência de CI

- Workflow: `.github/workflows/ci.yml`.
- Jobs definidos: instalação com `npm ci`, lint, formatação e testes com cobertura nativa.
- Repositório remoto: nenhum estava configurado na inspeção local.
- Classificação do resultado: `NOT_EXECUTED`.
- `repository`, `commit_sha` de uma execução, `run_id`, URL, data da execução remota, jobs concluídos e tentativas: NÃO DISPONÍVEL — não houve execução no GitHub Actions.

A definição do workflow não é evidência de aprovação. A validação local e a reprodução em clone local, se realizadas, estão registradas separadamente e não alteram a classificação da CI remota.

Não foi configurado hook Git local. Sem distribuição/ativação do hook e sem exportação de conversa, um hook não comprovaria prompts ou intervenções humanas e poderia produzir metadados incompletos.
