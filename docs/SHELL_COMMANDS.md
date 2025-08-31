# TARS AI - Essential Shell Commands

## 📋 Daily Operations

### Service Management
```bash
# Start all services
sudo systemctl start tars-backend tars-frontend nginx

# Stop all services
sudo systemctl stop tars-backend tars-frontend nginx

# Restart specific service
sudo systemctl restart tars-backend

# Status check
sudo systemctl status tars-backend --no-pager -l
```

### Log Inspection
```bash
# Follow logs in real-time
sudo tail -f /var/log/tars/backend.log
sudo tail -f /var/log/tars/frontend.log
sudo tail -f /var/log/nginx/tars-access.log

# Filter logs for errors
sudo journalctl -u tars-backend --since "1 hour ago" | grep -i error
```

### System Monitoring
```bash
# GPU status
nvidia-smi --query-gpu=timestamp,name,utilization.gpu,memory.used --format=csv -l 5

# Memory usage
watch -n 2 "free -h && echo '---' && df -h /"

# Process monitoring
top -b -n 1 | head -20
```

## 🛠️ Installation & Maintenance

### Installation Commands
```bash
# Full installation
sudo ./scripts/install.sh --all --yes

# Individual components
sudo ./scripts/install.sh --backend
sudo ./scripts/install.sh --frontend
sudo ./scripts/install.sh --nginx

# Reload configuration
sudo nginx -t && sudo systemctl reload nginx
```
