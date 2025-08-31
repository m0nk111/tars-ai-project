# TARS AI Project Status - Live

## 🟢 Operationeel - 31 Augustus 2025

### ✅ Werkende Componenten
- **Backend Service**: FastAPI op poort 8002
- **Frontend Interface**: HTML/JS op poort 80 via Nginx
- **Nginx Reverse Proxy**: Correct geconfigureerd
- **Systemd Services**: Beheer via systemctl

### 🌐 Netwerk Configuratie
- **Server IP**: 192.168.1.26
- **Backend Port**: 8002
- **Frontend Port**: 80 (Nginx)
- **API Endpoints**: /api/, /health

### 🔧 Service Commands
```bash
# Backend service
sudo systemctl status tars-backend.service
sudo systemctl restart tars-backend.service

# Frontend service
sudo systemctl status tars-frontend.service
sudo systemctl restart tars-frontend.service

# Nginx service
sudo systemctl status nginx
sudo systemctl restart nginx
```

### 📋 API Endpoints
```bash
# Health check
curl http://192.168.1.26/health
curl http://localhost:8002/health

# API test
curl http://192.168.1.26/api/health
```

### 🚀 Snelstart
```bash
# Volledige status check
curl -s http://192.168.1.26/health | python3 -m json.tool
curl -s http://192.168.1.26/api/health | python3 -m json.tool

# Services status
sudo systemctl status tars-backend.service tars-frontend.service nginx.service
```
