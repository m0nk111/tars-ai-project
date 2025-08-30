#!/bin/bash

# TARS AI Assistant - NVIDIA Drivers and CUDA Installation
set -e

# Load utility functions
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/utils.sh"

log_info "Starting NVIDIA drivers and CUDA installation..."

# Add NVIDIA package repository
log_info "Adding NVIDIA package repository..."
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg
curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \
    sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
    tee /etc/apt/sources.list.d/nvidia-container-toolkit.list

# Add NVIDIA CUDA repository
log_info "Adding NVIDIA CUDA repository..."
wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2404/x86_64/cuda-keyring_1.1-1_all.deb
dpkg -i cuda-keyring_1.1-1_all.deb
rm cuda-keyring_1.1-1_all.deb

# Update package lists
log_info "Updating package lists..."
apt-get update

# Install NVIDIA drivers
log_info "Installing NVIDIA drivers..."
apt-get install -y \
    nvidia-driver-535 \
    nvidia-dkms-535

# Install CUDA toolkit
log_info "Installing CUDA toolkit..."
apt-get install -y \
    cuda-toolkit-12-2 \
    nvidia-container-toolkit

# Install cuDNN (via NVIDIA repository)
log_info "Installing cuDNN..."
apt-get install -y \
    cuda-cudart-12-2 \
    libcudnn9

# Set up NVIDIA persistence mode
log_info "Setting up NVIDIA persistence mode..."
nvidia-smi -pm 1

# Create NVIDIA device nodes
log_info "Creating NVIDIA device nodes..."
nvidia-modprobe -u -c=0

# Verify installation
log_info "Verifying NVIDIA installation..."
if command_exists nvidia-smi; then
    nvidia-smi
    log_success "NVIDIA drivers installed successfully!"
else
    log_error "NVIDIA drivers installation failed!"
    exit 1
fi

# Verify CUDA installation
log_info "Verifying CUDA installation..."
if [ -d "/usr/local/cuda-12.2" ]; then
    log_success "CUDA toolkit installed successfully!"
    echo "export PATH=/usr/local/cuda-12.2/bin:\$PATH" >> /etc/profile
    echo "export LD_LIBRARY_PATH=/usr/local/cuda-12.2/lib64:\$LD_LIBRARY_PATH" >> /etc/profile
else
    log_error "CUDA toolkit installation failed!"
    exit 1
fi

log_success "NVIDIA drivers and CUDA installation completed successfully!"
log_info "Next step: Run install/python-setup.sh for Python environment setup"
