#!/usr/bin/env bash
# Uso: smoke-test.sh https://host
set -euo pipefail
URL="${1:?Falta URL}"
curl -fsS "$URL/api/health" | grep -q '"status":"ok"' && echo "Smoke test OK"
