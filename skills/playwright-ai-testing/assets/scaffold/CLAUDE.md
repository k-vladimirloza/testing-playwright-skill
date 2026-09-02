# Workspace de pruebas — playwright-ai-testing

Esta carpeta es un workspace de Playwright generado por la skill/plugin
`playwright-ai-testing` para correr y guardar pruebas de un proyecto
externo. **No es el repo del producto** — vive aparte a propósito, para
no inicializar Node dentro de ese repo. Si este archivo aparece vacío en
los campos de abajo, complétalos la primera vez que generes una prueba.

- **Proyecto que prueba:** <nombre/ruta/URL del repo del producto>
- **Entorno objetivo (`BASE_URL`):** <URL base contra la que corren las pruebas>

## Estructura

- `tests/generated/<nombre>.spec.ts` — pruebas guardadas, generadas a
  partir de instrucciones en lenguaje natural.
- `tests/generated/INDEX.md` — índice en lenguaje simple de esas pruebas.
- `tests/support/` — helpers reutilizables (ej. login), ver su `README.md`.

## Reglas al guardar/generar pruebas

- **Nombres de archivo.** Kebab-case descriptivo del flujo, no del ticket
  ni de la fecha: `buscar-reservacion-por-codigo.spec.ts`.
- **No sobrescribas sin confirmar.** Si el archivo ya existe, pregunta
  antes de reemplazarlo; si el flujo es distinto, usa otro nombre.
- **Mantén `tests/generated/INDEX.md` al día.** Una fila por prueba
  nueva (fecha, archivo, qué comprueba en lenguaje simple).
- **Datos de prueba únicos por corrida.** Genera valores distintos cada
  vez (timestamp, `Date.now()`, sufijo aleatorio) para lo que el propio
  flujo crea, así se puede repetir sin chocar con la corrida anterior.
- **Una prueba que empieza a fallar es una regresión, no un
  "arréglalo tú mismo".** Reporta qué se esperaba y qué pasó, y detente.
  No reescribas el spec sin que el usuario confirme si el cambio es
  intencional o un bug real.

## Helpers reutilizables (login)

Si varias pruebas necesitan la misma precondición (típicamente login), no
la repitas en cada spec — usa sesión guardada de Playwright:

- Revisa `tests/support/` antes de crear un helper nuevo.
- Si falta una cuenta de prueba, pídesela al usuario en lenguaje simple
  (nunca asumas que sabe qué es una "variable de entorno") y guárdala en
  `.env` de esta carpeta (`TEST_USER_EMAIL`, `TEST_USER_PASSWORD`,
  `LOGIN_URL`) — `.env` ya está en `.gitignore`, nunca se sube.
- Genéralo a partir de `tests/support/login.setup.template.ts`: cópialo a
  `tests/support/<usuario>.setup.ts` y rellena los `TODO` con lo real
  (URL de login, locators, cómo confirmar que el login funcionó). Guarda
  la sesión (`storageState`) en `tests/support/auth/<usuario>.json`
  (ignorado por Git).
- Conéctalo a `playwright.config.ts` (proyecto `setup` +
  `dependencies: ['setup']`) siguiendo `tests/support/README.md` — solo
  la primera vez que ese usuario/rol lo necesita.
- Las pruebas la reutilizan con
  `test.use({ storageState: 'tests/support/auth/<usuario>.json' })`.
- Credenciales solo desde variables de entorno (`.env`, ignorado) o login
  manual del usuario para capturar la sesión — nunca en el código.

## Correr las pruebas sin el agente

- `BASE_URL=<url> npx playwright test` desde esta carpeta.
- Si falla por sesión vencida, vuelve a correr el helper de login
  correspondiente (ver `tests/support/README.md`) antes de reintentar.
- Los nombres de `test(...)` y los mensajes de `expect(...)` están en
  español llano a propósito — son el reporte para quien no programa;
  úsalos tal cual al leer un fallo.

## Reglas de seguridad

- No ejecutes compras, publicaciones, envíos, eliminaciones ni cambios
  irreversibles sin autorización explícita.
- No uses datos reales de clientes; usa cuentas y datos de prueba
  identificables y eliminables.
- No evadas CAPTCHA, MFA, controles antifraude ni límites de velocidad.
- No repitas automáticamente una escritura que terminó con resultado
  incierto.
- No modifiques la aplicación bajo prueba; este workspace solo genera y
  ejecuta pruebas sobre ella.
