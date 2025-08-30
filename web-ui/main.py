from fastapi import FastAPI, WebSocket, WebSocketDisconnect, File, UploadFile
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from pathlib import Path
import requests
import asyncio
import json
import uuid

app = FastAPI(title="TARS AI Assistant", version="1.0.0")

# Get absolute paths
BASE_DIR = Path(__file__).parent
STATIC_DIR = BASE_DIR / "static"
TEMPLATES_DIR = BASE_DIR / "templates"

# Mount static files
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
templates = Jinja2Templates(directory=TEMPLATES_DIR)

def get_ai_response(user_input):
    """Use Ollama to generate AI response"""
    try:
        # Create prompt for the AI assistant
        prompt = f"You are TARS, a helpful AI assistant. Answer the following question clearly and professionally.\\n\\nUser: {user_input}\\nTARS:"
        
        # Prepare data for Ollama API request
        ollama_data = {
            "model": "gemma2:2b",
            "prompt": prompt,
            "stream": False
        }
        
        # Send request to Ollama server
        response = requests.post(
            "http://localhost:11434/api/generate",
            json=ollama_data,
            timeout=120
        )
        
        # Check if request was successful
        response.raise_for_status()
        
        # Extract response from JSON result
        result = response.json()
        return result.get("response", "No response received from the AI model.")
        
    except requests.exceptions.RequestException as e:
        return f"Error communicating with AI model: {str(e)}"
    except Exception as e:
        return f"Unexpected error occurred: {str(e)}"

@app.get("/", response_class=HTMLResponse)
async def read_root():
    """Serve the main chat interface"""
    return templates.TemplateResponse("index.html", {"request": {}})

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """Handle WebSocket connections for real-time chat"""
    await websocket.accept()
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            message_data = json.loads(data)
            user_message = message_data["message"]
            
            # Get AI response
            ai_response = get_ai_response(user_message)
            
            # Send response back to client
            response_data = {"message": ai_response, "type": "response"}
            await websocket.send_text(json.dumps(response_data))
            
    except WebSocketDisconnect:
        print("Client disconnected from WebSocket")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
