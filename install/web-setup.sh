#!/bin/bash

# TARS AI Assistant - Web Interface Setup
set -e

# Load utility functions
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/utils.sh"

log_info "Starting web interface setup..."

# Get project root
PROJECT_ROOT=$(get_project_root)
cd "$PROJECT_ROOT"

# Activate virtual environment
source "$PROJECT_ROOT/venv/bin/activate"

# Install web frontend dependencies
log_info "Installing frontend dependencies..."
pip install --upgrade \
    fastapi \
    uvicorn \
    gunicorn \
    python-multipart \
    jinja2 \
    aiofiles \
    python-socketio \
    websockets

# Create web UI directory structure
log_info "Creating web UI structure..."
mkdir -p "$PROJECT_ROOT/web-ui/{static,css,js,templates,uploads}"

# Create main FastAPI app file
log_info "Creating main application file..."
cat > "$PROJECT_ROOT/web-ui/main.py" << 'PYTHON'
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, File, UploadFile
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from pathlib import Path
import asyncio
import json
import uuid

app = FastAPI(title="TARS AI Assistant", version="1.0.0")

# Mount static files
app.mount("/static", StaticFiles(directory="web-ui/static"), name="static")
templates = Jinja2Templates(directory="web-ui/templates")

@app.get("/", response_class=HTMLResponse)
async def read_root():
    return templates.TemplateResponse("index.html", {"request": {}})

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            # Process AI response here
            response = {"message": "Hello from TARS!", "type": "response"}
            await websocket.send_text(json.dumps(response))
    except WebSocketDisconnect:
        print("Client disconnected")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
PYTHON

# Create HTML template
log_info "Creating HTML template..."
mkdir -p "$PROJECT_ROOT/web-ui/templates"
cat > "$PROJECT_ROOT/web-ui/templates/index.html" << 'HTML'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TARS AI Assistant</title>
    <link rel="stylesheet" href="/static/css/style.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>TARS AI Assistant</h1>
            <div class="header-game" id="flappy-bird">
                <!-- Flappy Bird game will go here -->
            </div>
        </header>
        
        <main>
            <div class="chat-container">
                <div class="messages" id="messages"></div>
                <div class="input-area">
                    <input type="text" id="message-input" placeholder="Ask TARS something...">
                    <button id="send-button">Send</button>
                    <input type="file" id="file-upload" accept=".txt,.pdf,.jpg,.jpeg,.png">
                    <button id="upload-button">Upload</button>
                </div>
            </div>
        </main>
    </div>
    <script src="/static/js/app.js"></script>
</body>
</html>
HTML

# Create CSS file
log_info "Creating CSS styles..."
mkdir -p "$PROJECT_ROOT/web-ui/static/css"
cat > "$PROJECT_ROOT/web-ui/static/css/style.css" << 'CSS'
:root {
    --bg-primary: #1a1a1a;
    --bg-secondary: #2d2d2d;
    --text-primary: #ffffff;
    --text-secondary: #cccccc;
    --accent-color: #2563eb;
    --border-color: #404040;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    background-color: var(--bg-primary);
    color: var(--text-primary);
    font-family: 'Inter', sans-serif;
    height: 100vh;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    height: 100%;
    display: flex;
    flex-direction: column;
}

header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0;
    border-bottom: 1px solid var(--border-color);
}

.header-game {
    width: 100px;
    height: 50px;
    background-color: var(--bg-secondary);
    border-radius: 5px;
}

.chat-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-top: 20px;
}

.messages {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    background-color: var(--bg-secondary);
    border-radius: 10px;
    margin-bottom: 20px;
}

.input-area {
    display: flex;
    gap: 10px;
    align-items: center;
}

#message-input {
    flex: 1;
    padding: 15px;
    border: 1px solid var(--border-color);
    border-radius: 5px;
    background-color: var(--bg-secondary);
    color: var(--text-primary);
}

button {
    padding: 15px 20px;
    background-color: var(--accent-color);
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    opacity: 0.9;
}
CSS

log_success "Web interface setup completed successfully!"
log_info "Run: cd web-ui && python main.py"
log_info "Access: http://localhost:8000"
