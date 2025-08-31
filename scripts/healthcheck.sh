#!/bin/bash
# Health check backend, nginx, ollama
systemctl is-active --quiet tars-web-ui.service && echo "Backend: OK" || echo "Backend: FOUT"
systemctl is-active --quiet nginx && echo "Nginx: OK" || echo "Nginx: FOUT"
curl -s http://localhost:11434/api/tags | grep models && echo "Ollama: OK" || echo "Ollama: FOUT"

# Notify bij errors
if ! systemctl is-active --quiet tars-web-ui.service; then
  bash /home/flip/tars-ai-project/scripts/notify-error.sh "Backend service FOUT"
fi
if ! systemctl is-active --quiet nginx; then
  bash /home/flip/tars-ai-project/scripts/notify-error.sh "Nginx service FOUT"
fi
if ! curl -s http://localhost:11434/api/tags | grep models > /dev/null; then
  bash /home/flip/tars-ai-project/scripts/notify-error.sh "Ollama service FOUT"
fi
