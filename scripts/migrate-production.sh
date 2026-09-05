#!/usr/bin/env bash
# Aplica as migrations pendentes (drizzle/migrations/*.sql) no banco de
# produção (Cloud SQL), via Cloud SQL Auth Proxy.
#
# Por que isso é manual: o workflow de CI/CD (.github/workflows/ci-cd.yml)
# builda e faz deploy do código a cada push na main, mas deliberadamente
# NÃO roda migrations de schema em produção. Toda vez que uma mudança de
# schema é commitada, rode este script ANTES (ou logo depois) do deploy —
# senão o código novo passa a consultar colunas que ainda não existem no
# banco, e as queries que tocam essas tabelas quebram em produção.
#
# Pré-requisitos:
#   - gcloud CLI autenticado com uma conta que tenha permissão de leitura
#     no Secret Manager e de conexão no Cloud SQL deste projeto
#     (`gcloud auth list` deve mostrar a conta ativa).
#   - cloud-sql-proxy instalado (`brew install cloud-sql-proxy` no macOS).
#
# Uso:
#   ./scripts/migrate-production.sh
#
# A senha do banco nunca é impressa: fica só em uma variável de ambiente
# local, usada diretamente pelo drizzle-kit e removida ao final.

set -euo pipefail

PROJECT_ID="portfolio-cms-shintaku"
REGION="southamerica-east1"
INSTANCE_NAME="portfolio-cms-db"
DB_NAME="portfolio_cms"
DB_USER="portfolio_app"
DB_SECRET_NAME="db-password"
PROXY_PORT="5433"

INSTANCE_CONNECTION_NAME="${PROJECT_ID}:${REGION}:${INSTANCE_NAME}"

if ! command -v cloud-sql-proxy >/dev/null 2>&1; then
  echo "cloud-sql-proxy não encontrado. Instale com: brew install cloud-sql-proxy" >&2
  exit 1
fi

if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
  echo "Nenhuma conta gcloud autenticada. Rode: gcloud auth login" >&2
  exit 1
fi

echo "Subindo o Cloud SQL Auth Proxy (${INSTANCE_CONNECTION_NAME}) na porta ${PROXY_PORT}..."
cloud-sql-proxy --port "${PROXY_PORT}" "${INSTANCE_CONNECTION_NAME}" &
PROXY_PID=$!

# Garante que o proxy é encerrado ao sair do script, com sucesso ou erro.
cleanup() {
  echo "Encerrando o Cloud SQL Auth Proxy (PID ${PROXY_PID})..."
  kill "${PROXY_PID}" 2>/dev/null || true
  wait "${PROXY_PID}" 2>/dev/null || true
}
trap cleanup EXIT

# Dá um tempo para o proxy subir e aceitar conexões antes de usá-lo.
for _ in $(seq 1 10); do
  if nc -z 127.0.0.1 "${PROXY_PORT}" 2>/dev/null; then
    break
  fi
  sleep 1
done

DB_PASSWORD="$(gcloud secrets versions access latest --secret="${DB_SECRET_NAME}" --project="${PROJECT_ID}")"
export DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@127.0.0.1:${PROXY_PORT}/${DB_NAME}"
unset DB_PASSWORD

echo "Rodando drizzle-kit migrate contra produção..."
npx drizzle-kit migrate

unset DATABASE_URL
echo "Migrations aplicadas com sucesso."
