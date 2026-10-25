# Análisis de dependencias
Ejecute `npm audit` en `backend/` y `frontend/` y registre cada hallazgo (copie el resultado real, no inventado).

| Fecha | Paquete | Severidad | Vulnerabilidad / advisory | Decisión | Work Item |
|---|---|---|---|---|---|
| | | | | Actualizar / Aceptar riesgo (justificar) / Reemplazar | AB# |

Criterio: **crítica/alta** → corregir antes de merge (el pipeline falla); **media** → corregir en el sprint; **baja** → backlog. Revisión semanal con `npm outdated`.

## Hallazgo inicial (generado al crear el proyecto)
`npm audit` inicial: backend con 2 vulnerabilidades moderadas (aceptadas, bajo el umbral del pipeline); frontend con 1 alta y 1 moderada en `vite`/`esbuild` (solo servidor de desarrollo) -> **resuelto actualizando vite** (ver Task de dependencias). Ejecute `npm audit` de nuevo y complete la tabla con el detalle real.
