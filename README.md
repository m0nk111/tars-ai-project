# TARS AI Assistant Project

![TARS](https://img.shields.io/badge/Project-TARS_AI-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Python](https://img.shields.io/badge/Python-3.12-blue)
![Ollama](https://img.shields.io/badge/Ollama-Enabled-green)

A self-hosted AI chat assistant inspired by Interstellar's TARS. Features include dark mode, file upload, persistent memory (SQLite/ChromaDB), model selection, and real-time system monitoring.

---

## 🚀 Features

- Persistent conversation memory (SQLite)
- Automatic database initialization
- Efficient chat history retrieval
- Dark mode interface
- File upload (drag & drop)
- Multiple model selection with persistence
- Code formatting (copy/download)
- Real-time system monitoring (CPU, RAM, GPU, VRAM, temperatures)
- WebSocket-based chat
- Upcoming: ChromaDB, TTS, voice input

## 🗃️ Database Structure

```sql
-- SQLite schema
CREATE TABLE conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/m0nk111/tars-ai-project.git
cd tars-ai-project

# Run installation script
sudo bash install/main-install.sh

# Check service status
sudo systemctl status tars-backend tars-frontend nginx

# View logs
sudo journalctl -u tars-backend -f --no-pager
sudo journalctl -u tars-frontend -f --no-pager
sudo tail -f /var/log/nginx/tars-access.log
```

## ✅ Current Status

- Ubuntu 24.04 KVM Guest
- NVIDIA RTX 3060 GPU Passthrough
- CUDA 12.9 + PyTorch 2.8.0
- Python 3.12 Virtual Environment
- FastAPI Web Interface
- Ollama AI Integration
- Model Switching
- File Upload
- Code Formatting
- ChromaDB, TTS/Voice (Next)

## 📁 Project Structure

```text
tars-ai-project/
├── scripts/           # Utility scripts and model management
├── generated/         # Generated data (not in git)
│   ├── models/        # AI models
│   ├── chromadb/      # Vector database (future)
│   └── uploads/       # Uploaded files
├── web-ui/            # Web interface
│   ├── static/        # CSS, JS, assets
│   ├── templates/     # HTML templates
│   ├── uploads/       # User uploaded files
│   └── main.py        # FastAPI application
├── install/           # Installation scripts
├── docs/              # Documentation
├── services/          # Systemd service files
├── venv/              # Python virtual environment
├── requirements.txt   # Python dependencies
└── README.md          # This file
```

## 🔧 Hardware Requirements

- **CPU**: Intel Xeon E5-2697A v4 (16 cores / 32 threads)
- **RAM**: 128 GB DDR4 ECC
- **GPU**: NVIDIA RTX 3060 (12 GB GDDR6)
- **Storage**: 1 TB NVMe SSD

## 🌐 Language Policy

- All code and documentation in English
- UI elements may be localized

## 📜 License

MIT License - see [LICENSE](LICENSE).

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

Open an issue in the GitHub repository for support/questions.

## 🔄 Changelog

See [docs/CHANGELOG.md](docs/CHANGELOG.md) for updates.

## 🤖 AI Models

See [docs/AI_MODELS.md](docs/AI_MODELS.md) for recommended models.

---

**Note:** This project is under active development. Features and documentation may change.
# TARS AI Assistant Project

![TARS](https://img.shields.io/badge/Project-TARS_AI-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Python](https://img.shields.io/badge/Python-3.10%2B-blue)

A self-hosted AI chat assistant inspired by Interstellar's TARS, featuring dark mode, file upload capabilities, and persistent memory using ChromaDB.


---

**Note**: This project is under active development. Features and documentation may change.
