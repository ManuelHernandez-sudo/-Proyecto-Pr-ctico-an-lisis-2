import { test, expect } from '@playwright/test';
import { openIncidentList } from './fixtures.js';

test('consulta indicadores de incidentes y distribución', async ({ page }) => {
  await openIncidentList(page);

  await page.getByRole('button', { name: 'Indicadores' }).click();
  await expect(page.locator('.kpis')).toContainText('2Abiertos');
  await expect(page.locator('.kpis')).toContainText('1Cerrados');
  await expect(page.locator('.kpis')).toContainText('1Críticos activos');
  await expect(page.getByRole('heading', { name: 'Por categoría' })).toBeVisible();
  await expect(page.locator('.barras').first()).toContainText('SOFTWARE');
  await expect(page.getByRole('heading', { name: 'Por técnico' })).toBeVisible();
  await expect(page.locator('.barras').nth(1)).toContainText('Ana Ruiz');
});
