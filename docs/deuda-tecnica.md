# Deuda técnica
| ID | Deuda | Impacto | Estado | Work Item |
|---|---|---|---|---|
| DT-1 | Sin paginación en `GET /incidentes` (límite fijo 200) | Rendimiento | Pendiente | AB# |
| DT-2 | Sin autenticación/roles (autor de comentarios libre) | Seguridad | Pendiente | AB# |
| DT-3 | Sin migraciones versionadas (solo schema.sql) | Mantenibilidad | **Resolver** | AB# |
| DT-4 | Sin pruebas del frontend | Calidad | **Resolver** | AB# |
| DT-5 | Sin logging estructurado ni métricas | Operación | Pendiente | AB# |
| DT-6 | Pruebas de API usan mocks, no BD real | Calidad | Pendiente | AB# |
| DT-7 | Escrituras relacionadas de incidentes y bitácora sin transacción | Consistencia de datos | Resuelta | AB#16 |
| DT-8 | `frontend/Dockerfile` ejecutaba `npm run dev` en lugar de servir el build de producción | Entrega | Resuelta | AB#11 |

**Resolver al menos 2 (DT-3 y DT-4)** mediante Tasks, ramas `refactor/*` y PR con `AB#ID`; actualice la columna Estado/Work Item al cerrarlas.
