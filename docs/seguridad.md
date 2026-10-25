# Seguridad
- **Secretos:** nunca en el repo. `.env` ignorado; `.env.example` sin valores reales.
- **Azure:** variable group `incident-hub-secrets` (marcar secretos con candado; opcional Key Vault). PAT del agente solo como variable de entorno al configurar.
- **GitHub:** Settings → Secrets and variables → Actions.
- **Código:** SQL parametrizado, validación de entrada, CORS configurable (`CORS_ORIGIN`), contenedor con usuario no root, errores sin detalles internos.
- **Pipeline:** `npm audit --audit-level=high` bloquea; dependency-review en PR de GitHub.
- **Si se filtra un secreto:** rotarlo de inmediato y limpiar el historial.
- **Pendiente:** autenticación, rate limiting, HTTPS en despliegue.
