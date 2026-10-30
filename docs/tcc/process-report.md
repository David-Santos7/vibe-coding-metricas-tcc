# Relatório detalhado do processo — Cenário A

## 1. Objetivo e escopo

Este relatório descreve como foi construído e validado o sistema CRUD de agendamentos do Cenário A — Vibe Coding. A implementação seguiu o prompt [`prompt-vibe-coding-metricas-tcc.md`](../../prompt-vibe-coding-metricas-tcc.md), preservando a stack solicitada e registrando os resultados observáveis no Git e em `docs/tcc/`.

O escopo realizado foi um único projeto Node.js com Express, páginas EJS, CSS e JavaScript simples no navegador, SQLite por `better-sqlite3`, arquitetura em camadas e testes com `node:test` e Supertest. Não foram adicionados autenticação, autorização, frontend separado, Docker, serviços distribuídos ou ferramentas Spec-Driven.

## 2. Estado inicial e preservação do baseline

1. A inspeção encontrou um diretório Git na branch `master`, sem commits anteriores, sem arquivos de aplicação e sem histórico prévio a preservar.
2. O único arquivo fornecido era o prompt central. Ele foi mantido intacto.
3. O ambiente registrado foi Windows, Node.js `v24.14.1`, npm `11.12.1` e Git `2.51.1.windows.1`.
4. Antes de escrever a aplicação, o prompt foi adicionado e versionado como baseline:
   - Commit `70fc7c8a81c870c62e93640cd4f09ebec89ee40f`
   - Mensagem: `docs: preserve experiment prompt baseline`
5. Não havia remote GitHub configurado. Portanto, o histórico produzido nesta execução é local e não existe run remoto de CI.

Registro complementar: [`baseline.md`](./baseline.md).

## 3. Processo de desenvolvimento, passo a passo

### Etapa 1 — Definição de dependências e verificações

Foi criado um `package.json` único, com scripts para iniciar a aplicação, rodar testes, cobertura nativa, ESLint e Prettier. Também foram adicionados o lockfile, configurações de lint e formatação e regras de `.gitignore` para dependências, caches, `.env`, cobertura e banco SQLite local.

As dependências de produção e desenvolvimento efetivamente instaladas estão registradas em [`experiment-run.md`](./experiment-run.md). O Node.js do ambiente estava dentro da faixa exigida do projeto (`>=24 <25`).

### Etapa 2 — Testes antes da implementação (TDD: RED)

Antes de criar qualquer código em `src/`, foram escritos testes para:

- Invariantes e validação da entidade.
- Casos de uso e regras temporais/conflitos.
- Persistência no SQLite.
- Rotas e códigos HTTP.
- Direção de dependências da arquitetura.

Foi criado um repositório em memória como double para os testes de aplicação. A primeira execução de `npm test` foi realizada antes da implementação e falhou como esperado: os módulos de produção ainda não existiam e os testes arquiteturais não encontravam os diretórios da aplicação. Essa evidência RED foi preservada em [`logs/tdd-red-before-implementation.log`](./logs/tdd-red-before-implementation.log).

Os testes e as configurações foram então registrados separadamente, antes da implementação:

- Commit `31b8b8af34c1fe5daad97fd5fcaa593a4a4a02d9`
- Mensagem: `test: define CRUD acceptance suite before implementation`

Esse commit separa claramente a definição inicial dos testes da implementação posterior.

### Etapa 3 — Implementação do domínio e da aplicação

Foram criadas a entidade `Appointment` e classes de erro para validação, registro não encontrado e conflito. A entidade aplica trim aos campos textuais e valida os campos obrigatórios, datas reais em `YYYY-MM-DD`, horários de 24 horas, limite de 500 caracteres para observações e timestamps ISO.

Na camada de aplicação foram implementados os casos de uso `CreateAppointment`, `GetAppointment`, `ListAppointments`, `UpdateAppointment` e `DeleteAppointment`, apoiados pelo contrato de repositório. As regras de passado são verificadas nos casos de criação e atualização, usando `America/Sao_Paulo` e um relógio injetável nos testes. A criação usa `crypto.randomUUID()`; a edição mantém `createdAt` e atualiza `updatedAt`.

### Etapa 4 — Persistência SQLite

Foi implementada a inicialização automática do esquema e a persistência em `data/appointments.db`. A tabela armazena os campos do agendamento e aplica `UNIQUE(appointment_date, appointment_time)`. O repositório utiliza prepared statements e parâmetros, incluindo verificação de horário que pode excluir o próprio ID durante a edição.

Os testes de integração instanciam SQLite em memória, não dependem de um arquivo local e não versionam o banco real.

### Etapa 5 — Express, rotas e interface

O servidor Express faz a composição manual das dependências e renderiza páginas EJS. A interface inclui início, listagem, formulário de cadastro/edição, detalhes e página de erro; utiliza HTML semântico, labels, foco visível, CSS responsivo e JavaScript mínimo para confirmação de exclusão.

