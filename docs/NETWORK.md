# TARS AI Network Configuration

## 🔧 Netwerk Setup
- **Host IP**: 192.168.1.26
- **Backend Port**: 8002
- **Frontend Port**: 80 (via Nginx)
- **API Base URL**: http://192.168.1.26/api

## 📡 Firewall Rules
```bash
# Toegestane poorten
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 8002/tcp  # Backend direct
sudo ufw allow 3000/tcp  # Frontend dev

# Status check
sudo ufw status verbose
```

## 🌐 URL Schema
```
http://192.168.1.26/          → Frontend interface
http://192.168.1.26/health    → Health check (via Nginx)
http://192.168.1.26/api/      → API endpoints
http://localhost:8002/health  → Direct backend access
```

## 🔌 Service Ports
| Service | Port | Protocol | Access |
|---------|------|----------|---------|
| Nginx | 80 | HTTP | Public |
| Backend | 8002 | HTTP | Internal |
| Frontend | 3000 | HTTP | Development |

## 🚀 Snelstart Commands
```bash
# Test network connectivity
ping -c 4 192.168.1.26
curl -I http://192.168.1.26
curl -I http://192.168.1.26/health

# Check open ports
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :8002
```
