#!/bin/bash

# TARS AI Host Setup Script
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../utils.sh"

log_info "Starting TARS AI Host Setup..."

# Check if running as root
check_root

# Run host setup steps
bash "$SCRIPT_DIR/kvm-setup.sh"
bash "$SCRIPT_DIR/iommu-setup.sh"
bash "$SCRIPT_DIR/gpu-passthrough.sh"
bash "$SCRIPT_DIR/network-setup.sh"

log_success "Host setup completed successfully!"
log_info "Next: Create and configure the KVM guest VM"
