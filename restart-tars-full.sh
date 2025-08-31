#!/bin/bash

# 1. Permissies fixen
sudo chown -R www-data:www-data /home/flip/tars-ai-project/web_ui/static
sudo chmod -R 755 /home/flip/tars-ai-project/web_ui/static

# 2. Backend en nginx herstarten
sudo systemctl restart tars-web-ui.service
sudo systemctl restart nginx

# 3. Test favicon direct en via nginx
echo "Test backend direct:"
curl -I http://127.0.0.1:8000/static/favicon.ico
echo "Test via nginx:"
curl -k -I https://localhost/static/favicon.ico

# 4. Test Ollama AI response
echo "Test Ollama AI response:"
curl -s -X POST http://localhost:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-r1:70b","prompt":"Hallo, wie ben jij?","stream":false}'

# 5. Toon backend logs
echo "Laatste backend logs:"
sudo journalctl -u tars-web-ui.service -e --no-pager | tail -n 30
