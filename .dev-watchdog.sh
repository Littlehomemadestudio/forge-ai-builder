#!/bin/bash
# Simple watchdog - restarts dev server if it dies
while true; do
  if ! pgrep -f "next-server" > /dev/null 2>&1; then
    echo "[$(date)] Dev server not running, starting..." >> /tmp/watchdog.log
    cd /home/z/my-project
    bun run dev >> /tmp/dev.log 2>&1 &
    sleep 10
  fi
  sleep 30
done
