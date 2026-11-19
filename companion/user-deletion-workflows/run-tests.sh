#!/usr/bin/env bash
set -euo pipefail
specimen_dir="$(cd "$(dirname "$0")" && pwd)"
for executable in initdb pg_ctl psql python3; do
  command -v "$executable" >/dev/null || { echo "Missing executable: $executable" >&2; exit 1; }
done
case "$(pg_ctl --version)" in
  *" 18."*) ;;
  *) echo "This specimen requires PostgreSQL 18 binaries." >&2; exit 1 ;;
esac
specimen_workspace="$(mktemp -d "${TMPDIR:-/tmp}/user-deletion-specimen.XXXXXX")"
chmod 700 "$specimen_workspace"
specimen_started=false
cleanup() {
  specimen_result=$?
  trap - EXIT
  specimen_keep=false
  set +e
  if [[ "$specimen_started" == true ]]; then
    pg_ctl -D "$specimen_workspace/data" status >/dev/null 2>&1
    specimen_state=$?
    if [[ "$specimen_state" == 0 ]]; then
      pg_ctl -D "$specimen_workspace/data" -m immediate -w stop >"$specimen_workspace/stop.log" 2>&1
      [[ "$?" == 0 ]] || specimen_keep=true
    elif [[ "$specimen_state" != 3 ]]; then
      specimen_keep=true
    fi
  fi
  if [[ "$specimen_result" != 0 || "$specimen_keep" == true ]]; then
    for specimen_log in init.log server.log stop.log; do
      if [[ -f "$specimen_workspace/$specimen_log" ]]; then
        echo "Diagnostic: $specimen_log" >&2
        tail -30 "$specimen_workspace/$specimen_log" >&2
      fi
    done
  fi
  if [[ "$specimen_keep" == true ]]; then
    echo "Could not confirm PostgreSQL stopped; retained $specimen_workspace" >&2
    [[ "$specimen_result" != 0 ]] || specimen_result=1
  else
    rm -rf -- "$specimen_workspace"
  fi
  exit "$specimen_result"
}
trap cleanup EXIT
unset PGSERVICE PGSERVICEFILE PGHOSTADDR PGOPTIONS PGPASSWORD
export PGHOST="$specimen_workspace" PGPORT=55439 PGUSER=specimen PGDATABASE=postgres
initdb -D "$specimen_workspace/data" -U specimen --auth=trust --no-locale --encoding=UTF8 >"$specimen_workspace/init.log"
specimen_started=true
pg_ctl -D "$specimen_workspace/data" -l "$specimen_workspace/server.log" \
  -o "-F -k '$specimen_workspace' -h '' -p $PGPORT -c deletion_specimen.test_cluster=on" -w start >/dev/null
psql -X -v ON_ERROR_STOP=1 -q -f "$specimen_dir/schema.sql"
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s "$specimen_dir/tests" -v
