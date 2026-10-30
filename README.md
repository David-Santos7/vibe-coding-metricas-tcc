# Sistema de agendamentos

Aplicação monolítica Node.js para cadastrar, consultar, editar e excluir agendamentos. O servidor Express renderiza páginas EJS; regras e persistência são organizadas em camadas com SQLite.

## Requisitos

- Node.js 24.x
- npm 11.x (ou versão compatível com `npm ci`)

## Executar

```powershell
npm ci
Copy-Item .env.example .env
npm start
```

A aplicação fica em `http://localhost:3000`. O banco SQLite é criado automaticamente em `data/appointments.db`; esse arquivo local é ignorado pelo Git. `PORT` e `DB_FILE` podem ser configurados no ambiente.

## Validar

```powershell
npm test
npm run test:coverage
npm run lint
npm run format:check
npm run check
```

Os testes de integração e HTTP usam SQLite em memória. A cobertura nativa do Node.js inclui arquivos JavaScript carregados de `src/`; os relatórios não definem um percentual mínimo.

## Arquitetura

- `src/domain`: entidade e invariantes.
- `src/application`: casos de uso e contrato de repositório.
- `src/infrastructure`: SQLite e implementação do repositório.
- `src/presentation`: controllers, rotas, middleware, views EJS e arquivos estáticos.
- `src/main`: composição manual e inicialização do servidor.
- `tests`: testes unitários, de integração, HTTP, arquitetura e doubles.
- `docs/tcc`: baseline, evidências e métricas observacionais do experimento.

As regras temporais usam `America/Sao_Paulo`; os testes injetam um relógio fixo. O SQLite também impõe unicidade de data e horário.

## Histórico experimental

O prompt e a evolução estão preservados em commits Git. Consulte [baseline e execução](docs/tcc/baseline.md), [eventos](docs/tcc/events.csv), [testes](docs/tcc/test-results.md) e [métricas](docs/tcc/metrics-summary.md). A CI está definida em `.github/workflows/ci.yml`; aprovação só será registrada após uma execução real no GitHub Actions.
