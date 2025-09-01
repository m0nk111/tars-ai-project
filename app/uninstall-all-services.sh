#!/bin/bash
# Disable and remove all systemd services in /app
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
for SERVICE in "$SCRIPT_DIR"/*.service; do
  [ -e "$SERVICE" ] || continue
  BASENAME=$(basename "$SERVICE")
  TARGET="/etc/systemd/system/$BASENAME"
  echo "Uninstalling $BASENAME..."
  sudo systemctl stop "$BASENAME"
  sudo systemctl disable "$BASENAME"
  sudo rm -f "$TARGET"
  echo "---"
done
sudo systemctl daemon-reload
echo "Alle TARS services zijn verwijderd."
