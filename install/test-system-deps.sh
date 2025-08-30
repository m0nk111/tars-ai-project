#!/bin/bash

# Test version without root check
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/utils.sh"

log_info "Testing system dependencies script..."
log_info "Project root: $(get_project_root)"
log_success "Script loaded successfully!"
