# Fallo controlado de pipeline (evidencia obligatoria)

1. Work Item: cree un **Bug** "Pipeline falla por regresión en validación" (AB#N).
2. `git switch -c fix/AB<N>-regresion-validacion`
3. Provoque el fallo: en `tests/backend/transitions.test.js` cambie `['NUEVO','ASIGNADO',true]` a `false`
   (o agregue una dependencia con vulnerabilidad alta para romper `npm audit`).
4. Commit `test: simula regresión AB#N`, abra PR. **Guarde el run rojo** (URL del run).
5. Diagnostique en el log, documente en `docs/evidencias.md` (causa, hora, run id).
6. Corrija en un nuevo commit `fix: corrige prueba AB#N`, push, run verde. Complete el PR y cierre el Bug.
