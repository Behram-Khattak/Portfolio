#!/usr/bin/env bash
# Start, stop, check, smoke-test or browser-drive the portfolio site. Run from the repository root.
set -u
PORT="${PORT:-3000}"
BASE="http://localhost:$PORT"
tmp="${TMPDIR:-/tmp}"; LOG="${tmp%/}/portfolio-server.log"

[ -f nuxt.config.ts ] || { echo "Run this from the repository root (nuxt.config.ts not found)."; exit 1; }

node_dir="$HOME/.nvm/versions/node/v$(cat .nvmrc 2>/dev/null)/bin"
[ -x "$node_dir/node" ] && export PATH="$node_dir:$PATH"

status_of() { curl -s -o /dev/null -w '%{http_code}' --max-time 10 "$@"; }
listening() { lsof -ti "tcp:$PORT" >/dev/null 2>&1; }

case "${1:-}" in
  start)
    mode="${2:-dev}"
    if listening; then
      echo "Something is already listening on port $PORT (/ returns $(status_of "$BASE/")). Reusing it."
      exit 0
    fi
    [ -f .env ] || { echo "No .env file. Copy .env.example to .env and fill it in (see README)."; exit 1; }
    required=$(sed -n 's/.*"node": *"\^\([0-9]*\).*/\1/p' package.json | head -1)
    actual=$(node -p 'process.versions.node.split(".")[0]')
    [ "$actual" -ge "${required:-22}" ] || { echo "Node $(node -v) is too old; need v$(cat .nvmrc). Install it with: nvm install $(cat .nvmrc)"; exit 1; }
    (exec 3<>/dev/tcp/127.0.0.1/3306) 2>/dev/null || { echo "MySQL is not answering on 127.0.0.1:3306. Start it in DBngin."; exit 1; }
    [ -d node_modules ] || { echo "Installing dependencies..."; npm install >/dev/null 2>&1 || { echo "npm install failed"; exit 1; }; }

    if [ "$mode" = prod ]; then
      echo "Building for production..."
      npm run build >"$LOG" 2>&1 || { echo "Build failed. Last lines of $LOG:"; tail -20 "$LOG"; exit 1; }
      PORT="$PORT" nohup node --env-file=.env .output/server/index.mjs >>"$LOG" 2>&1 &
    else
      nohup npx nuxt dev --port "$PORT" >"$LOG" 2>&1 &
    fi

    for _ in $(seq 1 60); do
      [ "$(status_of "$BASE/")" = 200 ] && { echo "Running ($mode) at $BASE  log: $LOG"; exit 0; }
      sleep 2
    done
    echo "Server did not come up within 2 minutes. Last lines of $LOG:"; tail -25 "$LOG"; exit 1
    ;;

  stop)
    if listening; then lsof -ti "tcp:$PORT" | xargs kill 2>/dev/null; pkill -f "nuxt dev --port $PORT" 2>/dev/null; echo "Stopped."; else echo "Nothing is listening on port $PORT."; fi
    ;;

  status)
    if listening; then echo "Listening on $BASE (/ returns $(status_of "$BASE/"))  log: $LOG"; else echo "Not running."; exit 1; fi
    ;;

  smoke)
    fail=0
    check() { # path expected-status
      got=$(status_of "$BASE$1")
      if [ "$got" = "$2" ]; then echo "ok   $got $1"; else echo "FAIL $got $1 (expected $2)"; fail=1; fi
    }
    for path in / /services /projects /blog /about /contact /admin/login /robots.txt /sitemap.xml /api/site /api/home; do check "$path" 200; done
    check /this-page-does-not-exist 404
    check /api/admin/dashboard 401
    got=$(status_of -X POST -H 'Content-Type: application/json' -H 'Origin: https://elsewhere.example' -d '{}' "$BASE/api/contact")
    if [ "$got" = 403 ]; then echo "ok   403 cross-origin POST /api/contact"; else echo "FAIL $got cross-origin POST /api/contact (expected 403)"; fail=1; fi
    [ "$fail" = 0 ] && echo "Smoke test passed." || echo "Smoke test FAILED. Server log: $LOG"
    exit "$fail"
    ;;

  drive)
    # Runs the browser driver with the project's Node (it needs the built-in WebSocket of Node 22+)
    shift
    exec node "$(dirname "$0")/drive.mjs" "$@"
    ;;

  *)
    echo "Usage: $0 start [dev|prod] | stop | status | smoke | drive [--out DIR] [--no-admin] [--pages /a,/b]"; exit 1
    ;;
esac
