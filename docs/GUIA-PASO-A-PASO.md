# Guía de ejecución (lo que debe hacer usted en Azure/GitHub)
1. **Azure DevOps:** cree proyecto → Boards → Import Work Items con `devops/backlog-azure-boards.csv` (ajuste "Assigned To" a sus usuarios; los Work Items quedan numerados).
2. **Usuarios:** use cuentas distintas (dev, reviewer) con `git config user.name/email` por clon.
3. **Repo semana 1:** suba el zip `incident-hub-s1`. Para PR reales, no suba todo a `main` de golpe: cree ramas `feature/AB<ID>-...` por módulo (crear incidente, listar/filtrar, estados, bitácora, dashboard, UI), un commit `AB#ID` y un PR por rama con revisión del segundo usuario.
4. **Semana 2:** nuevo repo con `incident-hub-s2` (mantenga el historial: `git remote add s2 <url>` y `git push s2 main`). Cree pool + agente (`devops/scripts/setup-agent.sh`), variable group, pipeline, GitHub Actions, y haga el fallo controlado (`devops/scripts/simular-fallo.md`).
5. **Semana 3:** repo con `incident-hub-s3`; resuelva 2 deudas, tags SemVer (`devops/scripts/bump-version.sh`), configure environments y publique v1.0.0.
6. Marque en el CHANGELOG cada versión conforme la libere.
