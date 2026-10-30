# Verificações de qualidade

| Verificação | Primeira observação                                                                                          | Ajuste                                                                            | Evidência posterior                                       |
| ----------- | ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- | --------------------------------------------------------- |
| ESLint      | `npm run lint` sinalizou `document` e `window` ausentes no JavaScript do navegador                           | Declarar globals de navegador e a dependência direta `globals` na configuração    | ESLint aprovado em `TEST-A-007`; repetir no check final   |
| Prettier    | `npm run format:check` incluiu o prompt baseline e o lockfile gerado, além dos arquivos ainda não formatados | Excluir artefatos preservados/gerados; formatar os arquivos mantidos pelo projeto | Prettier aprovado em `TEST-A-007`; repetir no check final |

O prompt fornecido não foi reformatado nem alterado após o commit baseline. Ajustes de formatação não são contabilizados como defeitos corrigidos em M3.
