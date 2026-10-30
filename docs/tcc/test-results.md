# Execuções de testes

## TDD — RED antes da implementação

- Execução: `TEST-A-001`
- Horário observado no arquivo de log: `2026-10-29T22:59:13-03:00`
- Comando: `npm test` (`node --test`)
- SHA: NÃO DISPONÍVEL — testes e configuração ainda estavam no working tree; base `70fc7c8a81c870c62e93640cd4f09ebec89ee40f`.
- Resultado: FAILURE esperado na fase RED.
- Arquivos de teste descobertos: 5.
- Testes aprovados: 0.
- Testes reprovados: 5 arquivos; 4 não carregaram por ausência dos módulos de produção e o teste arquitetural falhou porque `src/domain` ainda não existia.
- Ignorados: 0.
- Duração reportada pelo runner: `409.4673 ms`.
- Evidência: [log RED](./logs/tdd-red-before-implementation.log).

Esta execução registra a falha antes da implementação; ela não é contabilizada como teste funcional executado com sucesso.
