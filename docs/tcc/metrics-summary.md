# Métricas do experimento — Cenário A

`run_id`: `A-20261029-01`

`session_id`: `ahp-session:/3ebe3f42-94a1-4fbe-870a-900875f666bd`

Baseline: `70fc7c8a81c870c62e93640cd4f09ebec89ee40f`

SHA de implementação validado: A registrar após check final e `npm ci`.

| Indicador                 | Valor e unidade                                                  | Estado                          | Fonte e período                                                          | Completude/limitações                                                                                          |
| ------------------------- | ---------------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| M1 — Prompts              | 1 mensagem explícita observada                                   | PARCIALMENTE MEDIDO             | `ai-interaction-log.md`; início da sessão                                | Sem exportação independente completa                                                                           |
| M2 — Tempo                | A calcular do primeiro pedido até a validação final              | PARCIALMENTE MEDIDO             | `experiment-run.md`; execução observada                                  | Pausas não documentadas; não estima tempo ativo nem geração da IA                                              |
| M3 — Correções            | 1 defeito funcional corrigido                                    | MEDIDO para evidência observada | `corrections.csv`; implementação e testes                                | Não infere defeitos ou intervenções fora desta execução                                                        |
| M4 — Arquivos             | A calcular pelo diff Git baseline–final, por categoria           | MEDIDO após commit final        | `git diff` entre baseline e SHA de implementação                         | Exclui banco local, dependências e caches                                                                      |
| M5 — Testes               | Execuções e resultados discriminados em `test-results.md`        | PARCIALMENTE MEDIDO             | Testes observados nesta sessão; comparação final no SHA de implementação | Tentativas anteriores ao commit não têm SHA próprio; horários ausentes permanecem explicitamente indisponíveis |
| M6 — Cobertura            | A registrar no SHA final de implementação                        | MEDIDO após check final         | Runner nativo Node.js; `src/**/*.js`                                     | Módulos não carregados, inclusive JavaScript do navegador, não aparecem como cobertura completa                |
| M7 — CI                   | `NOT_EXECUTED`                                                   | NÃO EXECUTADO                   | `.github/workflows/ci.yml`; execução remota                              | Nenhum remote GitHub ou run disponível                                                                         |
| M8 — Intervenções humanas | 1 intervenção por prompt; 0 edições diretas de código observadas | PARCIALMENTE MEDIDO             | `human-interventions.csv`; histórico desta sessão                        | Não atribuir autoria usando apenas identidade do commit; sem exportação de atividade externa                   |

Não há limiar de cobertura ou inferência causal entre metodologia e qualidade. Valores desconhecidos não são convertidos em zero. Consulte os registros e logs vinculados para evidências por execução.
