# Validação TDD posterior — Cenário A

## Escopo

Esta atividade valida posteriormente o histórico de TDD já existente no CRUD. Não afirma que todo o desenvolvimento original foi feito com TDD e não cria um ciclo artificial, pois as regras do domínio já estão implementadas e cobertas.

## Regra escolhida

Fluxo de cadastro de agendamento: a persistência deve aceitar a entidade criada e responder com o redirecionamento esperado; em caso de conflito, deve preservar o status HTTP `409`. Trata-se do comportamento funcional de criação e do limite entre Application e Infrastructure, não de uma nova RN-001 a RN-010.

## Estado inicial

O teste foi versionado antes da implementação: commit [`31b8b8a`](https://github.com/David-Santos7/vibe-coding-metricas-tcc/commit/31b8b8af34c1fe5daad97fd5fcaa593a4a4a02d9), `test: define CRUD acceptance suite before implementation`. O teste de aceitação exercitou o cadastro HTTP com SQLite.

## RED

Na tentativa comportamental registrada em `TEST-A-003`, `npm test` executou 24 testes: 22 passaram e 2 falharam. O cadastro esperava HTTP `303`, mas recebia `500`; o teste de conflito esperava `409`, mas também recebia `500`. A causa observada foi `TypeError: Named parameters can only be passed within plain objects` ao entregar a instância `Appointment` diretamente ao `better-sqlite3`. A saída está preservada em [tdd-first-implementation-attempt.log](./logs/tdd-first-implementation-attempt.log).

A execução `TEST-A-001`, que falhou ao carregar módulos ainda inexistentes, não é usada como prova do RED comportamental.

## GREEN

No commit [`1ab049b`](https://github.com/David-Santos7/vibe-coding-metricas-tcc/commit/1ab049bfb1fe767d632ba503e70324813c5e9dc7), `SQLiteAppointmentRepository` passou a converter a entidade em objeto simples nos bindings nomeados de `INSERT` e `UPDATE`. A correção está registrada como `COR-A-001`. O histórico de testes registra a execução verde de 24/24 (`TEST-A-004`); a validação posterior do commit de implementação executou 26/26, com evidência em [final-check.log](./logs/final-check.log).

## REFACTOR

Nenhuma refatoração adicional foi necessária. A conversão explícita no repositório mantém a responsabilidade de persistência na Infrastructure sem mover regras de negócio para essa camada.

## Validação posterior

O baseline desta retomada foi `a1a23d48ccf41f9a9c31b4ab30f9f27d829439fa`, branch `main`; o código de produção não foi alterado.

- A primeira execução local com Node.js `v26.13.0` falhou em 8 dos 26 testes porque o binário nativo instalado foi compilado para a ABI do Node.js 24. Não é uma falha funcional nem RED.
- Com Node.js `v24.22.2`, `npm test`: 26 aprovados, 0 reprovados.
- `npm run test:coverage`: 26 aprovados; linhas `96.49%`, branches `91.96%`, funções `93.75%`.
- `npm run lint` e `npm run format:check`: aprovados.
- `npm run check`: aprovado com 26/26, cobrindo lint, formatação e cobertura.

As saídas desta validação estão em [testes](./logs/followup-node24-test.log), [cobertura](./logs/followup-node24-coverage.log), [lint](./logs/followup-node24-lint.log), [formatação](./logs/followup-node24-format.log) e [tentativa com runtime incompatível](./logs/followup-node26-initial-attempt.log). O resultado remoto existente está em [ci-evidence.md](./ci-evidence.md).

## Conclusão e evidências Git

O histórico verificável demonstra teste primeiro, falha funcional observável, correção mínima e validação verde. Nesta retomada, a intervenção foi exclusivamente de validação e documentação; não foi criada uma nova mudança funcional nem uma nova sequência RED/GREEN/REFACTOR.

- Baseline do desenvolvimento original: `70fc7c8a81c870c62e93640cd4f09ebec89ee40f`.
- Testes anteriores à implementação: `31b8b8af34c1fe5daad97fd5fcaa593a4a4a02d9`.
- Implementação e correção: `1ab049bfb1fe767d632ba503e70324813c5e9dc7`.
- Código validado nesta retomada: `a1a23d48ccf41f9a9c31b4ab30f9f27d829439fa`.
- Registros completos e limitações: [test-results.md](./test-results.md), [corrections.csv](./corrections.csv), [events.csv](./events.csv) e [metrics-summary.md](./metrics-summary.md).
