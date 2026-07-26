#!/bin/bash
cd /home/z/my-project
rm -rf .next/dev/lock
while true; do
  rm -rf .next/dev/lock 2>/dev/null
  node ./node_modules/.bin/next dev -p 3000 > /home/z/my-project/dev.log 2>&1 &
  PID=$!
  echo "Server PID: $PID"
  # Wait up to 60 seconds for process to die
  while kill -0 $PID 2>/dev/null; do
    sleep 5
  done
  echo "Server died, restarting in 3s..."
  sleep 3
done
