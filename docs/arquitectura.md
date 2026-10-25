# Arquitectura
```
Usuario → Frontend (React/Vite) → API REST (Node/Express) → PostgreSQL
```
- **Frontend:** SPA; consume `/api` (proxy en desarrollo, `VITE_API_URL` en despliegue).
- **Backend:** Express; rutas en `routes/`, reglas de estados en `transitions.js`, validación en `validate.js`, errores centralizados.
- **Datos:** tablas `tecnicos`, `incidentes`, `comentarios` con restricciones CHECK y llaves foráneas (`database/schema.sql`).
- **Decisiones:** stack JS único para simplificar CI; PostgreSQL por integridad relacional; consultas parametrizadas contra inyección SQL.
- **Entrega:** artefacto `incident-hub-package` (zip) generado por Azure Pipelines.
