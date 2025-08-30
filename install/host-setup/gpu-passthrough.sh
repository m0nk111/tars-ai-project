#!/bin/bash

# TARS AI - GPU Passthrough Setup
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../utils.sh"

log_info "Setting up GPU passthrough..."

# Find NVIDIA GPU
GPU_INFO=$(lspci | grep -i nvidia | head -1)
if [ -z "$GPU_INFO" ]; then
    log_error "No NVIDIA GPU found!"
    exit 1
fi

log_info "Found GPU: $GPU_INFO"

# Get GPU PCI IDs
GPU_IDS=$(lspci -nn | grep -i nvidia | grep -o '\[[0-9a-f:]\+]' | tr -d '[]' | head -2 | tr '\n' ',' | sed 's/,$//')

if [ -n "$GPU_IDS" ]; then
    log_info "GPU PCI IDs: $GPU_IDS"
    
    # Update grub with VFIO parameters
    if ! grep -q "vfio-pci.ids" /etc/default/grub; then
        sed -i "s/GRUB_CMDLINE_LINUX=\"\(.*\)\"/GRUB_CMDLINE_LINUX=\"\1 vfio-pci.ids=$GPU_IDS\"/" /etc/default/grub
        update-grub
        log_info "VFIO parameters added. System reboot required."
    else
        log_info "VFIO already configured."
    fi
fi

# Load VFIO modules
echo "vfio" >> /etc/modules
echo "vfio_iommu_type1" >> /etc/modules
echo "vfio_pci" >> /etc/modules
echo "vfio_virqfd" >> /etc/modules

# Update initramfs
update-initramfs -u

log_success "GPU passthrough setup completed successfully!"
