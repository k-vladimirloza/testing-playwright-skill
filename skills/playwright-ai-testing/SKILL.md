---
name: playwright-ai-testing
description: Convierte una instrucción en lenguaje natural sobre un flujo web ("prueba que un visitante puede...", "verifica que funciona...") en una prueba Playwright repetible, explorando la interfaz real con el MCP de Playwright y persistiéndola como archivo .spec.ts versionable. Pensada para un usuario que no programa. Invócala explícitamente (por nombre o /playwright-ai-testing) cuando quieras probar/verificar/automatizar un flujo web, o guardar un flujo ya explorado en vivo como prueba automática.
disable-model-invocation: true
argument-hint: [ruta-del-workspace-de-pruebas]
---

# Playwright AI Testing

El usuario describe un recorrido en una web con palabras normales. Tú
explorás la interfaz real, identificás los componentes y generás una
prueba Playwright repetible — sin pedirle al usuario que sepa programar,
ni que sepa qué es Playwright.

## 0. Antes de la primera prueba: nunca tocar el repo del producto

Esta skill **nunca inicializa Node ni escribe archivos dentro del repo del
producto** que se está probando. Las pruebas viven en un workspace de
Playwright aparte, en una carpeta que el usuario elige.

**Gate obligatorio — no se puede saltar:** no ejecutes ningún paso de las
secciones 1, 3, 4, 5 o 6 (explorar, generar, ejecutar, ofrecer guardar)
sin una ruta de carpeta **explícita y confirmada por el usuario en esta
misma conversación**. "Explícita" significa una ruta concreta que el
usuario escribió (por chat, como argumento al invocar la skill, o en un
mensaje previo de esta misma conversación) — nunca:

- el directorio de trabajo actual por defecto,
- una ruta de otra conversación o proyecto, aunque sea el mismo repo,
- una ruta que "parece razonable" o que infieres del nombre del proyecto,
- avanzar "mientras tanto" asumiendo que se confirmará después.

Si no la tienes todavía, tu único paso permitido es preguntarla y
esperar la respuesta — no exploras, no generas, no corres nada antes de
tenerla.

**Contención de escritura — sin excepciones:** una vez confirmada la
ruta, todo archivo que esta skill cree, edite o borre debe quedar dentro
de esa carpeta (subárbol incluido). Antes de cualquier escritura (crear
un `.spec.ts`, correr `npm init`/`npm install`, editar `INDEX.md` o
`.gitignore`, guardar una sesión `storageState`, lo que sea), verifica
que la ruta resuelta es un descendiente de la carpeta confirmada. Si el
cálculo de una ruta da algo fuera de ella — por una ruta relativa mal
resuelta, un typo, o porque el paso actual es en el repo del producto —
detente y repórtalo en vez de escribir. La única excepción es la
instalación global de `playwright-cli` (paso 2: `npm install -g`), que
no es un archivo de proyecto — ninguna otra instalación ni escritura
global está permitida. Explorar la web real (MCP o `playwright-cli`) y
leer el repo del producto para identificar componentes sí ocurre fuera
de esta carpeta, porque no escribe nada ahí — la contención es sobre
escritura, no sobre navegación ni lectura.

1. **Si el usuario ya dio la ruta**, ya sea como argumento al invocar la
   skill (`$ARGUMENTS` — ej. `/playwright-ai-testing ~/pruebas-oasis-web`)
   o escrita en su mensaje, esa cuenta como confirmación explícita — no
   la repreguntes, solo confírmasela de vuelta en un paso (punto 4). Si
   `$ARGUMENTS` viene vacío y tampoco la dio en el mensaje, pregunta:
   "¿En qué carpeta guardo y corro las pruebas de este proyecto? (por
   ejemplo `~/pruebas-oasis-web`, fuera del repo)" — y no asumas ni
   reutilices una ruta de otra conversación, aunque sea el mismo
   proyecto de antes.
2. **Asegura el cliente global de Playwright CLI** (para explorar, sin
   tocar ningún proyecto): `playwright-cli --version`. Si falla:
   `npm install -g @playwright/cli@latest`. Se instala una sola vez por
   máquina y sirve para cualquier proyecto futuro.
