# TARS AI Assistant Project
![TARS](https://img.shields.io/badge/Project-TARS_AI-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Python](https://img.shields.io/badge/Python-3.12-blue)
![Ollama](https://img.shields.io/badge/Ollama-Enabled-green)

A self-hosted AI chat assistant inspired by Interstellar's TARS, featuring dark mode, file upload capabilities, and persistent memory using ChromaDB.

## 🚀 Features
\n## 🗃️ Persistent Memory with SQLite

The project now uses SQLite for persistent conversation storage instead of in-memory storage.

### Features:
- Conversations persist between application restarts
- SQLite database stored in conversation_memory.db
- Automatic database initialization
- Efficient storage and retrieval of chat history

### Database Structure:
```sql
CREATE TABLE conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### API Endpoints:
- GET /api/conversations - Retrieve conversation history
- All chat messages are automatically stored in SQLite
- **Dark mode interface** similar to chat.deepseek.com
- **File upload and parsing capabilities** with drag & drop support
- **Persistent conversation memory** with ChromaDB (upcoming)
- **Multiple model selection** with persistence
- **Text-to-speech functionality** (upcoming)
- **Voice input support** (upcoming)
- **Real-time system monitoring** (CPU, RAM, GPU, VRAM, temperatures)
- **Code formatting** with copy and download buttons
- **Model persistence** remembers last used model between sessions
- **WebSocket-based real-time chat**

## 🛠️ Installation
```bash
# Clone the repository
git clone https://github.com/m0nk111/tars-ai-project.git
cd tars-ai-project

# Run installation script
sudo bash install/main-install.sh
```

## ✅ Current Status
- ✅ Ubuntu 24.04 KVM Guest
- ✅ NVIDIA RTX 3060 GPU Passthrough
- ✅ CUDA 12.9 + PyTorch 2.8.0
- ✅ Python 3.12 Virtual Environment
- ✅ FastAPI Web Interface with WebSockets
- ✅ Dark Mode UI with modern styling
- ✅ Ollama AI Integration
- ✅ Real-time System Monitoring
- ✅ Model Switching with Persistence
- ✅ File Upload with Drag & Drop
- ✅ Code Formatting with Copy/Download
- 🔄 ChromaDB Persistent Memory (Next)
- 🔄 TTS/Voice Features (Next)

## 📁 Project Structure
```
tars-ai-project/
├── 📁 scripts/           # Utility scripts and model management
├── 📁 generated/        # Generated data (not in git)
│   ├── 📁 models/       # AI models
│   ├── 📁 chromadb/     # Vector database (future)
│   └── 📁 uploads/      # Uploaded files
├── 📁 web-ui/           # Web interface
│   ├── 📁 static/       # CSS, JS, assets
│   ├── 📁 templates/    # HTML templates
│   ├── 📁 uploads/      # User uploaded files
│   └── main.py          # FastAPI application
├── 📁 install/          # Installation scripts
├── 📁 docs/            # Documentation
├── 📁 services/        # Systemd service files
├── venv/               # Python virtual environment
├── requirements.txt    # Python dependencies
└── README.md          # This file
```

## 🔧 Hardware Requirements
- **CPU**: Intel Xeon E5-2697A v4 (16 cores / 32 threads)
- **RAM**: 128 GB DDR4 ECC
- **GPU**: NVIDIA RTX 3060 (12 GB GDDR6) with PCI-passthrough
- **Storage**: 1 TB NVMe SSD
- **Network**: Static IP configuration

## 🌐 Language Policy
- All code and documentation must be written in English
- This ensures international collaboration and maintainability
- Only user interface elements may be localized for different languages

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing
1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support
For support and questions, please open an issue in the GitHub repository.

## 🔄 Changelog

## 🤖 AI Models
For detailed information about recommended AI models, see [AI_MODELS.md](docs/AI_MODELS.md)
See [CHANGELOG.md](CHANGELOG.md) for recent updates and features.


# TARS AI Assistant Project

![TARS](https://img.shields.io/badge/Project-TARS_AI-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Python](https://img.shields.io/badge/Python-3.10%2B-blue)

A self-hosted AI chat assistant inspired by Interstellar's TARS, featuring dark mode, file upload capabilities, and persistent memory using ChromaDB.

## 🚀 Features
\n## 🗃️ Persistent Memory with SQLite

The project now uses SQLite for persistent conversation storage instead of in-memory storage.

### Features:
- Conversations persist between application restarts
- SQLite database stored in conversation_memory.db
- Automatic database initialization
- Efficient storage and retrieval of chat history

### Database Structure:
```sql
CREATE TABLE conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### API Endpoints:
- GET /api/conversations - Retrieve conversation history
- All chat messages are automatically stored in SQLite

- Dark mode interface similar to chat.deepseek.com
- File upload and parsing capabilities
- Persistent conversation memory with ChromaDB
- Multiple model selection
- Text-to-speech functionality
- Voice input support
- Image upload and analysis
- Flappy Bird game in header while waiting

## 🛠️ Installation

## ✅ Current Status
- ✅ Ubuntu 24.04 KVM Guest
- ✅ NVIDIA RTX 3060 GPU Passthrough
- ✅ CUDA 12.9 + PyTorch 2.8.0
- ✅ Python 3.12 Virtual Environment
- ✅ FastAPI Web Interface
- ✅ Dark Mode UI
- 🔄 AI Model Integration (Next)
- 🔄 ChromaDB Persistent Memory
- 🔄 TTS/Voice Features

```bash
# Clone the repository
git clone https://github.com/m0nk111/tars-ai-project.git
cd tars-ai-project

# Run installation script
sudo bash install/main-install.sh
```

## 📁 Project Structure
```
tars-ai-project/
├── 📁 scripts/          # Maintenance and utility scripts
├── 📁 generated/        # Generated data (not in git)
│   ├── 📁 models/       # AI models
│   ├── 📁 chromadb/     # Vector database
│   └── 📁 uploads/      # Uploaded files
├── 📁 web-ui/           # Web interface
│   ├── 📁 static/       # CSS, JS, assets
│   ├── 📁 templates/    # HTML templates
│   └── main.py          # FastAPI application
├── 📁 install/          # Installation scripts
├── 📁 docs/            # Documentation
├── 📁 services/        # Systemd service files
├── venv/               # Python virtual environment
├── requirements.txt    # Python dependencies
└── README.md          # This file
```
tars-ai-project/
├── scripts/          # Development and maintenance scripts
├── generated/        # Generated files and data (not in git)
├── docs/            # Documentation
├── services/        # System service configurations
├── web-ui/         # Web interface code
├── install/        # Installation scripts
└── README.md       # This file
```

## 🔧 Hardware Requirements

- CPU: Intel Xeon E5-2697A v4 (16 cores / 32 threads)
- RAM: 128 GB DDR4 ECC
- GPU: NVIDIA RTX 3060 (12 GB GDDR6)
- Storage: 1 TB NVMe SSD

## 🌐 Language Policy
- All code and documentation must be written in English
- This ensures international collaboration and maintainability
- Only user interface elements may be localized for different languages

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support and questions, please open an issue in the GitHub repository.
