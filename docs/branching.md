# Estrategia de ramas
- `main`: siempre estable, protegida (PR obligatorio, 1 revisor, build validation, vínculo a Work Item).
- Ramas de trabajo: `feature/AB<ID>-descripcion`, `fix/AB<ID>-...`, `refactor/AB<ID>-...`.
- Commits (Conventional Commits) con trazabilidad: `feat(api): crea incidentes AB#12`.
- Flujo: Task → rama → commit `AB#ID` → PR → review → merge (squash) → pipeline → artefacto → release.
- Releases: tags anotados `vX.Y.Z` sobre `main` (SemVer). Hotfix: `fix/*` → PR → tag de parche.
- Política: nadie hace push directo a `main`.
