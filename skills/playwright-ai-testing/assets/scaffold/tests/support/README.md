# Helpers compartidos

Helpers reutilizables entre pruebas generadas (por ejemplo login) para no
repetir la misma precondicion en cada archivo `.spec.ts`. Ver la seccion
"Helpers reutilizables" de `SKILL.md` para el patron completo.

- `*.setup.ts`: hace una precondicion una sola vez (ej. login) y guarda el
  resultado para reutilizar.
- `auth/`: sesiones guardadas (`storageState` de Playwright). Ignorado por
  Git porque puede contener tokens de sesion.

Antes de crear un helper nuevo, revisa si ya existe uno aqui que sirva.
