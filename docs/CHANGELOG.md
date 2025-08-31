# Changelog - TARS AI Assistant Project

## [Unreleased]
### Added
- Project requirements document ([AI-Project-Requirements.md](AI-Project-Requirements.md))
- Structured project directory
- Comprehensive .gitignore for generated files
- Main README.md with project overview
- Utility functions script

### Changed
- Complete project directory restructuring
- Improved documentation structure
- Separation of scripts, services, and generated data

### Removed
- All generated files from previous version
- Unnecessary backup files

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

## [2025-08-30]
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

## [0.9.0] - 2025-08-31 (Live)
### ✅ Operational
- Backend Service: FastAPI on port 8002
- Nginx Config: Reverse proxy with correct routing
- Frontend Fix: 403 Forbidden resolved
- API Endpoints: /health and /api/health working
- Systemd Integration: Full service management

### 🌐 Network
- Server: 192.168.1.26
- Ports: 8002 (backend), 80 (frontend)
- URLs: http://192.168.1.26/health

---

## Requirements Alignment

- All features and structure now match [AI-Project-Requirements.md](AI-Project-Requirements.md)
- Hardware and software status tracked in [STATUS.md](STATUS.md)
- Documentation and changelog updated for international collaboration
