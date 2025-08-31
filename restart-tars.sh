#!/bin/bash

# Kill alle processen op poort 8000
sudo fuser -k 8000/tcp

# Herstart systemd service
sudo systemctl restart tars-web-ui.service

# Test favicon via backend en nginx
echo "Test backend direct:"
curl -I http://127.0.0.1:8000/static/favicon.ico
echo "Test via nginx:"
curl -k -I https://localhost/static/favicon.ico

# Toon backend logs
echo "Laatste backend logs:"
sudo journalctl -u tars-web-ui.service -e --no-pager | tail -n 30
