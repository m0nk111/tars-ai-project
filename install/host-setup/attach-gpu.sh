#!/bin/bash

# TARS AI - Attach GPU to VM
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../utils.sh"

log_info "Attaching GPU to VM..."

# Find NVIDIA GPU
GPU_INFO=$(lspci | grep -i nvidia | head -1)
if [ -z "$GPU_INFO" ]; then
    log_error "No NVIDIA GPU found!"
    exit 1
fi

# Extract PCI address (e.g., 03:00.0)
PCI_ADDRESS=$(echo "$GPU_INFO" | awk '{print $1}')
BUS=$(echo "$PCI_ADDRESS" | cut -d: -f1)
SLOT=$(echo "$PCI_ADDRESS" | cut -d: -f2 | cut -d. -f1)
FUNCTION=$(echo "$PCI_ADDRESS" | cut -d. -f2)

log_info "GPU PCI Address: $PCI_ADDRESS"
log_info "Bus: $BUS, Slot: $SLOT, Function: $FUNCTION"

# Create XML for GPU
cat > /tmp/gpu-video.xml << XML
<hostdev mode='subsystem' type='pci' managed='yes'>
  <source>
    <address domain='0x0000' bus='0x$BUS' slot='0x$SLOT' function='0x$FUNCTION'/>
  </source>
</hostdev>
XML

# Find audio controller (usually same bus/slot, function+1)
AUDIO_INFO=$(lspci | grep -i nvidia | grep -i audio | head -1)
if [ -n "$AUDIO_INFO" ]; then
    AUDIO_ADDRESS=$(echo "$AUDIO_INFO" | awk '{print $1}')
    AUDIO_BUS=$(echo "$AUDIO_ADDRESS" | cut -d: -f1)
    AUDIO_SLOT=$(echo "$AUDIO_ADDRESS" | cut -d: -f2 | cut -d. -f1)
    AUDIO_FUNCTION=$(echo "$AUDIO_ADDRESS" | cut -d. -f2)
    
    cat > /tmp/gpu-audio.xml << XML
<hostdev mode='subsystem' type='pci' managed='yes'>
  <source>
    <address domain='0x0000' bus='0x$AUDIO_BUS' slot='0x$AUDIO_SLOT' function='0x$AUDIO_FUNCTION'/>
  </source>
</hostdev>
XML
fi

# Stop the VM
log_info "Stopping VM..."
sudo virsh shutdown ai-kvm1
sleep 10

# Attach GPU to VM
log_info "Attaching GPU to VM..."
sudo virsh attach-device ai-kvm1 /tmp/gpu-video.xml --config

if [ -f "/tmp/gpu-audio.xml" ]; then
    log_info "Attaching audio controller to VM..."
    sudo virsh attach-device ai-kvm1 /tmp/gpu-audio.xml --config
fi

# Start the VM
log_info "Starting VM..."
sudo virsh start ai-kvm1

log_success "GPU attached to VM successfully!"
log_info "Use 'sudo virsh console ai-kvm1' to access the VM"
