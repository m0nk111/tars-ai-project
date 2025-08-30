# Configuration Guide - TARS AI Assistant

## Environment Variables

Create `.env` file in project root:

```bash
# Web Interface
PORT=5000
HOST=0.0.0.0
SSL_CERT_PATH=/etc/ssl/certs/tars.crt
SSL_KEY_PATH=/etc/ssl/private/tars.key

# AI Model
MODEL_PATH=./generated/models/default
MODEL_TYPE=deepseek
MAX_TOKENS=4096
TEMPERATURE=0.7

# ChromaDB
CHROMA_DB_PATH=./generated/chromadb
CHROMA_COLLECTION=conversations

# Voice Settings
TTS_ENABLED=true
TTS_VOICE=dutch-male
SPEECH_RATE=1.0

# File Upload
MAX_FILE_SIZE=50MB
ALLOWED_EXTENSIONS=txt,pdf,png,jpg,jpeg,mp3,wav
UPLOAD_FOLDER=./generated/uploads
```

## Model Configuration

### Model Selection
Edit `config/models.yml`:

```yaml
models:
  default:
    name: "deepseek-coder"
    path: "./generated/models/deepseek-coder"
    type: "transformers"
    required_vram: 8

  large:
    name: "deepseek-llm"
    path: "./generated/models/deepseek-llm" 
    type: "transformers"
    required_vram: 16

  dutch:
    name: "dutch-ai-model"
    path: "./generated/models/dutch-model"
    type: "transformers"
    required_vram: 12
```

## Web Interface Configuration

### Theme Settings
```javascript
{
  "theme": "dark",
  "primaryColor": "#2563eb",
  "secondaryColor": "#1e40af",
  "fontFamily": "'Inter', sans-serif"
}
```

## Service Configuration

### Systemd Services
Located in `services/` directory:

- `tars-assistant.service` - Main AI service
- `tars-web.service` - Web interface
- `tars-voice.service` - TTS service

### Nginx Configuration
`/etc/nginx/sites-available/tars`:

```nginx
server {
    listen 443 ssl;
    server_name ai-kvm1.local;

    ssl_certificate /etc/ssl/certs/tars.crt;
    ssl_certificate_key /etc/ssl/private/tars.key;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Network Configuration

### Static IP (KVM Guest)
`/etc/netplan/01-netcfg.yaml`:

```yaml
network:
  version: 2
  ethernets:
    enp1s0:
      addresses: [192.168.1.26/24]
      gateway4: 192.168.1.1
      nameservers:
        addresses: [8.8.8.8, 1.1.1.1]
```

## Performance Tuning

### GPU Settings
```bash
# NVIDIA settings
nvidia-smi -pm 1
nvidia-smi -pl 200
```

### Memory Optimization
```bash
# Increase swap space
sudo fallocate -l 8G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

## Monitoring

### Log Files
- `/var/log/tars/assistant.log`
- `/var/log/tars/web.log`
- `/var/log/tars/voice.log`

### Status Commands
```bash
# Check services
systemctl status tars-*

# Check GPU usage
nvidia-smi

# Check memory
free -h

# Check disk space
df -h
```
