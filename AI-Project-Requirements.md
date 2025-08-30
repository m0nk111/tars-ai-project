# AI Project Requirements (TARS Assistant)

## Project Overview
Create a self-hosted AI chat assistant similar to chat.deepseek.com with a dark mode interface, file upload capabilities, and persistent memory using ChromaDB. The system should run on an Ubuntu 24.04.3 server with full shell access for the AI assistant.

## Technical Specifications

### Server Hardware
- **CPU**: Intel Xeon E5-2697A v4 (16 cores / 32 threads)
- **RAM**: 128 GB DDR4 ECC
- **GPU**: NVIDIA RTX 3060 (12 GB GDDR6)
- **Motherboard**: MACHINIST X99 PR9 (PCIe bifurcation capable)
- **Storage**: 1 TB NVMe SSD
- **PSU**: Corsair CX600M 600W

### Network Configuration
- **Host Server IP**: 192.168.1.25
- **Guest Server IP**: 192.168.1.26 (hostname: ai-kvm1)
- **SSH Username**: flip
- **SSL/HTTPS**: Required

## Functional Requirements

### Core Features
- Dark mode interface similar to chat.deepseek.com
- File upload and parsing capabilities with attachment button
- Persistent conversation memory using ChromaDB
- Multiple model selection in interface
- Text-to-speech functionality for AI responses
- Voice input for questions
- Flappy Bird game in header while waiting for responses
- Image upload and analysis capabilities

### Technical Implementation
- No Docker - direct installation on KVM
- PCI-passthrough of GPU to KVM-VM
- NVIDIA CUDA support with driver installation
- SSL encryption for web interface
- Root shell access for AI assistant
- Multi-language support (Dutch required, others optional)
- Model sharing across multiple KVMs
- Performance overview showing response times and model feasibility

### Development Requirements
- No hardcoded variables
- Advanced debugging code
- Separate file structure for scripts and generated data
- Complete service implementation
- GitHub repository with proper documentation
- Installation script and detailed README.md
- Change log file tracking progress
- Maximum use of shell commands for instructions

## File Structure
```
tars-ai-project/
├── scripts/          # All development scripts
├── generated/        # All generated files and data
├── docs/            # Documentation
└── README.md        # Main documentation
```

## Documentation Requirements
- Installation instructions with copy-paste friendly shell commands
- GitHub repository setup guide
- Progress tracking changelog
- Hardware compatibility testing procedures
- Service management instructions

## Non-Functional Requirements
- Minimal typing required for setup and operation
- Maximum use of bash shell commands in documentation
- Complete sandboxed network environment
- No unnecessary files in GitHub repository
- Easy reset capability to start fresh when needed

## Assistant Personality
- Named "TARS" (from Interstellar)
- Professional but helpful demeanor

## Priority
- Functional Dutch language support required
- Multi-language support is lower priority
- Performance and stability over additional features

---

*This document will be updated as the project evolves. Refer to the changelog for progress tracking.*
