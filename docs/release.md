# Estrategia de release
**Ambientes:** DEV → QA → PROD (Azure DevOps Environments).

| Ambiente | Disparador | Control |
|---|---|---|
| DEV | Merge a `main` | Automático + smoke test |
| QA | Tras DEV | Aprobación manual del reviewer + validación funcional |
| PROD | Tag `vX.Y.Z` | Aprobación + Branch control (solo `main`/tags) + checklist |

**Checklist PROD:** pipeline verde · `npm audit` sin altas · changelog actualizado · QA aprobado · plan de rollback (redeploy del artefacto anterior).

**Versionado SemVer:** v0.1.0 (CRUD) → v0.2.0 (asignación/estados) → v0.3.0 (bitácora/filtros) → v0.4.0 (CI completo) → v0.5.0 (dashboard) → v0.9.0-rc.1 → **v1.0.0**.

**Configurar aprobaciones:** Pipelines → Environments → `incident-hub-qa`/`prod` → Approvals and checks → Approvals (+ Branch control en prod).
