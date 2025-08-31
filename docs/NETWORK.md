# TARS AI Network Configuration

## 🔧 Network Setup
- Host IP: 192.168.1.26
- Backend Port: 8002
- Frontend Port: 80 (Nginx)
- API Base URL: http://192.168.1.26/api

## 📡 Firewall Rules
```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 8002/tcp
sudo ufw allow 3000/tcp
sudo ufw status verbose
```

## 🌐 URL Schema
```
http://192.168.1.26/          → Frontend interface
http://192.168.1.26/health    → Health check (Nginx)
http://192.168.1.26/api/      → API endpoints
http://localhost:8002/health  → Direct backend access
```

## 🔌 Service Ports
| Service  | Port  | Protocol | Access    |
|----------|-------|----------|-----------|
| Nginx    | 80    | HTTP     | Public    |
| Backend  | 8002  | HTTP     | Internal  |
| Frontend | 3000  | HTTP     | Dev       |

## 🚀 Quickstart Commands
```bash
ping -c 4 192.168.1.26
curl -I http://192.168.1.26
curl -I http://192.168.1.26/health
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :8002
```
curl -I http://192.168.1.26/health

# Check open ports
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :8002
```
