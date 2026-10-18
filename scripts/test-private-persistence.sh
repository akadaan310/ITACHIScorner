#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
docker_local() {
  env -u DOCKER_HOST -u DOCKER_CONTEXT -u DOCKER_TLS -u DOCKER_TLS_VERIFY -u DOCKER_CERT_PATH \
    docker --host=unix:///var/run/docker.sock "$@"
}
test_container="itachi-private-pg-$(id -u)-$$"
test_socket=$(mktemp -d /tmp/itachi-private-pg-XXXXXXXX)
cleanup() {
  docker_local exec --user 0 "$test_container" chown "$(id -u):$(id -g)" /var/run/postgresql >/dev/null 2>&1 || true
  docker_local exec --user 0 "$test_container" chmod 0777 /var/run/postgresql >/dev/null 2>&1 || true
  docker_local rm -f "$test_container" >/dev/null 2>&1 || true
  rm -rf "$test_socket"
}
trap cleanup EXIT
# Unix socket only: no published port and no network. The hosted CLI has no test-mode switch.
chmod 0777 "$test_socket"
docker_local run --detach --name "$test_container" --network none \
  --mount "type=bind,source=$test_socket,target=/var/run/postgresql" \
  -e POSTGRES_HOST_AUTH_METHOD=trust postgres:17.6 >/dev/null
for attempt in $(seq 1 60); do
  if docker_local exec "$test_container" pg_isready -h 127.0.0.1 -U postgres >/dev/null 2>&1; then break; fi
  if [ "$attempt" = 60 ]; then echo 'Local Postgres did not become ready' >&2; exit 1; fi
  sleep 0.5
done
sql() { docker_local exec -i "$test_container" psql -X -q -o /dev/null -v ON_ERROR_STOP=1 -U postgres; }
sql < supabase/tests/bootstrap.sql
for migration in supabase/migrations/*.sql; do sql < "$migration"; done
ITACHI_TEST_PG_SOCKET="$test_socket" node tests/private-persistence.integration.mjs
