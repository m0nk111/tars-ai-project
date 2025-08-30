#!/bin/bash

# TARS AI - KVM Host Setup
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../utils.sh"

log_info "Installing KVM and virtualization tools..."

# Install KVM and virtualization packages
apt-get install -y \
    qemu-kvm \
    libvirt-daemon-system \
    libvirt-clients \
    bridge-utils \
    virt-manager \
    virt-viewer \
    libguestfs-tools \
    libosinfo-bin \
    cloud-image-utils

# Add user to libvirt group
log_info "Adding user to libvirt group..."
usermod -aG libvirt $SUDO_USER
usermod -aG kvm $SUDO_USER

# Enable and start libvirt service
systemctl enable libvirtd
systemctl start libvirtd

log_success "KVM setup completed successfully!"
