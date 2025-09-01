#!/bin/bash
# List all TARS systemd services in /app
cd "$(dirname "$0")"
echo "Available systemd service files in $(pwd):"
ls *.service 2>/dev/null || echo "No .service files found."
