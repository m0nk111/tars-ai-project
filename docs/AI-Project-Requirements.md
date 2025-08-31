# AI Project Requirements (TARS Assistant)

## Overview

Build a self-hosted AI chat assistant with a dark mode interface, file upload, persistent memory (ChromaDB), and model selection. Runs on Ubuntu 24.04.3 with full shell access.

## Hardware

- CPU: Intel Xeon E5-2697A v4 (16c/32t)
- RAM: 128 GB DDR4 ECC
- GPU: NVIDIA RTX 3060 (12 GB)
- Storage: 1 TB NVMe SSD

## Network

- Host IP: 192.168.1.25
- Guest IP: 192.168.1.26 (ai-kvm1)
- SSH User: flip
- SSL/HTTPS required

## Functional Requirements

- Dark mode UI (chat.deepseek.com style)
- File upload (drag & drop)
- Persistent memory (ChromaDB/SQLite)
- Model selection
- Text-to-speech (TTS) for responses
- Voice input
- Flappy Bird game in header (while waiting)
- Image upload/analysis

## Technical Implementation

- No Docker; direct KVM install
- PCI-passthrough GPU
- NVIDIA CUDA support
- SSL for web interface
- Root shell access for AI
- Multi-language UI (Dutch required)
- Model sharing across KVMs
- Performance overview

## Development

- No hardcoded variables
- Advanced debugging
- Separate scripts/generated data
- Complete service implementation
- GitHub repo with documentation
- Installation script, changelog
- Use shell commands for instructions

## File Structure

```text
tars-ai-project/
├── scripts/          # Development scripts
├── generated/        # Generated files/data
├── docs/             # Documentation
└── README.md         # Main documentation
```

## Documentation

- Installation instructions (shell commands)
- GitHub setup guide
- Changelog
- Hardware compatibility
- Service management

## Non-Functional

- Minimal typing for setup
- Bash shell commands in docs
- Sandboxed network
- No unnecessary files in repo
- Easy reset capability

## Assistant Personality

- Name: TARS (Interstellar)
- Professional, helpful

## Priority

- Dutch UI required
- Multi-language optional
- Performance/stability prioritized

---

All code, comments, and documentation must be in English. UI elements may be localized.
- Error messages and user-facing text should be in English
- Only user interface elements may be translated to other languages
- This ensures international collaboration and maintainability
