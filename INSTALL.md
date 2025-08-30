# Installation Guide - TARS AI Assistant

## Prerequisites

### Hardware Requirements
- NVIDIA GPU with at least 8GB VRAM (RTX 3060 12GB recommended)
- 16GB+ RAM (128GB recommended for optimal performance)
- 50GB+ free storage space

### Software Requirements
- Ubuntu 24.04.3 LTS
- NVIDIA drivers 535+
- CUDA 12.2+
- Python 3.10+

## Quick Installation

```bash
# Clone the repository
git clone https://github.com/m0nk111/tars-ai-project.git
cd tars-ai-project

# Make install scripts executable
chmod +x install/*.sh

# Run main installation script (as root)
sudo bash install/main-install.sh
```

## Manual Installation Steps

### 1. System Dependencies
```bash
sudo bash install/system-dependencies.sh
```

### 2. NVIDIA Drivers & CUDA
```bash
sudo bash install/nvidia-setup.sh
```
