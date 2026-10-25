#!/usr/bin/env bash
# Uso: bump-version.sh 0.2.0  -> actualiza package.json, crea commit y tag anotado
set -euo pipefail
V="${1:?Versión SemVer, ej. 0.2.0}"
for d in backend frontend; do (cd $d && npm version "$V" --no-git-tag-version >/dev/null); done
git add backend/package*.json frontend/package*.json CHANGELOG.md
git commit -m "chore(release): v$V"
git tag -a "v$V" -m "Incident Hub v$V"
echo "Listo. Publique con: git push origin main --follow-tags"
