# Deuda técnica

| ID | Deuda | Archivo afectado | Impacto | Estado | Work item |
|---|---|---|---|---|---|
| DT-01 | Sin paginación en `GET /incidentes` (límite fijo 200). | `backend/src/routes/incidentes.js` | Los clientes no pueden consultar resultados por páginas y las consultas quedan limitadas a 200 registros. | Pendiente | AB#11 |
| DT-02 | Sin autenticación ni roles; el autor de comentarios puede ser indicado por el cliente. | `backend/src/app.js`, `backend/src/routes/incidentes.js` | Usuarios no autenticados pueden acceder a operaciones y atribuir comentarios a otros autores. | Pendiente | AB#11 |
| DT-03 | Sin migraciones versionadas de base de datos; el esquema se inicializa desde un único SQL. | `database/schema.sql` | Los cambios de esquema no tienen historial ni un mecanismo ordenado para aplicarlos a bases existentes. | Pendiente | AB#11 |
| DT-04 | Sin pruebas automatizadas del frontend. | `frontend/package.json` | Los cambios de UI no cuentan con pruebas de regresión automatizadas. | Pendiente | AB#11 |
| DT-05 | Sin logging estructurado ni métricas de aplicación. | `backend/src/app.js`, `backend/src/server.js` | Cuesta filtrar, correlacionar y medir errores y operaciones en producción. | Pendiente | AB#11 |
| DT-06 | Las pruebas de API usan mocks y no validan integración con una base de datos real. | `tests/backend/api.test.js` | No detectan incompatibilidades de SQL, esquema o comportamiento real de PostgreSQL. | Pendiente | AB#11 |
| DT-07 | Los despliegues de DEV, QA y Prod están simulados con comandos `echo`, no despliegan el artefacto. | `azure-pipelines.yml` | No se publica la aplicación en los ambientes; los pasos actuales no validan un despliegue real. | Pendiente | AB#11 |
| DT-08 | El workflow de GitHub Actions no instala, compila ni valida las dependencias del frontend. | `.github/workflows/pr-checks.yml` | Cambios del frontend pueden llegar a `main` sin validación automatizada en GitHub Actions. | Pendiente | AB#11 |
| DT-09 | El contenedor del frontend ejecuta `npm run dev` en lugar de servir el build de producción. | `frontend/Dockerfile` | La imagen utiliza un servidor de desarrollo y no representa un despliegue de producción. | Pendiente | AB#11 |
| DT-10 | El script de versionado indica publicar directamente a `main`, en contra de la política de Pull Request. | `devops/scripts/bump-version.sh` | Puede promover un flujo que omita la revisión requerida para integrar cambios en `main`. | Pendiente | AB#11 |
| DT-11 | Operaciones relacionadas de incidente y bitácora ejecutan escrituras separadas sin transacción. | `backend/src/routes/incidentes.js` | Si falla una escritura posterior, los datos pueden quedar parcialmente actualizados. | Pendiente | AB#11 |
