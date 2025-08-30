#!/bin/bash

# TARS AI Assistant - Utility Functions

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if running as root
check_root() {
    if [ "$EUID" -ne 0 ]; then
        log_error "Please run as root or use sudo"
    fi
}

# Get project root directory
get_project_root() {
    echo "/home/flip/tars-ai-project"
}

# Get generated data directory
get_generated_dir() {
    echo "$(get_project_root)/generated"
}

# Load configuration
load_config() {
    local config_file="$(get_project_root)/config/config.yaml"
    if [ -f "$config_file" ]; then
        source <(sed -e 's/:[^:\/\/]/=/g' -e 's/ *=/=/g' -e 's/^[^=]*=//' "$config_file")
    fi
}