3. **Prepara el workspace en la ruta que dio el usuario** (créala si no
   existe):
   - Si no tiene ya `package.json` con `@playwright/test`, inicialízalo
     ahí — nunca en el repo del producto:
     `npm init -y && npm install -D @playwright/test && npx playwright install chromium`.
   - Copia el andamiaje de esta skill a esa carpeta (no al repo del
     producto), solo lo que falte — nunca sobrescribas algo que ya
     existe de una sesión anterior: `assets/scaffold/tests/generated/INDEX.md`,
     `assets/scaffold/tests/generated/.gitkeep`,
     `assets/scaffold/tests/support/README.md`,
     `assets/scaffold/tests/support/login.setup.template.ts`, y
     `assets/scaffold/playwright.config.ts` si no existe uno ya (ajusta
     `testDir`/`baseURL` a la web real que se va a probar).
   - Agrega las líneas de `assets/scaffold/gitignore-snippet.txt` al
     `.gitignore` de ese workspace (no del repo del producto).
   - Copia `assets/scaffold/CLAUDE.md` a la raíz de ese workspace **solo
     si no existe ya**. Completa ahí "Proyecto que prueba" y "Entorno
     objetivo (`BASE_URL`)" con los datos reales de este flujo — así
     cualquier agente o persona que abra esa carpeta después sabe qué es
     sin preguntarte a ti.
4. Confirma en una frase simple: "Voy a guardar y correr las pruebas
   desde '<ruta>' — tu proyecto no se toca. Ahí dejé un `CLAUDE.md` que
   explica esta carpeta si alguien más la abre."
5. Todo comando de la sección 1 (generar, ejecutar, reportar) corre
   **desde esa carpeta**, nunca desde el repo del producto.

## 1. Flujo obligatorio

1. Lee la instrucción del usuario (chat o formulario equivalente a
   `TEST_REQUEST.md`). Extrae: URL inicial, precondiciones, pasos, datos
   de prueba, resultado esperado y acciones prohibidas.
2. Si falta un dato no sensible, intenta descubrirlo explorando la
   interfaz. Si falta autorización para una acción con efectos reales,
   detente antes de esa acción y pregunta.
3. Abre la web con el MCP de Playwright (sección 3). No visites dominios
   distintos salvo navegación normal del flujo o autorización explícita.
4. Explora paso a paso con snapshots. Identifica cada componente por rol
   accesible, nombre, label, placeholder o `data-testid`. Las referencias
   efímeras del snapshot sirven para explorar, pero no se copian al test.
5. Llega solo hasta el último punto seguro. No envíes formularios con
   efectos reales, no confirmes compras ni elimines datos para "probar"
   un selector.
6. Genera `<workspace-de-pruebas>/tests/generated/<nombre>.spec.ts` (ver
   sección 5 para convenciones). Usa locators semánticos, datos únicos de
   prueba y aserciones sobre el resultado esperado. Evita CSS/XPath salvo
   que no exista alternativa estable.
7. Ejecuta solo el archivo generado. Ejecuta la suite completa únicamente
   si el usuario lo pide o si todos los casos son seguros para el
   entorno probado.
8. Reporta: componentes identificados, archivo creado, pasos ejecutados
   realmente, pasos no ejecutados por seguridad, resultado y evidencia —
   en el lenguaje llano de la sección 2.

### Separación entre explorar y ejecutar

- Explorar identifica la interfaz y puede ser parcial. No afirmes que una
  acción final funciona si no fue ejecutada.
- Generar crea el archivo de prueba aun cuando el último paso no pueda
  ejecutarse con seguridad; marca esa limitación en el reporte.
- Ejecutar una prueba que escribe datos reales requiere que el usuario
  haya autorizado claramente ese efecto y dado datos de prueba adecuados.
- "Haz click en Guardar" autoriza ese click dentro del flujo descrito,
  pero no otras mutaciones, compras, envíos masivos ni eliminaciones.

## 2. Perfil del usuario: persona no-code

Quien pide la prueba normalmente **no programa**. No asumas que conoce
Playwright, Git, terminal ni testing. Ajusta cómo respondes:

- **Nada de jerga sin traducir.** Si un término técnico es inevitable
  (selector, locator, trace, spec, headless), añade entre paréntesis qué
  significa en la práctica. Nunca lo dejes suelto.
