#!/bin/bash

# TARS AI Assistant - Main Installation Script
set -e

echo "=========================================="
echo "TARS AI Assistant Installation"
echo "=========================================="

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "Please run as root or use sudo"
    exit 1
fi

# Load configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "Project root: $PROJECT_ROOT"

# Source utility functions
if [ -f "$SCRIPT_DIR/utils.sh" ]; then
    source "$SCRIPT_DIR/utils.sh"
else
    echo "Error: utils.sh not found"
    exit 1
fi

# Installation steps
echo "Starting installation process..."

# 1. System dependencies
echo "Installing system dependencies..."
bash "$SCRIPT_DIR/system-dependencies.sh"

# 2. NVIDIA drivers and CUDA
echo "Setting up NVIDIA drivers..."
bash "$SCRIPT_DIR/nvidia-setup.sh"

# 3. Python environment
echo "Setting up Python environment..."
bash "$SCRIPT_DIR/python-setup.sh"

# 4. Web interface
echo "Setting up web interface..."
bash "$SCRIPT_DIR/web-setup.sh"

# 5. Services setup
echo "Setting up system services..."
bash "$SCRIPT_DIR/services-setup.sh"

# 6. SSL setup
echo "Setting up SSL certificates..."
bash "$SCRIPT_DIR/ssl-setup.sh"

echo "=========================================="
echo "Installation completed successfully!"
echo "=========================================="
echo "Next steps:"
echo "1. Configure the system: bash $SCRIPT_DIR/configure-system.sh"
echo "2. Start services: systemctl start tars-assistant"
echo "3. Access web interface: https://$(hostname -I | awk '{print $1}')"
