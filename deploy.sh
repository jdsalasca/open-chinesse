#!/usr/bin/env bash
# Despliega Open Chinesse en el servidor de eridu.top.
# Uso: ./deploy.sh [destino]   (por defecto atopnuc@192.168.1.100:~/sitios/open-chinesse)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
TARGET="${1:-atopnuc@192.168.1.100:/home/atopnuc/sitios/open-chinesse}"
HOST="${TARGET%%:*}"
DIR="${TARGET#*:}"

cd "$ROOT"

echo "==> Build del SPA dentro del backend"
pnpm build:server

echo "==> Empaquetando el jar"
(cd backend && mvn -q -B -DskipTests package)

JAR="$(ls -1 backend/target/open-chinesse-*.jar | grep -v original | head -1)"
echo "    $JAR ($(du -h "$JAR" | cut -f1))"

echo "==> Copiando a $TARGET"
ssh "$HOST" "mkdir -p '$DIR/data'"
scp -q "$JAR" "$HOST:$DIR/app.jar"
scp -q deploy/docker-compose.yml deploy/.env.example "$HOST:$DIR/"
ssh "$HOST" "test -f '$DIR/.env' || cp '$DIR/.env.example' '$DIR/.env'"

echo "==> Reiniciando contenedor"
ssh "$HOST" "cd '$DIR' && sudo docker compose up -d --remove-orphans"

echo "==> Esperando health"
for _ in $(seq 1 30); do
  if ssh "$HOST" "curl -fsS http://127.0.0.1:8091/actuator/health >/dev/null 2>&1"; then
    echo "    backend OK"
    break
  fi
  sleep 2
done

echo "==> Verificación pública"
curl -s -o /dev/null -w "  /            %{http_code}\n" https://open-chinesse.eridu.top/
curl -s -o /dev/null -w "  /api/me      %{http_code}\n" https://open-chinesse.eridu.top/api/me
curl -s -o /dev/null -w "  /api/health  %{http_code}\n" https://open-chinesse.eridu.top/actuator/health
