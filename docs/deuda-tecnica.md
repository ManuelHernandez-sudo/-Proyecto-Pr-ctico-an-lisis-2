# Deuda técnica

| ID | Descripción | Archivo afectado | Impacto | Estado | Work item |
|---|---|---|---|---|---|
| DT-01 | Los despliegues de DEV, QA y Prod están simulados con comandos `echo`, no despliegan el artefacto. | `azure-pipelines.yml` | No se publica la aplicación en los ambientes; los pasos actuales no validan un despliegue real. | Pendiente | AB#11 |
| DT-02 | El workflow de GitHub Actions no instala, compila ni valida las dependencias del frontend. | `.github/workflows/pr-checks.yml` | Cambios del frontend pueden llegar a `main` sin validación automatizada en GitHub Actions. | Pendiente | AB#11 |
| DT-03 | El contenedor del frontend ejecuta `npm run dev` en lugar de servir el build de producción. | `frontend/Dockerfile` | La imagen utiliza un servidor de desarrollo y no representa un despliegue de producción. | Pendiente | AB#11 |
| DT-04 | El script de versionado indica publicar directamente a `main`, en contra de la política de Pull Request. | `devops/scripts/bump-version.sh` | Puede promover un flujo que omita la revisión requerida para integrar cambios en `main`. | Pendiente | AB#11 |
| DT-05 | Operaciones relacionadas de incidente y bitácora ejecutan escrituras separadas sin transacción. | `backend/src/routes/incidentes.js` | Si falla una escritura posterior, los datos pueden quedar parcialmente actualizados. | Pendiente | AB#11 |
