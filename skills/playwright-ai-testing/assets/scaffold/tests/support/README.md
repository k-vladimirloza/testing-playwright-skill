# Helpers compartidos

Helpers reutilizables entre pruebas generadas (por ejemplo login) para no
repetir la misma precondicion en cada archivo `.spec.ts`. Ver la seccion
"Helpers reutilizables" de `CLAUDE.md` para el patron completo.

- `*.setup.ts`: hace una precondicion una sola vez (ej. login) y guarda el
  resultado para reutilizar. Para login, parte de
  `login.setup.template.ts` (en esta misma carpeta) — copialo a
  `<usuario>.setup.ts` y rellena los `TODO` con lo que encuentres al
  explorar la pantalla de login real. No lo dejes con placeholders sin
  completar.
- `auth/`: sesiones guardadas (`storageState` de Playwright). Ignorado por
  Git porque puede contener tokens de sesion.

Antes de crear un helper nuevo, revisa si ya existe uno aqui que sirva.

## Conectar un helper de login a `playwright.config.ts`

La primera vez que generes un `<usuario>.setup.ts`, agrega (si no esta ya)
un proyecto `setup` del que dependan los demas, para que corra una sola
vez antes de la suite:

```ts
projects: [
  { name: 'setup', testMatch: /.*\.setup\.ts/ },
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'], storageState: 'tests/support/auth/<usuario>.json' },
    dependencies: ['setup'],
  },
],
```

Si ya hay un proyecto `setup` (por un helper anterior), no lo dupliques —
solo agrega el `storageState` correspondiente al proyecto que use este
nuevo usuario/rol, o un proyecto nuevo si necesita una sesion distinta en
paralelo.
