# IT Incident Hub

Aplicación web para registrar, asignar y dar seguimiento a incidentes de TI, construida como proyecto integrador DevOps (Azure Boards → Git → PR → CI → artefacto → release).

**Stack:** React + Vite · Node.js/Express · PostgreSQL · Docker · Azure Pipelines + GitHub Actions.

## Requisitos
Docker Desktop con Docker Compose.

## Instalación y ejecución
```bash
docker compose up --build
```
Abre `http://localhost:5173` para usar la aplicación. La API está disponible en
`http://localhost:3000/api/health`. Para detener los servicios, usa `Ctrl+C` y
ejecuta `docker compose down`; los datos se conservan para la próxima ejecución.

Los puertos se pueden cambiar con `FRONTEND_PORT`, `API_PORT` y `DB_PORT`. Para
personalizar las credenciales locales, define `POSTGRES_USER`, `POSTGRES_PASSWORD`
y `POSTGRES_DB` en un archivo `.env`.

Pruebas: `cd backend && npm test` · Lint: `npm run lint`.

## API
`POST/GET /api/incidentes` · `GET /api/incidentes/:id` · `PATCH /:id/asignar` · `PATCH /:id/estado` · `POST /:id/comentarios` · `GET /api/tecnicos` · `GET /api/dashboard` · `GET /api/health`.
Estados: NUEVO → ASIGNADO → EN_PROCESO → RESUELTO → CERRADO.

## Estructura
`backend/` API · `frontend/` UI · `database/` SQL · `tests/` pruebas · `devops/` scripts y backlog · `docs/` documentación · `.github/workflows/` GitHub Actions · `azure-pipelines.yml`.

## Responsables (completar)
| Rol | Usuario | Responsabilidad |
|---|---|---|
| Dev 1 | dev.uno | Backend, base de datos |
| Dev 2 | dev.dos | Frontend, dashboard |
| Reviewer | reviewer | Code review, QA |
| DevOps | devops | Pipelines, agente, release |

## Documentación
Ver `docs/`: arquitectura, branching, deuda técnica, seguridad, dependencias, release, evidencias.