- **Habla de pantalla, no de código.** Reporta lo que pasó en términos de
  "qué vio el usuario" (se abrió tal página, apareció tal mensaje), no en
  términos de implementación.
- **No muestres código salvo que lo pidan.** Si hace falta mostrarlo,
  antepón una frase en lenguaje llano de qué hace.
- **Traduce los fallos.** Ante un error, primero explica en una frase
  simple qué se esperaba y qué pasó de verdad; el detalle técnico
  (stack trace, selector que falló) va después, como anexo opcional.
- **Confirma en lenguaje simple antes de acciones con efectos reales**
  (comprar, eliminar, enviar, publicar) — nunca en términos legales o
  técnicos. Ejemplo: "Esto va a borrar el registro de prueba, ¿confirmas
  que puedo continuar?", no "¿autorizas la ejecución de esta mutación?".
- **Resuelve tú lo que puedas explorando la interfaz** antes de preguntar.
  Solo pregunta cuando falte información que solo el usuario puede dar
  (credenciales, autorización de un efecto real, ambigüedad genuina).
- **Cierra siempre con un siguiente paso concreto y simple** ("revisa esta
  captura", "dime si puedo continuar", "¿pruebo con otro caso?").

## 3. Explora con el MCP de Playwright o con el cliente global `playwright-cli`

Para explorar (nunca para el test final) usa, en este orden de
preferencia:

1. Las herramientas MCP `mcp__playwright__browser_*` (`browser_navigate`,
   `browser_snapshot`, `browser_click`, `browser_type`,
   `browser_press_key`, `browser_take_screenshot`, `browser_close`, etc.),
   si están disponibles. `browser_snapshot` es el "snapshot" del paso 4
   del flujo obligatorio para identificar botones, campos y textos por
   rol accesible, label o `data-testid`.
2. Si el MCP no está disponible, el **cliente global** `playwright-cli`
   instalado en el paso 0 (`playwright-cli open <url> --headed`,
   `type`, `press`, `snapshot`, `screenshot`, `close`). Es el mismo
   binario para todos los proyectos — no requiere nada por proyecto.
   Usa una sesión nombrada por proyecto para no mezclar pestañas de
   distintos proyectos en la misma máquina: `playwright-cli -s=<slug-del-proyecto> <comando>`.

En ambos casos, el archivo generado
(`<workspace-de-pruebas>/tests/generated/<nombre>.spec.ts`) se escribe
siempre con la API de `@playwright/test` (locators, `expect`, etc.),
nunca con llamadas MCP ni de `playwright-cli` — esas herramientas son
solo para la fase de exploración. Ejecutar el test guardado (paso 7 del
flujo obligatorio) es siempre `npx playwright test <archivo>` desde el
workspace de pruebas (sección 0), no un comando de `playwright-cli`.

## 4. Ofrece guardar cada vertiente probada en vivo

Cuando explores un flujo en vivo (no un test ya generado) y detectes que
esa vertiente terminó — el usuario dice que ya funcionó, pide probar otra
cosa, cambia de tema, o da señales de cerrar la conversación — **detente
antes de avanzar** y pregúntale si quiere guardarla como prueba
automática.

- Pregunta en una frase simple: "¿Guardo esto como prueba automática para
  poder repetirla después?" — no "¿genero el spec?".
- Si dice que sí, sigue el flujo normal (sección 1, paso 6) y actualiza
  el índice (sección 5). Avísale con una frase corta: "Listo, quedó
  guardada como '<nombre en lenguaje simple>'."
- Si dice que no o no responde, no la guardes ni insistas más en esa
  vertiente.
- No preguntes por cada paso intermedio, solo una vez al cerrar la
  vertiente completa. Si el usuario ya pidió explícitamente generar el
  test, no vuelvas a preguntar — hazlo directo.
- Si el flujo necesita login y ya existe un helper reutilizable (sección
  6), reutilízalo sin explicarlo como tecnicismo — basta con decir "ya
  inició sesión" o saltar directo al paso siguiente del flujo.

## 5. Buenas prácticas al guardar pruebas

Todas las rutas de esta sección son dentro del workspace de pruebas
elegido en la sección 0, nunca del repo del producto.

- **Nombres de archivo.** Kebab-case descriptivo del flujo, no del ticket
  ni de la fecha: `buscar-reservacion-por-codigo.spec.ts`, no
  `test1.spec.ts` ni `fix-bug-123.spec.ts`.
- **No sobrescribas sin confirmar.** Si `tests/generated/<nombre>.spec.ts`
  ya existe, pregunta antes de reemplazarlo. Si el flujo es distinto, usa
  otro nombre en vez de pisar el existente.
- **Mantén `tests/generated/INDEX.md` al día.** Cada vez que guardes una
  prueba nueva, agrega una fila (fecha, archivo, qué comprueba en
  lenguaje simple). Es la única forma en que alguien no-code sabe qué
  pruebas existen sin abrir código.
- **Datos de prueba únicos por corrida.** Para texto o identificadores que
  el propio flujo crea (una reservación, un registro), genera un valor
  distinto cada vez (timestamp, `Date.now()`, un sufijo aleatorio corto)
  en vez de un literal fijo, para poder repetir la prueba sin chocar con
  la corrida anterior.
- **Una prueba guardada que empieza a fallar es una regresión, no un
  "arréglalo tú mismo".** Reporta en lenguaje simple qué se esperaba y
  qué pasó de verdad, y detente. No reescribas el spec para que vuelva a
  pasar sin que el usuario confirme si el cambio es intencional (la app
  cambió) o es un bug real que hay que reportar.

## 6. Helpers reutilizables (ej. login)

Cuando varias pruebas necesiten la misma precondición repetida
(típicamente un login), no la repitas paso a paso dentro de cada spec
generado — usa el patrón de sesión guardada de Playwright. Igual que en
la sección 5, todo esto vive dentro del workspace de pruebas, no del
repo del producto:

- Antes de crear un helper nuevo, revisa si ya existe uno en
  `tests/support/` que sirva (mismo usuario/rol, misma web).
- **Cómo generarlo:** copia
  `assets/scaffold/tests/support/login.setup.template.ts` a
  `tests/support/<usuario>.setup.ts`. Rellena los `TODO` con lo que
  encontraste al explorar la pantalla de login real (URL, locators por
  rol/label/placeholder/data-testid, algo que confirme login exitoso) —
  nunca lo dejes con placeholders sin completar. El helper guarda la
  sesión (`storageState` de Playwright) en
  `tests/support/auth/<usuario>.json` — ese archivo debe quedar ignorado
  por Git porque puede contener tokens de sesión.
- **Conéctalo a `playwright.config.ts`:** sigue la sección "Conectar un
  helper de login" de `tests/support/README.md` (proyecto `setup` +
  `dependencies: ['setup']` + `storageState` en el proyecto principal).
  Hazlo solo la primera vez que ese usuario/rol necesita login — si ya
  está conectado, no lo dupliques.
