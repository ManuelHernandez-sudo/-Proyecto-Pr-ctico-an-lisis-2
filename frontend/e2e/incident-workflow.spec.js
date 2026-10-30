import { test, expect } from '@playwright/test';
import { openIncidentList } from './fixtures.js';

test('filtra, asigna, avanza el estado y registra un comentario', async ({ page }) => {
  await openIncidentList(page);

  await page.locator('.filtros select').nth(1).selectOption('CRITICA');
  await expect(page.getByRole('row', { name: /ERP caído/ })).toBeVisible();
  await expect(page.getByRole('row', { name: /Mouse dañado/ })).toHaveCount(0);

  await page.getByRole('row', { name: /ERP caído/ }).click();
  const detail = page.locator('aside.panel');
  await expect(detail.getByRole('heading', { name: /ERP caído/ })).toBeVisible();
  await detail.getByLabel('Técnico').selectOption('2');
  await expect(detail.locator('.estado')).toHaveText('ASIGNADO');
  await expect(detail.locator('.bitacora')).toContainText('Asignado al técnico #2');

  await detail.getByRole('button', { name: 'Pasar a EN_PROCESO' }).click();
  await expect(detail.locator('.estado')).toHaveText('EN_PROCESO');
  await expect(detail.locator('.bitacora')).toContainText('Estado: ASIGNADO -> EN_PROCESO');

  await detail.getByPlaceholder('Agregar comentario').fill('Seguimiento confirmado');
  await detail.getByRole('button', { name: 'Comentar' }).click();
  await expect(detail.locator('.bitacora')).toContainText('Seguimiento confirmado');
});
