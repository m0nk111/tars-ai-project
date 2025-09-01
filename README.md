# TARS AI Assistant Project

![TARS](https://img.shields.io/badge/Project-TARS_AI-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Python](https://img.shields.io/badge/Python-3.10%2B-blue)

A self-hosted AI chat assistant inspired by Interstellar's TARS, featuring dark mode, file upload capabilities, and persistent memory using ChromaDB.


---

**Note**: This project is under active development. Features and documentation may change.

## 🚀 Features

- Persistent conversation memory (SQLite)
- Automatic database initialization
- Efficient chat history retrieval
- Dark mode interface
- File upload (drag & drop)
- Multiple model selection with persistence
- Code formatting (copy/download)
- Real-time system monitoring (CPU, RAM, GPU, VRAM, temperatures)
- WebSocket-based chat
- Modern chat window layout with clear header and input areas
- Spinner animation and "TARS is thinking..." indicator during AI response
- Persistent chat history in browser (localStorage)
- Always-visible chat scroll bar for long conversations
- Coqui TTS (Docker, automatisch via systemd)
- Upcoming: ChromaDB, voice input

## 🗃️ Database Structure

```sql
-- SQLite schema
CREATE TABLE conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/m0nk111/tars-ai-project.git
cd tars-ai-project

# Run installation script
sudo bash install/main-install.sh

# Build en start TTS Docker service
cd app
bash build-tts-docker.sh
sudo bash install-tts-service.sh

# Check service status
sudo systemctl status tts-server.service
sudo systemctl status tars-backend.service tars-frontend.service nginx

# View logs
sudo journalctl -u tts-server.service -f --no-pager
sudo journalctl -u tars-backend.service -f --no-pager
sudo journalctl -u tars-frontend.service -f --no-pager
sudo tail -f /var/log/nginx/tars-access.log
```

## ✅ Current Status

- Ubuntu 24.04 KVM Guest
- NVIDIA RTX 3060 GPU Passthrough
- CUDA 12.9 + PyTorch 2.8.0
- Python 3.12 Virtual Environment
- FastAPI Web Interface
- Ollama AI Integration
- Model Switching
- File Upload
- Code Formatting
- ChromaDB, TTS/Voice (Next)

## 📁 Project Structure

```text
tars-ai-project/
├── app/               # Python backend, TTS server, Dockerfile, systemd service files, install scripts
│   ├── tts_server.py  # Coqui TTS FastAPI server
│   ├── Dockerfile     # TTS Docker build
│   ├── *.service      # Systemd service files
│   ├── *.sh           # Build/run/install/uninstall scripts
├── web_ui/            # Frontend: HTML, JS, CSS, templates, uploads
│   ├── static/        # CSS, JS, favicon
│   ├── templates/     # HTML templates
│   ├── uploads/       # User uploaded files
│   └── main.py        # FastAPI web server
├── scripts/           # Utility scripts: backup, healthcheck, permissions, model management
├── install/           # Main installation and setup scripts
│   └── host-setup/    # GPU, KVM, network setup scripts
├── docs/              # Project documentation, changelog, requirements, API info
├── generated/         # Generated data (models, logs, uploads, not in git)
├── requirements.txt   # Python dependencies
└── README.md          # Project documentation and usage
```

### Directory Descriptions
- **app/**: Backend code, TTS server, Docker, systemd services, install scripts
- **web_ui/**: Frontend code, static assets, templates, uploads
- **scripts/**: Bash scripts voor backup, healthcheck, permissies, etc.
- **install/**: Main installer en hardware setup scripts
- **docs/**: Documentatie, changelog, requirements, API info
- **generated/**: Models, logs, uploads (not tracked in git)
- **requirements.txt**: Python dependencies
- **README.md**: Main project documentation

## 🗃️ Bash Scripts Overview

**app/**
- `build-tts-docker.sh`: Build Coqui TTS Docker image
- `run-tts-docker.sh`: Run TTS Docker container
- `install-tts-service.sh`: Install TTS systemd service
- `install-all-services.sh`: Install all systemd services in app/
- `uninstall-all-services.sh`: Remove all systemd services in app/
- `list-services.sh`: List available systemd service files

**scripts/**
- `backup.sh`: Backup project data
- `healthcheck.sh`: System health monitoring
- `fix-permissions.sh`: Fix file and directory permissions
- `frontend-reload.sh`: Reload frontend
- `model_manager.py`: Manage AI models
- `notify-error.sh`: Send error notifications
- `cleanup-logs.sh`, `cleanup-system.sh`: Maintenance scripts

**install/**
- `main-install.sh`: Main installer
- `python-setup.sh`, `system-dependencies.sh`, etc.: Environment setup
- `host-setup/`: GPU, KVM, network setup scripts

Scripts die niet meer relevant zijn, kun je veilig verwijderen. Wil je een automatische opschoonfunctie? Geef het aan!

---

# TARS AI Project Structure

```text
tars-ai-project/
├── app/               # Python backend, TTS server, Dockerfile, systemd service files, install scripts
├── web_ui/            # Frontend: HTML, JS, CSS, templates, uploads
├── scripts/           # Utility scripts: backup, healthcheck, permissions, model management
├── install/           # Main installation and setup scripts
├── docs/              # Project documentation, changelog, requirements, API info
├── generated/         # Generated data (models, logs, uploads, not in git)
├── requirements.txt   # Python dependencies
└── README.md          # Project documentation and usage
```

## Model Management (Settings Panel)

The settings panel allows you to manage AI models directly from the web UI:
- **Select active model**: Choose from downloaded models to activate.
- **View all available models**: See all models that can be downloaded, with details (name, type, size, description).
- **Download models**: Download new models if enough disk space is available.
- **Model details**: View model information before downloading.
- **Disk space check**: Shows available disk space before downloading.
- **Language selection**: Switch between English (default) and Dutch for the UI.

### Backend Endpoints
- `/api/models/downloaded`: List downloaded models
- `/api/models/all`: List all available models
- `/api/models/details/{model_id}`: Get details for a model
- `/api/models/download/{model_id}`: Download a model
- `/api/models/activate/{model_id}`: Activate a model
- `/api/models/active`: Get active model
- `/api/storage/free`: Get available disk space

### Frontend Usage
- Open the settings panel via the navigation bar.
- Select language (English/Dutch).
- Manage models: view, download, activate.
- Disk space and model details are shown automatically.
