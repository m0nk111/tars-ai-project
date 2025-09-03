from fastapi import File, UploadFile
# File upload endpoint
@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        upload_dir = "uploads"
        os.makedirs(upload_dir, exist_ok=True)
        file_location = os.path.join(upload_dir, file.filename)
        with open(file_location, "wb") as f:
            shutil.copyfileobj(file.file, f)
        return {"status": "success", "filename": file.filename, "message": "File uploaded successfully."}
    except Exception as e:
        logger.error(f"Upload error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import logging
import sqlite3
import json
import shutil
import os
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="TARS AI Backend", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database setup
def init_db():
    conn = sqlite3.connect('conversation_memory.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS conversations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT,
            timestamp DATETIME,
            user_message TEXT,
            ai_response TEXT
        )
    ''')
    conn.commit()
    conn.close()

init_db()

class ChatRequest(BaseModel):
    message: str
    session_id: str = "default"

class ChatResponse(BaseModel):
    response: str
    status: str

@app.get("/")
@app.head("/")
async def root():
    return {"message": "TARS AI Backend is running!", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "TARS Backend", "timestamp": datetime.now().isoformat()}

@app.get("/api/chat")
async def chat_test():
    return {"message": "Chat endpoint is working!", "response": "Hallo, ik ben TARS!"}

@app.post("/api/chat")
async def chat_message(request: ChatRequest):
    try:
        # Simpele AI response - later vervangen met echte AI model
        response = f"Ik heb je bericht ontvangen: '{request.message}'. Dit is een test response van TARS."
        
        # Opslaan in database
        conn = sqlite3.connect('conversation_memory.db')
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO conversations (session_id, timestamp, user_message, ai_response) VALUES (?, ?, ?, ?)",
            (request.session_id, datetime.now(), request.message, response)
        )
        conn.commit()
        conn.close()
        
        return ChatResponse(response=response, status="success")
    except Exception as e:
        logger.error(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/conversations")
async def get_conversations(session_id: str = "default", limit: int = 10):
    try:
        conn = sqlite3.connect('conversation_memory.db')
        cursor = conn.cursor()
        cursor.execute(
            "SELECT timestamp, user_message, ai_response FROM conversations WHERE session_id = ? ORDER BY timestamp DESC LIMIT ?",
            (session_id, limit)
        )
        conversations = cursor.fetchall()
        conn.close()
        
        return {
            "session_id": session_id,
            "conversations": [
                {
                    "timestamp": ts,
                    "user_message": msg,
                    "ai_response": resp
                } for ts, msg, resp in conversations
            ]
        }
    except Exception as e:
        logger.error(f"Get conversations error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Dummy model list endpoint
@app.get("/api/models")
async def get_models():
    # Return een dummy lijst van modellen
    return {"gpt-3.5": "GPT-3.5 Turbo", "deepseek-r1": "DeepSeek R1"}

# Dummy system stats endpoint
@app.get("/api/stats")
async def get_stats():
    # Return dummy systeemstatistieken
    return {
        "cpu_usage": "10%",
        "cpu_temp": "45°C",
        "memory_display": "2GB/8GB",
        "gpu_usage": "5%",
        "vram_display": "1GB/8GB",
        "gpu_temp": "40°C",
        "current_model": "gpt-3.5"
    }

# Dummy model database
ALL_MODELS = [
    {"id": "gemma2:2b", "name": "Gemma 2B", "size_gb": 4, "type": "Transformer", "description": "Snelle, lichte open-source model."},
    {"id": "llama3:8b", "name": "Llama 3 8B", "size_gb": 16, "type": "Transformer", "description": "Grote, krachtige model voor complexe taken."},
    {"id": "mistral:7b", "name": "Mistral 7B", "size_gb": 13, "type": "Transformer", "description": "Efficiënt en snel, geschikt voor chat en code."}
]
MODELS_DIR = "/home/flip/tars-ai-project/models/"
ACTIVE_MODEL_FILE = "/home/flip/tars-ai-project/generated/active_model.json"

# Helper: lijst van gedownloade modellen
@app.get("/api/models/downloaded")
async def get_downloaded_models():
    if not os.path.exists(MODELS_DIR):
        return []
    return [f for f in os.listdir(MODELS_DIR) if os.path.isdir(os.path.join(MODELS_DIR, f))]

# Helper: alle beschikbare modellen met details
@app.get("/api/models/all")
async def get_all_models():
    return ALL_MODELS

# Helper: details van één model
@app.get("/api/models/details/{model_id}")
async def get_model_details(model_id: str):
    for m in ALL_MODELS:
        if m["id"] == model_id:
            return m
    raise HTTPException(status_code=404, detail="Model niet gevonden")

# Helper: beschikbare ruimte in GB
@app.get("/api/storage/free")
async def get_free_space():
    total, used, free = shutil.disk_usage(MODELS_DIR)
    return {"free_gb": round(free / (1024**3), 2)}

# Download model (dummy, simuleer download)
@app.post("/api/models/download/{model_id}")
async def download_model(model_id: str):
    # Simuleer download: maak een map aan
    for m in ALL_MODELS:
        if m["id"] == model_id:
            free_gb = (shutil.disk_usage(MODELS_DIR)[2]) / (1024**3)
            if free_gb < m["size_gb"]:
                raise HTTPException(status_code=400, detail="Onvoldoende schijfruimte")
            os.makedirs(os.path.join(MODELS_DIR, model_id), exist_ok=True)
            return {"status": "success", "message": f"Model {model_id} gedownload."}
    raise HTTPException(status_code=404, detail="Model niet gevonden")

# Zet actief model
@app.post("/api/models/activate/{model_id}")
async def activate_model(model_id: str):
    if not os.path.exists(os.path.join(MODELS_DIR, model_id)):
        raise HTTPException(status_code=400, detail="Model niet gedownload")
    with open(ACTIVE_MODEL_FILE, "w") as f:
        json.dump({"active_model": model_id}, f)
    return {"status": "success", "active_model": model_id}

# Ophalen actief model
@app.get("/api/models/active")
async def get_active_model():
    if os.path.exists(ACTIVE_MODEL_FILE):
        with open(ACTIVE_MODEL_FILE) as f:
            data = json.load(f)
            return data.get("active_model", None)
    return None

# Basic WebSocket endpoint
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            # Echo het bericht terug
            await websocket.send_text(f"Echo: {data}")
    except WebSocketDisconnect:
        pass

if __name__ == "__main__":
    import socket
    def port_in_use(port):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            return s.connect_ex(("127.0.0.1", port)) == 0

    if port_in_use(8002):
        print("[ERROR] Port 8002 is already in use. Please stop other processes before starting this server.")
        exit(1)
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
