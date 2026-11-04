# Execução experimental — Cenário A

## Identificação

- `run_id`: `A-20261029-01`
- `scenario_id`: `A`
- `session_id`: `ahp-session:/3ebe3f42-94a1-4fbe-870a-900875f666bd`
- Início observado: `2026-10-29T22:55:13.186-03:00`
- Fim da validação final: `2026-10-29T23:08:35.7008994-03:00`
- Duração total decorrida: `00:13:22.5149` (`802.5149` segundos).
- Branch: `master`
- Baseline: `70fc7c8a81c870c62e93640cd4f09ebec89ee40f`
- SHA de implementação validado: `1ab049bfb1fe767d632ba503e70324813c5e9dc7`.
- SHA do snapshot de evidências usado em M4: `302ed0aea7046337de57a3af5dcce524c2245226`.
- Commits da execução: baseline `70fc7c8`, suíte RED `31b8b8a`, implementação `1ab049b`, evidências `302ed0a`.

## Ambiente

- Sistema operacional: Windows (ambiente informado pela sessão).
- Node.js: `v24.14.1`.
- npm: `11.12.1`.
- Git: `2.51.1.windows.1`.
- Repositório remoto: nenhum configurado no momento da inspeção.
- Dependências efetivamente instaladas: better-sqlite3 `12.11.1`, dotenv `17.4.2`, EJS `3.1.10`, Express `5.3.0`, Helmet `8.3.0`, ESLint `9.39.5`, globals `17.13.0`, nodemon `3.1.14`, Prettier `3.9.10`, Supertest `7.3.1`.
- Instalação limpa: `npm ci` concluiu no clone local do SHA de implementação; auditoria reportou zero vulnerabilidades.
- Reprodução: `npm run check` aprovou nesse clone, com working tree limpo.

## Execução e limites

Esta execução começou com o pedido do pesquisador para implementar o prompt versionado no baseline. O histórico desta sessão é a evidência disponível de interação; nenhuma exportação externa de conversa foi fornecida. Não serão reconstruídas mensagens, pausas, autoria ou atividades anteriores.

O tempo total é o intervalo decorrido entre o primeiro pedido observado e o fim da validação CRUD no clone limpo. Nenhuma pausa foi documentada; tempo ativo e tempo de geração da IA não podem ser inferidos do relógio ou dos commits.

A CI remota não foi executada: não havia remote GitHub. A validação local/clone não é classificada como CI.

## Validação TDD posterior — `A-20261104-01`

- Início observado: `2026-11-04T15:35:33.860-03:00`.
- Fim da validação local: `2026-11-04T15:47:13.1240506-03:00`.
- Tempo decorrido: `699.2640506 s` (`00:11:39.2640506`); pausas e tempo ativo não foram registrados.
- Branch/baseline de código: `main` / `a1a23d48ccf41f9a9c31b4ab30f9f27d829439fa`.
- Ambiente: Windows; Node.js `v24.22.2`; npm `12.2.1`.
- A primeira tentativa com Node.js `v26.13.0` falhou por incompatibilidade de ABI do módulo nativo SQLite; não foi defeito funcional. A suíte e o check completo passaram com Node.js 24.
- Nenhum código de produção foi modificado. O registro é validação posterior do ciclo histórico, não uma alegação de TDD para todo o desenvolvimento original.
- Evidências: [validação TDD](./tdd-validation.md), [execuções](./test-results.md), [eventos](./events.csv) e [logs](./logs/followup-node24-final-check.log).
