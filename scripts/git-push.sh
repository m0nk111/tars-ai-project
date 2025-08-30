#!/bin/bash
cd /home/flip/tars-ai-project
git add .
git commit -m "$(date +'%Y-%m-%d %H:%M:%S') - Project update" $@
git push origin main
echo "✅ Successvol gepushed naar m0nk111/tars-ai-project"
