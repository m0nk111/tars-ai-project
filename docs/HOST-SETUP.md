# Host Server Setup Guide

## Prerequisites
- Ubuntu 24.04 LTS Server
- Intel CPU with VT-d support
- NVIDIA GPU for passthrough
- UEFI BIOS with IOMMU support

## Installation Steps

### 1. Run Host Setup Script
\`\`\`bash
cd tars-ai-project
sudo bash install/host-setup/main.sh
\`\`\`

### 2. Reboot System
\`\`\`bash
sudo reboot
\`\`\`

### 3. Verify IOMMU
After reboot, check IOMMU is enabled:
\`\`\`bash
dmesg | grep -i iommu
\`\`\`

### 4. Create KVM Guest
Use virt-manager or command line to create Ubuntu 24.04 VM:
\`\`\`bash
sudo virt-install \\
  --name ai-kvm1 \\
  --ram 65536 \\
  --vcpus 16 \\
  --disk path=/var/lib/libvirt/images/ai-kvm1.qcow2,size=100 \\
  --os-type linux \\
  --os-variant ubuntu24.04 \\
  --network bridge=br0 \\
  --graphics none \\
  --console pty,target_type=serial
\`\`\`

### 5. Attach GPU to VM
\`\`\`bash
# Find GPU PCI address
lspci | grep -i nvidia

# Create XML files and attach to VM
sudo bash install/host-setup/attach-gpu.sh
\`\`\`

## BIOS Settings Required
- Intel VT-d: Enabled
- IOMMU: Enabled  
- SR-IOV: Enabled (if available)
- Above 4G Decoding: Enabled

## Verification
\`\`\`bash
# Check KVM status
sudo systemctl status libvirtd

# Check IOMMU groups
find /sys/kernel/iommu_groups/ -type l

# Check GPU isolation
lspci -vvv -s 03:00.0
\`\`\`

## Troubleshooting
- Ensure BIOS settings are correct
- Check kernel parameters with \`cat /proc/cmdline\`
- Verify IOMMU groups with \`dmesg | grep -i iommu\`
