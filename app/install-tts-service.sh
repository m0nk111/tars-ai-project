#!/bin/bash
# Install and enable TARS Coqui TTS Docker systemd service
SERVICE=tts-server.service
TARGET=/etc/systemd/system/$SERVICE
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

sudo cp "$SCRIPT_DIR/$SERVICE" "$TARGET"
sudo systemctl daemon-reload
sudo systemctl enable $SERVICE
sudo systemctl start $SERVICE

echo "TARS TTS Docker service geïnstalleerd en gestart. Status:"
systemctl status $SERVICE --no-pager
