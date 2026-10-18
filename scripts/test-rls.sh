#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
# Explicit local daemon; never target an inherited remote Docker context.
docker_local() {
  env -u DOCKER_HOST -u DOCKER_CONTEXT -u DOCKER_TLS -u DOCKER_TLS_VERIFY -u DOCKER_CERT_PATH \
    docker --host=unix:///var/run/docker.sock "$@"
}
test_container="itachi-rls-$(id -u)-$$"
trap 'docker_local rm -f "$test_container" >/dev/null 2>&1 || true' EXIT
docker_local run --detach --name "$test_container" --network none \
  -e POSTGRES_HOST_AUTH_METHOD=trust postgres:17.6 >/dev/null
for attempt in $(seq 1 60); do
  if docker_local exec "$test_container" pg_isready -h 127.0.0.1 -U postgres >/dev/null 2>&1; then break; fi
  if [ "$attempt" = 60 ]; then echo 'Local Postgres did not become ready' >&2; exit 1; fi
  sleep 0.5
done
sql() { docker_local exec -i "$test_container" psql -X -q -o /dev/null -v ON_ERROR_STOP=1 -U postgres; }
sql < supabase/tests/bootstrap.sql
shopt -s nullglob
for migration in supabase/migrations/*.sql; do sql < "$migration"; done
sql < supabase/tests/rls.sql
sql < supabase/tests/advisors.sql
echo 'Postgres 17 RLS and relational publication gates passed.'
