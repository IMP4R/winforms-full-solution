#!/bin/bash
# Quick deploy script for WinForms Web Simulator server
set -e

echo "=== WinForms Server Deploy ==="

# Kill existing server processes on port 8824
PIDS=$(lsof -ti :8824 2>/dev/null || true)
if [ -n "$PIDS" ]; then
  echo "Killing existing processes on port 8824: $PIDS"
  echo "$PIDS" | xargs kill -9 2>/dev/null || true
  sleep 1
fi

# Verify port is free
if lsof -i :8824 >/dev/null 2>&1; then
  echo "ERROR: Port 8824 still in use"
  exit 1
fi

# Clear old server log
rm -f /tmp/server.log

# Start server
nohup node server.js > /tmp/server.log 2>&1 &
SERVER_PID=$!
echo "Server started with PID $SERVER_PID"

# Wait for server to be ready
for i in {1..10}; do
  if curl -s http://localhost:8824/winforms.html >/dev/null 2>&1; then
    echo "Server ready at http://localhost:8824/winforms.html"
    echo "PID: $SERVER_PID"
    echo "Log: /tmp/server.log"
    exit 0
  fi
  sleep 1
done

echo "ERROR: Server failed to start"
cat /tmp/server.log
exit 1
