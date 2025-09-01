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

## Directory Descriptions

- **app/**: Backend code, TTS server, Docker, systemd services, install scripts
- **web_ui/**: Frontend code, static assets, templates, uploads
- **scripts/**: Bash scripts for backup, healthcheck, permissions, etc.
- **install/**: Main installer and hardware setup scripts
- **docs/**: Documentation, changelog, requirements, API info
- **generated/**: Models, logs, uploads (not tracked in git)
- **requirements.txt**: Python dependencies
- **README.md**: Main project documentation

## Bash Scripts Overview

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

## Model Management Features
- **Backend**: FastAPI endpoints for listing, downloading, activating, and viewing details of AI models. Disk space check included.
- **Frontend**: Settings panel in web UI for model selection, download, details, and language switching (English/Dutch).

### Relevant Files
- `app/main.py`: Backend API for model management
- `web_ui/templates/index.html`: Settings panel UI
- `web_ui/static/js/app.js`: Frontend logic for model management

### Endpoints
- `/api/models/downloaded`
- `/api/models/all`
- `/api/models/details/{model_id}`
- `/api/models/download/{model_id}`
- `/api/models/activate/{model_id}`
- `/api/models/active`
- `/api/storage/free`
