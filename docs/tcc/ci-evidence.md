# Evidência de CI

## Snapshot inicial

Na redação original deste registro, não havia remote configurado e a classificação era `NOT_EXECUTED`. Essa observação histórica é mantida; a existência do workflow, por si só, não comprovava aprovação.

## Execução remota verificada

- Repositório: `David-Santos7/vibe-coding-metricas-tcc`.
- Workflow: `CI` (`.github/workflows/ci.yml`).
- Branch/evento: `main` / `push`.
- Commit: `a1a23d48ccf41f9a9c31b4ab30f9f27d829439fa`.
- Run ID: `40992827465`; tentativa: `1`; classificação: `SUCCESS`.
- URL: https://github.com/David-Santos7/vibe-coding-metricas-tcc/actions/runs/40992827465
- Job `validate`: `SUCCESS`, em `ubuntu-latest`.
- Passos concluídos: checkout, setup Node.js 24, `npm ci`, lint, formatação, testes com cobertura nativa e upload do log.
- Início: `2026-10-30T02:38:06Z`; conclusão: `2026-10-30T02:38:26Z`.

## Execução da validação posterior

- Repositório: `David-Santos7/vibe-coding-metricas-tcc`.
- Workflow: `CI`, run `41890757033`, número `2`, tentativa `1`.
- Branch/evento: `main` / `push`.
- Commit: `22e6baf26e8cbf0a70e3837f2682269fa876eea5`.
- Classificação: `SUCCESS`; job `validate` em `ubuntu-latest`.
- URL: https://github.com/David-Santos7/vibe-coding-metricas-tcc/actions/runs/41890757033
- Checkout, setup Node.js 24, `npm ci`, lint, formatação, testes com cobertura e upload do log: todos `SUCCESS`.
- Início: `2026-11-04T18:48:30Z`; conclusão: `2026-11-04T18:48:46Z`.

## Validação local posterior

A validação deste registro foi feita no SHA `a1a23d48ccf41f9a9c31b4ab30f9f27d829439fa`, sem alterações no código da aplicação. Node.js 26 inicialmente não pôde carregar o módulo nativo `better-sqlite3` compilado para Node.js 24; essa falha ambiental não foi classificada como defeito do CRUD nem como RED de TDD. Sob Node.js `v24.22.2`, `npm test`, `npm run test:coverage`, `npm run lint`, `npm run format:check` e `npm run check` passaram. Saídas: [tentativa incompatível](./logs/followup-node26-initial-attempt.log), [testes](./logs/followup-node24-test.log), [cobertura](./logs/followup-node24-coverage.log), [lint](./logs/followup-node24-lint.log), [formatação](./logs/followup-node24-format.log) e [check final](./logs/followup-node24-final-check.log).

O histórico remoto e execuções posteriores podem ser consultados na página de Actions do repositório. A reprodução local não é classificada como CI.

Não foi configurado hook Git local. Sem distribuição/ativação do hook e sem exportação de conversa, um hook não comprovaria prompts ou intervenções humanas e poderia produzir metadados incompletos.
