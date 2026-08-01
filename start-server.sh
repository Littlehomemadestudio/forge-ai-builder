#!/bin/bash
while true; do
  node /home/z/my-project/node_modules/.bin/next dev -p 3000 --turbo 2>&1 | tee -a /home/z/my-project/dev.log
  echo "Server crashed at $(date), restarting in 3s..." >> /home/z/my-project/dev.log
  sleep 3
done
