# playwright-ai-testing (plugin de Claude Code)

Convierte una instrucción en lenguaje natural sobre un flujo web en una
prueba Playwright repetible, explorando con el MCP de Playwright y
persistiéndola como `.spec.ts` versionable. Pensada para que la use una
persona que no programa.

Este repo es a la vez el **plugin** y su propio **marketplace** — se
instala directo desde GitHub, no hace falta copiar carpetas a mano.

## Instalar

Dentro de Claude Code (terminal o extensión de VS Code, es el mismo
mecanismo):

```
/plugin marketplace add k-vladimirloza/testing-playwright-skill
/plugin install playwright-ai-testing@testing-playwright-skill
```

## Actualizar

No existe un comando que se auto-actualice — un plugin no puede disparar
su propia reinstalación (limitación de la plataforma). Para actualizar a
la última versión:

```
/plugin marketplace update testing-playwright-skill
/plugin install playwright-ai-testing@testing-playwright-skill
```

El plugin incluye `/playwright-ai-testing:update`, que revisa la versión
instalada contra la publicada en GitHub y te recuerda esos dos comandos
exactos — no actualiza por sí solo, solo te dice si hace falta y qué
correr.

## Usar

Claude Code la invoca sola cuando el pedido calza con su descripción
("prueba que...", "verifica que funciona...", "automatiza este flujo"), o
explícitamente pidiendo la skill `playwright-ai-testing`.

**Nunca toca el repo del producto.** En cada conversación pregunta dónde
alojar y correr las pruebas de ese proyecto (una carpeta fuera del repo,
elegida por el usuario) — no reutiliza rutas de conversaciones previas.
Ahí, y solo ahí, prepara el workspace de Playwright (usando las
plantillas de `assets/scaffold/`) y se asegura de que `playwright-cli`
esté instalado globalmente como cliente de exploración. Ver el paso 0 de
`skills/playwright-ai-testing/SKILL.md` para el detalle exacto.

## Contenido

```text
.claude-plugin/
  plugin.json                       manifest del plugin
  marketplace.json                  manifest del marketplace (este mismo repo)
commands/update.md                  /playwright-ai-testing:update (revisa version, no auto-actualiza)
skills/playwright-ai-testing/
  SKILL.md                          instrucciones de la skill
  assets/scaffold/                  plantillas que se copian al workspace de pruebas
    tests/generated/INDEX.md        indice vacio de pruebas
    tests/generated/.gitkeep
    tests/support/README.md         explica la convencion de helpers
    playwright.config.ts            config por defecto si el workspace no tiene una
    gitignore-snippet.txt           lineas a agregar al .gitignore del workspace
    AGENTS.md                       instrucciones del workspace (que proyecto prueba, convenciones, correr sin el agente)
    CLAUDE.md                       apunta a AGENTS.md, mismo patron que playwright-ai-harness
```

## Validar localmente (antes de publicar cambios)

```bash
claude plugin validate .
claude --plugin-dir .
```

## Origen

Extraída de `playwright-ai-harness` (harness de referencia con la
implementación completa: `package.json`, `scripts/record.mjs`,
`.playwright/`, pruebas de ejemplo).