Rotas implementadas:

| Método | Rota | Ação |
|---|---|---|
| `GET` | `/` | Página inicial |
| `GET` | `/appointments` | Listar agendamentos |
| `GET` | `/appointments/new` | Exibir cadastro |
| `POST` | `/appointments` | Criar |
| `GET` | `/appointments/:id` | Visualizar |
| `GET` | `/appointments/:id/edit` | Exibir edição |
| `POST` | `/appointments/:id/update` | Atualizar |
| `POST` | `/appointments/:id/delete` | Excluir |

O middleware converte erros de validação, ausência e conflito em `400`, `404` e `409`. Erros inesperados retornam `500` com mensagem genérica; detalhes são registrados no servidor e não expostos na página.

### Etapa 6 — Primeiro ciclo GREEN e correção observada

A primeira execução depois da implementação identificou um defeito de integração: `better-sqlite3` exige um objeto simples para os parâmetros nomeados, mas o código estava passando diretamente uma instância da entidade `Appointment`. A criação HTTP falhava com erro interno e o conflito também não chegava ao status esperado.

A correção foi localizada no repositório SQLite: converter a entidade em objeto simples nos bindings de `INSERT` e `UPDATE`. A tentativa com falha está documentada em [`logs/tdd-first-implementation-attempt.log`](./logs/tdd-first-implementation-attempt.log); a correção única consta em [`corrections.csv`](./corrections.csv).

Depois do ajuste, os 24 testes existentes passaram. A suíte foi ampliada para 26 casos, incluindo atualização para o passado e atualização de um registro inexistente. Nenhum teste foi removido para esconder falha.

### Etapa 7 — Lint, formatação e cobertura

As primeiras verificações de qualidade revelaram dois pontos de configuração, não defeitos funcionais:

- ESLint não conhecia os globais `document` e `window` usados pelo pequeno script de navegador. Foram declarados os globais do navegador e adicionada `globals` como dependência explícita.
- Prettier estava tentando formatar o prompt original e arquivos de dependências/gerados. Foram adicionadas exclusões apropriadas; o prompt baseline permaneceu sem modificação.

Esses ajustes, assim como as tentativas, estão registrados em [`quality-checks.md`](./quality-checks.md). O script `npm run check` reúne ESLint, verificação do Prettier e testes com cobertura nativa do Node.js.

### Etapa 8 — Commit da aplicação

Com o ciclo completo validado localmente, a aplicação foi registrada no commit:

- `1ab049bfb1fe767d632ba503e70324813c5e9dc7`
- Mensagem: `feat: implement appointment CRUD with clean architecture`

Esse é o SHA específico do código que recebeu a validação final em clone limpo.

### Etapa 9 — Reprodução limpa

O commit de implementação foi clonado em um diretório temporário. Nesse clone:

1. `npm ci` instalou as versões fixadas pelo lockfile; o `npm audit` reportou zero vulnerabilidades.
2. `npm run check` passou.
3. O runner executou 26 testes: 26 aprovados, zero reprovados e zero ignorados.
4. O clone permaneceu sem alterações rastreadas e foi removido após a validação.

As saídas foram preservadas em [`logs/clean-clone-install.log`](./logs/clean-clone-install.log) e [`logs/final-check.log`](./logs/final-check.log). Isso comprova reprodução local, não aprovação de CI remota.

### Etapa 10 — Consolidação das evidências

Foram registrados os eventos, execução, interações observáveis, correção, resultados de teste, intervenções e métricas nos arquivos de `docs/tcc/`. A implementação e as evidências foram gravadas em commits separados:

1. `70fc7c8` — preservação do baseline.
2. `31b8b8a` — testes escritos antes da implementação.
3. `1ab049b` — CRUD e arquitetura.
4. `302ed0a` — logs e consolidação inicial das métricas.
5. `582faf6` — reconciliação da contagem de arquivos.

Este relatório é uma documentação explicativa posterior ao snapshot experimental usado na medição M4; ele não altera os resultados de teste nem o SHA de implementação validado.

## 4. Arquitetura resultante

| Camada | Responsabilidade | Caminho |
|---|---|---|
| Domain | Entidade, invariantes e erros de domínio | [`src/domain/`](../../src/domain/) |
| Application | Casos de uso, contrato de repositório e regra temporal | [`src/application/`](../../src/application/) |
| Infrastructure | Inicialização do SQLite, esquema e repositório concreto | [`src/infrastructure/`](../../src/infrastructure/) |
| Presentation | Controllers, rotas, middleware, EJS, CSS e JS do navegador | [`src/presentation/`](../../src/presentation/) |
| Main | Composição manual e inicialização do servidor | [`src/main/`](../../src/main/) |
| Tests | Testes unitários, HTTP, integração, arquitetura e doubles | [`tests/`](../../tests/) |

