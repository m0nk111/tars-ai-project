# Changelog - TARS AI Assistant Project

## [Unreleased]
### Added
- New structured project directory
- Comprehensive .gitignore for generated files
- Structured documentation layout
- Main README.md with project overview
- Utility functions script

### Changed
- Complete project directory restructuring
- Separation of scripts, services, and generated data
- Improved documentation structure

### Removed
- All generated files from previous version
- Unnecessary backup files

## 2025-08-30
### Added
- Project requirements document (AI-Project-Requirements.md)
- Initial project directory structure
- Start development planning

### Changed
- Improved project documentation

## 2025-08-30
### Added
- Successful NVIDIA GPU passthrough to KVM guest
- CUDA 12.9 and PyTorch 2.8.0 with GPU support
- FastAPI web interface with dark mode
- Complete Python environment with all dependencies

### Verified
- GPU Detection: NVIDIA RTX 3060 12GB
- CUDA: Version 12.9
- PyTorch: GPU acceleration working
- Web Interface: Running on port 8000
## [2025-08-30] - Version 1.2.0
### Added
- Real-time system monitoring (CPU, RAM, GPU, VRAM, temperatures)
- Model persistence (remembers last used model between sessions)
- File upload API with drag & drop support
- Code formatting with copy and download buttons
- Modern UI with improved styling
- WebSocket-based real-time communication
- Systemd service configuration

### Enhanced
- Complete English codebase compliance
- Improved error handling and logging
- Better responsive design
- Enhanced system statistics display

### Technical
- Ollama integration for model management
- FastAPI endpoints for file management
- JavaScript improvements for real-time updates
- Python path configuration fixes
