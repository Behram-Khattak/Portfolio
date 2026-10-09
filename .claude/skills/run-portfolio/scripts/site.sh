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
    actual=$(node -p 'process.versions.node.split(".")[0]')
    [ "$actual" -ge 22 ] || { echo "Node $(node -v) is too old; need v$(cat .nvmrc). Install it with: nvm install $(cat .nvmrc)"; exit 1; }
    [ -d node_modules ] || { echo "Installing dependencies..."; npm install >/dev/null 2>&1 || { echo "npm install failed"; exit 1; }; }

    if [ "$mode" = static ]; then
      # What GitHub Pages will serve: pre-rendered files behind a plain file server
      echo "Generating the static site..."
      npx nuxt generate >"$LOG" 2>&1 || { echo "Generate failed. Last lines of $LOG:"; tail -20 "$LOG"; exit 1; }
      nohup npx --yes serve .output/public -l "$PORT" >>"$LOG" 2>&1 &
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
      got=$(status_of -L "$BASE$1")
      if [ "$got" = "$2" ]; then echo "ok   $got $1"; else echo "FAIL $got $1 (expected $2)"; fail=1; fi
    }
    for path in / /services /projects /about /contact /robots.txt /sitemap.xml /favicon.ico; do check "$path" 200; done
    # Every project in the data file has a page
    for slug in $(sed -n 's/.*"slug": "\([^"]*\)".*/\1/p' app/data/projects.ts); do check "/projects/$slug" 200; done
    # Removed on purpose: these must not come back
    for path in /blog /admin /api/site /this-page-does-not-exist; do check "$path" 404; done
    [ "$fail" = 0 ] && echo "Smoke test passed." || echo "Smoke test FAILED. Server log: $LOG"
    exit "$fail"
    ;;

  drive)
    # Runs the browser driver with the project's Node (it needs the built-in WebSocket of Node 22+)
    shift
    exec node "$(dirname "$0")/drive.mjs" "$@"
    ;;

  *)
    echo "Usage: $0 start [dev|static] | stop | status | smoke | drive [--out DIR] [--pages /a,/b]"; exit 1
    ;;
esac
