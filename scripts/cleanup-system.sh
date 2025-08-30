#!/bin/bash

# TARS AI System Cleanup Script
set -e

echo "=== TARS AI System Cleanup ==="

# Stop services
echo "Stopping services..."
sudo systemctl stop tars-assistant tars-web tars-voice 2>/dev/null || true
sudo systemctl disable tars-assistant tars-web tars-voice 2>/dev/null || true

# Remove service files
echo "Removing service files..."
sudo rm -f /etc/systemd/system/tars-*.service 2>/dev/null || true

# Remove nginx configs
echo "Removing nginx configs..."
sudo rm -f /etc/nginx/sites-available/tars /etc/nginx/sites-enabled/tars 2>/dev/null || true

# Kill processes
echo "Killing old processes..."
pkill -f "uvicorn|gunicorn|python.*main" 2>/dev/null || true

# Reload systemd
sudo systemctl daemon-reload
sudo systemctl restart nginx

echo "=== Cleanup completed ==="
echo "System is clean and ready for fresh installation"
