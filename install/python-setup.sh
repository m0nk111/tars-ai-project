#!/bin/bash

# TARS AI Assistant - Python Environment Setup
set -e

# Load utility functions
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/utils.sh"

log_info "Starting Python environment setup..."

# Get project root
PROJECT_ROOT=$(get_project_root)
log_info "Project root: $PROJECT_ROOT"

# Create Python virtual environment
log_info "Creating Python virtual environment..."
python3.10 -m venv "$PROJECT_ROOT/venv"

# Activate virtual environment
source "$PROJECT_ROOT/venv/bin/activate"

# Upgrade pip and setuptools
log_info "Upgrading pip and setuptools..."
pip install --upgrade pip setuptools wheel

# Install base Python packages
log_info "Installing base Python packages..."
pip install --upgrade \
    numpy \
    pandas \
    matplotlib \
    seaborn \
    scipy \
    scikit-learn \
    pillow \
    opencv-python-headless

# Install AI/ML packages
log_info "Installing AI/ML packages..."
pip install --upgrade \
    torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121 \
    transformers \
    datasets \
    accelerate \
    sentencepiece \
    protobuf

# Install ChromaDB for persistent memory
log_info "Installing ChromaDB..."
pip install --upgrade \
    chromadb \
    sentence-transformers \
    langchain

# Install web framework packages
log_info "Installing web framework packages..."
pip install --upgrade \
    fastapi \
    uvicorn \
    gunicorn \
    python-multipart \
    jinja2 \
    aiofiles

# Install audio processing packages
log_info "Installing audio processing packages..."
pip install --upgrade \
    pyaudio \
    wave \
    soundfile \
    speechrecognition \
    gtts \
    pydub

# Install utility packages
log_info "Installing utility packages..."
pip install --upgrade \
    python-dotenv \
    pyyaml \
    tqdm \
    requests \
    beautifulsoup4 \
    python-magic

# Create requirements.txt
log_info "Creating requirements.txt..."
pip freeze > "$PROJECT_ROOT/requirements.txt"

log_success "Python environment setup completed successfully!"
log_info "Virtual environment: $PROJECT_ROOT/venv"
log_info "Next step: Run install/web-setup.sh for web interface setup"
