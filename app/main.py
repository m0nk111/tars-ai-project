from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import logging
import sqlite3
import json
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
