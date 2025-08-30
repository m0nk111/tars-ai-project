#!/bin/bash

# TARS AI Assistant - NVIDIA Drivers and CUDA Installation
set -e

# Load utility functions
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/utils.sh"

log_info "Starting NVIDIA drivers and CUDA installation..."

# Add NVIDIA package repository
log_info "Adding NVIDIA package repository..."
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg
curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \
    sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
    sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list

# Add NVIDIA CUDA repository
log_info "Adding NVIDIA CUDA repository..."
wget -q https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2404/x86_64/cuda-keyring_1.1-1_all.deb
sudo dpkg -i cuda-keyring_1.1-1_all.deb
sudo rm -f cuda-keyring_1.1-1_all.deb

# Update package lists
log_info "Updating package lists..."
sudo apt-get update

# Install newest NVIDIA drivers (550 series)
log_info "Installing latest NVIDIA drivers..."
sudo apt-get install -y \
    nvidia-driver-550 \
    nvidia-dkms-550

# Install CUDA toolkit 12.9 (newest stable version)
log_info "Installing CUDA toolkit 12.9..."
sudo apt-get install -y \
    cuda-toolkit-12-9 \
    nvidia-container-toolkit

# Install cuDNN 
log_info "Installing cuDNN..."
sudo apt-get install -y \
    cuda-cudart-12-9 \
    libcudnn9

# Set up NVIDIA persistence mode
log_info "Setting up NVIDIA persistence mode..."
sudo nvidia-smi -pm 1

# Create NVIDIA device nodes
log_info "Creating NVIDIA device nodes..."
sudo nvidia-modprobe -u -c=0

# Verify installation
log_info "Verifying NVIDIA installation..."
if command_exists nvidia-smi; then
    sudo nvidia-smi
    log_success "NVIDIA drivers installed successfully!"
else
    log_error "NVIDIA drivers installation failed!"
    exit 1
fi

# Verify CUDA installation
log_info "Verifying CUDA installation..."
if [ -d "/usr/local/cuda-12.9" ]; then
    log_success "CUDA toolkit 12.9 installed successfully!"
    echo "export PATH=/usr/local/cuda-12.9/bin:\$PATH" | sudo tee -a /etc/profile
    echo "export LD_LIBRARY_PATH=/usr/local/cuda-12.9/lib64:\$LD_LIBRARY_PATH" | sudo tee -a /etc/profile
    echo "export CUDA_HOME=/usr/local/cuda-12.9" | sudo tee -a /etc/profile
else
    log_error "CUDA toolkit installation failed!"
    exit 1
fi

# Load new environment variables
source /etc/profile

log_success "NVIDIA drivers and CUDA installation completed successfully!"
log_info "Driver version: 550 series"
log_info "CUDA version: 12.9"
log_info "Next step: Run install/python-setup.sh for Python environment setup"
