#!/bin/bash

# TARS AI Assistant - System Dependencies Installation
set -e

# Load utility functions
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/utils.sh"

log_info "Starting system dependencies installation..."
log_info "Project root: $(get_project_root)"

# Update package lists
log_info "Updating package lists..."
apt-get update

# Install essential system packages
log_info "Installing essential system packages..."
apt-get install -y \
    build-essential \
    curl \
    wget \
    git \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release \
    unzip \
    zip \
    net-tools \
    htop \
    ncdu \
    tmux \
    vim \
    nano

# Install Python and development tools (Ubuntu 24.04 uses Python 3.12)
log_info "Installing Python and development tools..."
apt-get install -y \
    python3 \
    python3-venv \
    python3-dev \
    python3-pip \
    python3-setuptools \
    python3-wheel

# Install audio dependencies for TTS
log_info "Installing audio dependencies..."
apt-get install -y \
    libasound2-dev \
    portaudio19-dev \
    libportaudio2 \
    libportaudiocpp0 \
    ffmpeg

# Install web server dependencies
log_info "Installing web server dependencies..."
apt-get install -y \
    nginx \
    certbot \
    python3-certbot-nginx

# Install database and storage dependencies
log_info "Installing database dependencies..."
apt-get install -y \
    sqlite3 \
    libsqlite3-dev

# Install graphics dependencies
log_info "Installing graphics dependencies..."
apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxrender1 \
    libxext6

# Clean up
log_info "Cleaning up..."
apt-get autoremove -y
apt-get clean

log_success "System dependencies installation completed successfully!"
log_info "Next step: Run install/nvidia-setup.sh for NVIDIA drivers and CUDA"
