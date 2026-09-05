#!/usr/bin/env bash
# Roda server/database/seed.ts contra o banco de produção (Cloud SQL), via
# Cloud SQL Auth Proxy. Use depois de migrate-production.sh quando o catálogo
# de dados de referência (tecnologias, categorias, tags) mudou — ex: novas
# tecnologias adicionadas ou categorias reatribuídas em server/database/seed.ts.
#
# É seguro rodar de novo a qualquer momento: os inserts de tecnologias fazem
# upsert por slug (corrigem nome/categoria sem duplicar), categorias/tags só
# inserem o que faltar, e o projeto de exemplo ("Portfolio CMS") só é criado
# se ainda não existir. Contas de teste (seedUsers) não são criadas em
# produção a menos que SEED_DEMO_ACCOUNTS=true esteja definido no ambiente.
#
# Pré-requisitos: os mesmos de migrate-production.sh (veja lá).
#
# Uso:
#   ./scripts/seed-production.sh

set -euo pipefail

PROJECT_ID="portfolio-cms-shintaku"
REGION="southamerica-east1"
INSTANCE_NAME="portfolio-cms-db"
DB_NAME="portfolio_cms"
DB_USER="portfolio_app"
DB_SECRET_NAME="db-password"
PROXY_PORT="5434"

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

cleanup() {
  echo "Encerrando o Cloud SQL Auth Proxy (PID ${PROXY_PID})..."
  kill "${PROXY_PID}" 2>/dev/null || true
  wait "${PROXY_PID}" 2>/dev/null || true
}
trap cleanup EXIT

for _ in $(seq 1 10); do
  if nc -z 127.0.0.1 "${PROXY_PORT}" 2>/dev/null; then
    break
  fi
  sleep 1
done

DB_PASSWORD="$(gcloud secrets versions access latest --secret="${DB_SECRET_NAME}" --project="${PROJECT_ID}")"
export DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@127.0.0.1:${PROXY_PORT}/${DB_NAME}"
unset DB_PASSWORD

# NODE_ENV=production já é o padrão fora deste script, mas fixamos aqui pra
# garantir que seedUsers() não crie contas de teste mesmo se alguém rodar
# isso com NODE_ENV diferente no shell.
export NODE_ENV="production"

echo "Rodando o seed contra produção..."
npx tsx server/database/seed.ts

unset DATABASE_URL
echo "Seed aplicado com sucesso."
