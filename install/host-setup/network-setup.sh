#!/bin/bash

# TARS AI - Network Setup
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../utils.sh"

log_info "Setting up network bridge..."

# Install bridge utilities
apt-get install -y bridge-utils

# Create network bridge configuration
cat > /etc/netplan/01-bridge.yaml << 'NETPLAN'
network:
  version: 2
  renderer: networkd
  ethernets:
    eno1:
      dhcp4: no
      optional: yes
  bridges:
    br0:
      interfaces: [eno1]
      dhcp4: yes
      parameters:
        stp: false
        forward-delay: 0
NETPLAN

# Apply network configuration
netplan apply

log_success "Network bridge setup completed successfully!"
