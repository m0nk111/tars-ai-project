#!/bin/bash

# TARS AI - IOMMU Setup
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../utils.sh"

log_info "Configuring IOMMU for GPU passthrough..."

# Detect CPU type
if grep -q "Intel" /proc/cpuinfo; then
    IOMMU_CMD="intel_iommu=on iommu=pt"
elif grep -q "AMD" /proc/cpuinfo; then
    IOMMU_CMD="amd_iommu=on iommu=pt"
else
    log_error "Unsupported CPU type"
    exit 1
fi

# Backup original grub config
cp /etc/default/grub /etc/default/grub.backup

# Update grub configuration
log_info "Updating GRUB configuration..."
if ! grep -q "$IOMMU_CMD" /etc/default/grub; then
    sed -i "s/GRUB_CMDLINE_LINUX=\"\(.*\)\"/GRUB_CMDLINE_LINUX=\"\1 $IOMMU_CMD\"/" /etc/default/grub
    update-grub
    log_info "IOMMU parameters added. System reboot required."
else
    log_info "IOMMU already configured."
fi

log_success "IOMMU setup completed successfully!"
