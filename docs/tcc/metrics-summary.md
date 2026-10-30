# Métricas do experimento — Cenário A

`run_id`: `A-20261029-01`

`session_id`: `ahp-session:/3ebe3f42-94a1-4fbe-870a-900875f666bd`

Baseline: `70fc7c8a81c870c62e93640cd4f09ebec89ee40f`

SHA de implementação validado: `1ab049bfb1fe767d632ba503e70324813c5e9dc7`

| Indicador                 | Valor e unidade                                                                | Estado                          | Fonte e período                                                    | Completude/limitações                                                                        |
| ------------------------- | ------------------------------------------------------------------------------ | ------------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| M1 — Prompts              | 1 mensagem explícita observada                                                 | PARCIALMENTE MEDIDO             | `ai-interaction-log.md`; início da sessão                          | Sem exportação independente completa                                                         |
| M2 — Tempo                | `802.5149 s` decorridos (`00:13:22.5149`)                                      | MEDIDO para tempo decorrido     | `experiment-run.md`; 22:55:13.186–23:08:35.7008994 -03:00          | Pausas não documentadas; tempo ativo e geração da IA não são inferíveis                      |
| M3 — Correções            | 1 defeito funcional corrigido                                                  | MEDIDO para evidência observada | `corrections.csv`; implementação e testes                          | Não infere defeitos ou intervenções fora desta execução                                      |
| M4 — Arquivos             | 56 únicos adicionados: 27 aplicação, 6 testes, 9 configuração, 14 documentação | MEDIDO                          | Diff Git `70fc7c8..1ab049b`                                        | 0 modificados, removidos ou renomeados; exclui banco local, dependências e caches            |
| M5 — Testes               | 9 execuções registradas; validação final: 26/26 aprovados                      | PARCIALMENTE MEDIDO             | `test-results.md`; comparação no SHA `1ab049b`                     | Horários e SHA de working trees anteriores ao commit indisponíveis; mantidos como tal        |
| M6 — Cobertura            | Linhas `96.49%`; branches `91.96%`; funções `93.75%`                           | MEDIDO no SHA de implementação  | Node.js `v24.14.1`; `npm run check`; [log](./logs/final-check.log) | 15 módulos carregados; JavaScript do navegador não instrumentado; sem limite mínimo          |
| M7 — CI                   | `NOT_EXECUTED`                                                                 | NÃO EXECUTADO                   | `.github/workflows/ci.yml`; execução remota                        | Nenhum remote GitHub ou run disponível                                                       |
| M8 — Intervenções humanas | 1 prompt; 0 edições diretas de código observadas                               | PARCIALMENTE MEDIDO             | `human-interventions.csv`; histórico desta sessão                  | Não atribuir autoria usando apenas identidade do commit; sem exportação de atividade externa |

## Arquivos instrumentados em M6

Incluídos pelo runner (módulos carregados durante os testes): `src/application/{CreateAppointment,DeleteAppointment,GetAppointment,ListAppointments,UpdateAppointment,isAppointmentInPast}.js`, `src/domain/{Appointment,errors}.js`, `src/infrastructure/database/database.js`, `src/infrastructure/repositories/SQLiteAppointmentRepository.js`, `src/main/{app,compositionRoot}.js` e `src/presentation/{controllers/appointmentController,middlewares/errorHandler,routes/appointmentRoutes}.js`.

Não instrumentado: `src/presentation/public/app.js`, pois é JavaScript executado no navegador e não foi carregado pelo runner Node.js. Views EJS, CSS, testes e arquivos estáticos não-JavaScript também não fazem parte do padrão `src/**/*.js`.

## Reprodução

O commit de implementação foi clonado localmente; `npm ci` instalou as versões do lockfile e `npm run check` terminou com código zero. Logs: [instalação limpa](./logs/clean-clone-install.log) e [check final](./logs/final-check.log). Esta reprodução local não é CI remota.

Não há limiar de cobertura ou inferência causal entre metodologia e qualidade. Valores desconhecidos não são convertidos em zero. Consulte os registros e logs vinculados para evidências por execução.
