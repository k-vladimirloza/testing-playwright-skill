---
description: Revisa si hay una versión más nueva de este plugin y da los comandos exactos para actualizarlo.
---

Verifica la versión instalada de este plugin: lee `.claude-plugin/plugin.json`
dentro de la carpeta del plugin activo. Si tienes acceso a red, compara
contra la versión publicada en
`https://raw.githubusercontent.com/k-vladimirloza/testing-playwright-skill/main/.claude-plugin/plugin.json`.

Reporta al usuario, en una frase simple, si hay una versión más nueva o si
ya está al día.

**Importante:** actualizar un plugin no se puede disparar desde dentro de
un comando (limitación de la plataforma — un comando solo puede sugerir,
no ejecutar `/plugin install` por sí mismo). Dile al usuario, en lenguaje
simple, que corra él mismo estos dos comandos, en este orden:

1. `/plugin marketplace update testing-playwright-skill`
2. `/plugin install playwright-ai-testing@testing-playwright-skill`

No afirmes que ya quedó actualizado — solo reporta la versión encontrada
y da los comandos exactos para que el usuario los corra.
