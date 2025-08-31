# TARS AI - Essentiële Shell Commando's

## 📋 Dagelijkse Operationele Commando's

### Service Management
```bash
# Start alle services
sudo systemctl start tars-backend tars-frontend nginx

# Stop alle services
sudo systemctl stop tars-backend tars-frontend nginx

# Herstart specifieke service
sudo systemctl restart tars-backend

# Status check
sudo systemctl status tars-backend --no-pager -l
```

### Log Inspection
```bash
# Real-time logs volgen
sudo tail -f /var/log/tars/backend.log
sudo tail -f /var/log/tars/frontend.log
sudo tail -f /var/log/nginx/tars-access.log

# Logs filteren op errors
sudo journalctl -u tars-backend --since "1 hour ago" | grep -i error
```

### System Monitoring
```bash
# GPU status
nvidia-smi --query-gpu=timestamp,name,utilization.gpu,memory.used --format=csv -l 5

# Geheugen gebruik
watch -n 2 "free -h && echo '---' && df -h /"

# Process monitoring
top -b -n 1 | head -20
```

## 🛠️ Installatie & Onderhoud

### Installatie Commando's
```bash
# Volledige installatie
sudo ./scripts/install.sh --all --yes

# Individuele componenten
sudo ./scripts/install.sh --backend
sudo ./scripts/install.sh --frontend
sudo ./scripts/install.sh --nginx

# Configuratie herladen
sudo nginx -t && sudo systemctl reload nginx
```