O teste arquitetural verifica que Domain e Application não importam diretamente Express, EJS ou `better-sqlite3`.

## 5. Como instalar, testar e executar

Pré-requisitos: Node.js `24.x` e npm compatível.

No PowerShell, na raiz do repositório:

```powershell
npm ci
npm test
npm run test:coverage
npm run lint
npm run format:check
npm run check
```

`npm run check` executa lint, formatação e cobertura/testes em sequência. Para iniciar a aplicação:

```powershell
Copy-Item .env.example .env
npm start
```

Abra `http://localhost:3000`. O arquivo `data/appointments.db` é criado automaticamente e ignorado pelo Git. Os testes usam banco SQLite em memória.

## 6. Resultados observados

- **Testes finais:** 26 passaram, 0 falharam e 0 foram ignorados, validados no SHA `1ab049b`.
- **Cobertura nativa dos módulos carregados de `src/`:** 96,49% de linhas, 91,96% de branches e 93,75% de funções.
- **Clone local reproduzível:** `npm ci` e `npm run check` aprovados.
- **Correções funcionais registradas:** 1 defeito encontrado e corrigido durante o ciclo de implementação.
- **CI remota:** `NOT_EXECUTED`. O workflow foi criado em [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml), mas não havia remote GitHub nem resultado de execução.

A cobertura não inclui todo o JavaScript por definição: `src/presentation/public/app.js` executa no navegador e não foi instrumentado pelo runner Node.js. O projeto não define percentual mínimo de cobertura.

## 7. Histórico, logs e consulta

Para inspecionar os commits localmente:

```powershell
git log --oneline --decorate
git log --stat
git show --stat 70fc7c8
git show --stat 31b8b8a
git show --stat 1ab049b
git diff 70fc7c8..582faf6 --stat
git status
```

Arquivos principais de evidência:

- [`metrics-summary.md`](./metrics-summary.md) — indicadores M1–M8 e limitações.
- [`test-results.md`](./test-results.md) — tentativas, resultados e relação com eventos.
- [`events.csv`](./events.csv) — registro padronizado de eventos.
- [`corrections.csv`](./corrections.csv) — defeito, correção e validação.
- [`ai-interaction-log.md`](./ai-interaction-log.md) — prompt observável.
- [`human-interventions.csv`](./human-interventions.csv) e [`sessions.csv`](./sessions.csv) — registros parciais de intervenções e sessão.
- [`ci-evidence.md`](./ci-evidence.md) — status correto da CI.
- [`logs/`](./logs/) — saídas preservadas de RED, falha de integração, instalação limpa e check final.

## 8. Métricas e limitações experimentais

Os valores e fontes oficiais estão em [`metrics-summary.md`](./metrics-summary.md). Resumo:

- **M1 — Prompts:** 1 mensagem explicitamente observada nesta conversa; registro parcial, sem exportação completa.
- **M2 — Tempo:** 802,5149 segundos decorridos entre o início observado e a validação final. Pausas não foram documentadas; não representa tempo ativo nem tempo de geração da IA.
- **M3 — Correções:** 1 defeito funcional corrigido, contado uma vez.
- **M4 — Arquivos:** no snapshot medido, 58 arquivos únicos adicionados: 27 de aplicação, 6 de testes, 9 de configuração e 16 de documentação. Nenhum arquivo foi modificado, removido ou renomeado nesse diff; banco e dependências foram excluídos.
- **M5 — Testes:** 9 execuções documentadas; execução final: 26/26 aprovados. Para algumas tentativas anteriores, horário exato e SHA próprio do working tree não estavam disponíveis, e isso foi mantido explícito.
- **M6 — Cobertura:** linhas 96,49%, branches 91,96%, funções 93,75%, com as limitações de instrumentação já descritas.
- **M7 — CI:** não executada no GitHub; não há remote, run ID ou URL.
- **M8 — Intervenções humanas:** um prompt observado; nenhuma edição direta de código humano foi identificada. A autoria não é inferida pelas credenciais do Git.

Estas medidas são observacionais. Não provam causalidade entre método e qualidade, não usam número de commits como substituto de prompts e não convertem dados desconhecidos em zero.

## 9. Estado final e próximos passos opcionais

O código da aplicação está validado no commit `1ab049bfb1fe767d632ba503e70324813c5e9dc7`. As evidências e a documentação têm commits posteriores; este relatório será registrado em seu próprio commit. O estado local anterior à criação deste relatório estava limpo.

Para publicar o histórico em GitHub e obter evidência de CI remota, ainda seria necessário configurar um repositório remoto, enviar a branch `master` e aguardar uma execução real do workflow. Até isso ocorrer, o status deve permanecer `NOT_EXECUTED`.
