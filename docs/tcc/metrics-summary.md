# Métricas do experimento — Cenário A

`run_id`: `A-20261029-01`

`session_id`: `ahp-session:/3ebe3f42-94a1-4fbe-870a-900875f666bd`

Baseline: `70fc7c8a81c870c62e93640cd4f09ebec89ee40f`

SHA de implementação validado: `1ab049bfb1fe767d632ba503e70324813c5e9dc7`

Snapshot Git usado para fechar M4: `302ed0aea7046337de57a3af5dcce524c2245226` (o commit posterior só atualiza esta discriminação).

| Indicador                 | Valor e unidade                                                                | Estado                          | Fonte e período                                                                                                  | Completude/limitações                                                                                    |
| ------------------------- | ------------------------------------------------------------------------------ | ------------------------------- | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| M1 — Prompts              | 1 mensagem explícita observada                                                 | PARCIALMENTE MEDIDO             | `ai-interaction-log.md`; início da sessão                                                                        | Sem exportação independente completa                                                                     |
| M2 — Tempo                | `802.5149 s` decorridos (`00:13:22.5149`)                                      | MEDIDO para tempo decorrido     | `experiment-run.md`; 22:55:13.186–23:08:35.7008994 -03:00                                                        | Pausas não documentadas; tempo ativo e geração da IA não são inferíveis                                  |
| M3 — Correções            | 1 defeito funcional corrigido                                                  | MEDIDO para evidência observada | `corrections.csv`; implementação e testes                                                                        | Não infere defeitos ou intervenções fora desta execução                                                  |
| M4 — Arquivos             | 58 únicos adicionados: 27 aplicação, 6 testes, 9 configuração, 16 documentação | MEDIDO                          | Diff Git `70fc7c8..302ed0a`                                                                                      | 0 modificados, removidos ou renomeados; exclui banco local, dependências e caches                        |
| M5 — Testes               | 9 execuções registradas; validação final: 26/26 aprovados                      | PARCIALMENTE MEDIDO             | `test-results.md`; código validado em `1ab049b`                                                                  | Horários e SHA de working trees anteriores ao commit indisponíveis; mantidos como tal                    |
| M6 — Cobertura            | Linhas `96.49%`; branches `91.96%`; funções `93.75%`                           | MEDIDO no SHA de implementação  | Node.js `v24.14.1`; `npm run check`; [log](./logs/final-check.log)                                               | 15 módulos carregados; JavaScript do navegador não instrumentado; sem limite mínimo                      |
| M7 — CI                   | `SUCCESS` no run `41890757033`, SHA `22e6baf26e8cbf0a70e3837f2682269fa876eea5` | MEDIDO                          | [GitHub Actions](https://github.com/David-Santos7/vibe-coding-metricas-tcc/actions/runs/41890757033); 2026-11-04 | O snapshot inicial `302ed0a` registrava `NOT_EXECUTED`; esta atualização usa a execução remota observada |
| M8 — Intervenções humanas | 1 prompt; 0 edições diretas de código observadas                               | PARCIALMENTE MEDIDO             | `human-interventions.csv`; histórico desta sessão                                                                | Não atribuir autoria usando apenas identidade do commit; sem exportação de atividade externa             |

## Arquivos instrumentados em M6

Incluídos pelo runner (módulos carregados durante os testes): `src/application/{CreateAppointment,DeleteAppointment,GetAppointment,ListAppointments,UpdateAppointment,isAppointmentInPast}.js`, `src/domain/{Appointment,errors}.js`, `src/infrastructure/database/database.js`, `src/infrastructure/repositories/SQLiteAppointmentRepository.js`, `src/main/{app,compositionRoot}.js` e `src/presentation/{controllers/appointmentController,middlewares/errorHandler,routes/appointmentRoutes}.js`.

Não instrumentado: `src/presentation/public/app.js`, pois é JavaScript executado no navegador e não foi carregado pelo runner Node.js. Views EJS, CSS, testes e arquivos estáticos não-JavaScript também não fazem parte do padrão `src/**/*.js`.

## Reprodução

O commit de implementação foi clonado localmente; `npm ci` instalou as versões do lockfile e `npm run check` terminou com código zero. Logs: [instalação limpa](./logs/clean-clone-install.log) e [check final](./logs/final-check.log). O snapshot de evidências M4 inclui esses dois logs; esta reprodução local não é CI remota.

Não há limiar de cobertura ou inferência causal entre metodologia e qualidade. Valores desconhecidos não são convertidos em zero. Consulte os registros e logs vinculados para evidências por execução.

## Validação posterior — `A-20261104-01`

Esta retomada validou a implementação existente e documentou o ciclo TDD já registrado; não alterou arquivos de produção.

| Indicador                 | Resultado observado                                                                         | Estado e limites                                                             |
| ------------------------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| M1 — Prompts              | 1 solicitação explícita observada nesta conversa                                            | PARCIALMENTE MEDIDO; sem exportação independente                             |
| M2 — Tempo                | `699.264 s` decorridos (`00:11:39.264`), de `15:35:33.860` a `15:47:13.124 -03:00`          | MEDIDO para tempo decorrido; pausas e tempo ativo não foram registrados      |
| M3 — Correções            | Nenhuma correção de código nesta retomada                                                   | MEDIDO para esta retomada; falha inicial foi incompatibilidade do runtime    |
| M4 — Arquivos             | 17 únicos: 8 adicionados e 9 modificados; nenhum arquivo de aplicação ou teste              | MEDIDO pelo diff Git desta retomada; sem remoções ou renomeações             |
| M5 — Testes               | `npm test`, cobertura e `npm run check`: 26/26; lint e formatação aprovados em Node 24.22.2 | MEDIDO; a tentativa Node.js 26 falhou por ABI incompatível e está preservada |
| M6 — Cobertura            | Linhas `96.49%`; branches `91.96%`; funções `93.75%`                                        | MEDIDO no runner nativo; mesmos arquivos carregados do padrão `src/**/*.js`  |
| M7 — CI                   | `SUCCESS` no run `41890757033`, SHA `22e6baf26e8cbf0a70e3837f2682269fa876eea5`              | MEDIDO; detalhes e URL em [ci-evidence.md](./ci-evidence.md)                 |
| M8 — Intervenções humanas | 1 solicitação; nenhuma edição humana direta de código identificada nesta retomada           | PARCIALMENTE MEDIDO; autoria histórica não inferida                          |

O SHA do código validado permaneceu `a1a23d48ccf41f9a9c31b4ab30f9f27d829439fa`; commits desta retomada registram documentação e evidências, não mudanças funcionais. Baseline e SHA final de código são, portanto, iguais; a lista de arquivos documentais alterados e os commits podem ser conferidos no histórico Git.
