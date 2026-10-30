import { test, expect } from '@playwright/test';
import { openIncidentList } from './fixtures.js';

test('reporta un incidente y aparece en la lista', async ({ page }) => {
  await openIncidentList(page);

  await page.getByRole('button', { name: 'Reportar' }).click();
  await page.getByLabel('Título').fill('Impresora sin conexión');
  await page.getByLabel('Descripción').fill('La impresora del segundo piso no aparece en la red');
  await page.getByLabel('Usuario').fill('jmartinez');
  await page.getByRole('button', { name: 'Crear incidente' }).click();

  const createdIncident = page.getByRole('row', { name: /Impresora sin conexión/ });
  await expect(createdIncident).toBeVisible();
  await expect(createdIncident).toContainText('NUEVO');
  await createdIncident.click();
  await expect(page.locator('aside.panel .meta')).toContainText('jmartinez');
  await expect(page.locator('aside.panel .bitacora')).toContainText('Incidente creado');
});
