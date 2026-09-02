import { test as setup } from '@playwright/test';

// PLANTILLA de helper de login. Cópiala a tests/support/<usuario>.setup.ts
// y rellena los TODO con lo que encontraste al explorar la pantalla de
// login real — no dejes placeholders sin completar ni la dejes tal cual.
// Un archivo por usuario/rol distinto si el flujo necesita más de uno
// (ej. owner.setup.ts, admin.setup.ts).

// TODO: nombre de archivo de sesión, uno por usuario/rol.
const authFile = 'tests/support/auth/<usuario>.json';

setup('autenticar <usuario>', async ({ page }) => {
  // TODO: URL de la pantalla de login.
  await page.goto(process.env.LOGIN_URL ?? '<URL_DE_LOGIN>');

  // TODO: reemplaza los locators por los reales — rol accesible, label,
  // placeholder o data-testid identificados con browser_snapshot. Nunca
  // CSS/XPath salvo que no exista alternativa estable.
  // Credenciales SIEMPRE desde variables de entorno, nunca hardcodeadas.
  await page.getByLabel('<campo de usuario o correo>').fill(process.env.TEST_USER_EMAIL!);
  await page.getByLabel('<campo de contraseña>').fill(process.env.TEST_USER_PASSWORD!);
  await page.getByRole('button', { name: '<texto del botón de login>' }).click();

  // TODO: algo que solo aparece ya logueado (URL, texto, rol visible) —
  // confirma el login antes de guardar la sesión, no asumas que funcionó.
  await page.waitForURL('<URL_tras_login_exitoso>');

  await page.context().storageState({ path: authFile });
});
