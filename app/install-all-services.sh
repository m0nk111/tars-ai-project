#!/bin/bash
# Install and enable all systemd services in /app
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
for SERVICE in "$SCRIPT_DIR"/*.service; do
  [ -e "$SERVICE" ] || continue
  BASENAME=$(basename "$SERVICE")
  TARGET="/etc/systemd/system/$BASENAME"
  echo "Installing $BASENAME..."
  sudo cp "$SERVICE" "$TARGET"
  sudo systemctl daemon-reload
  sudo systemctl enable "$BASENAME"
  sudo systemctl restart "$BASENAME"
  echo "Status for $BASENAME:"
  systemctl status "$BASENAME" --no-pager
  echo "---"
done
