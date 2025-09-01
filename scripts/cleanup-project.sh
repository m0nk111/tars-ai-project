#!/bin/bash
# Clean up unused files and directories in TARS AI project
set -e

# Remove Python cache
find . -type d -name '__pycache__' -exec rm -rf {} +
find . -type f -name '*.pyc' -delete

# Remove legacy/unused directories
rm -rf web-ui
rm -rf venv

# Remove duplicate/unused DBs
rm -f app/conversation_memory.db web_ui/conversation_memory.db

# Remove unused generated files
rm -f generated/model_history.json

# Print result
echo "Project cleanup complete. Structure is now up-to-date."

# Project structure overview
cat <<EOF

Current structure:
tars-ai-project/
├── app/               # Python backend, TTS server, Dockerfile, systemd service files, install scripts
├── web_ui/            # Frontend: HTML, JS, CSS, templates, uploads
├── scripts/           # Utility scripts: backup, healthcheck, permissions, model management
├── install/           # Main installation and setup scripts
├── docs/              # Project documentation, changelog, requirements, API info
├── generated/         # Generated data (models, logs, uploads, not in git)
├── requirements.txt   # Python dependencies
└── README.md          # Project documentation and usage
EOF