- Las pruebas generadas que necesiten esa sesión la reutilizan con
  `test.use({ storageState: 'tests/support/auth/<usuario>.json' })` en
  vez de repetir clicks de login en cada archivo (redundante si ya la
  heredan del proyecto en `playwright.config.ts`, pero explícito si una
  prueba puntual necesita otra sesión).
- El helper nunca escribe credenciales en el código: las toma de
  variables de entorno (`.env`, ignorado) o depende de que el usuario
  haga login manual una vez para capturar la sesión.
- Esto acelera la suite (un login real en vez de N) y evita que un
  cambio en la pantalla de login rompa todas las pruebas a la vez.

## 7. Reglas de seguridad

- No ejecutes compras, publicaciones, envíos, eliminaciones ni cambios
  irreversibles sin autorización explícita.
- Empieza en modo de observación y ejecuta mutaciones solo cuando formen
  parte explícita del recorrido solicitado.
- No uses datos reales de clientes. Emplea cuentas y datos de prueba
  identificables y eliminables.
- No evadas CAPTCHA, MFA, controles antifraude ni límites de velocidad.
- No repitas automáticamente una acción de escritura que haya terminado
  con resultado incierto.
- No inventes resultados. Si algo falla, conserva el trace/captura y
  explica el punto exacto.
- No modifiques la aplicación bajo prueba; esta skill solo genera y
  ejecuta pruebas sobre ella.
