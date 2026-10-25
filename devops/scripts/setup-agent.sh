#!/usr/bin/env bash
# Instala y registra un agente autohospedado de Azure Pipelines (Linux x64).
# Requiere: ORG_URL (https://dev.azure.com/ORG), AGENT_PAT (PAT con Agent Pools: Read & manage)
# El PAT se pasa por variable de entorno; nunca lo escriba en el repo.
set -euo pipefail
: "${ORG_URL:?}" "${AGENT_PAT:?}"
POOL="${POOL:-IncidentHub-SelfHosted}"
VER="${AGENT_VERSION:-4.248.0}"   # verifique la última en Azure DevOps > Pool > New agent
mkdir -p ~/azagent && cd ~/azagent
curl -fsSL "https://download.agent.dev.azure.com/agent/${VER}/vsts-agent-linux-x64-${VER}.tar.gz" | tar xz
./config.sh --unattended --url "$ORG_URL" --auth pat --token "$AGENT_PAT" --pool "$POOL" --agent "$(hostname)-agent" --acceptTeeEula
sudo ./svc.sh install && sudo ./svc.sh start
