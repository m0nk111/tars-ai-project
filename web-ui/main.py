from fastapi import FastAPI, WebSocket, WebSocketDisconnect, File, UploadFile, Request
import sys
sys.path.append("/home/flip/tars-ai-project")
from memory.sqlite_memory import init_db, save_message, get_conversation_history as get_sqlite_history
import sys
sys.path.append("/home/flip/tars-ai-project")
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse, JSONResponse
from pathlib import Path
import requests
import asyncio
import json
import uuid
import psutil
import subprocess
import time
import os
from scripts.model_manager import get_last_used_model, save_last_used_model
from scripts.simple_memory import simple_memory

app = FastAPI(title="TARS AI Assistant", version="1.0.0")

# Get absolute paths
BASE_DIR = Path(__file__).parent
STATIC_DIR = BASE_DIR / "static"
TEMPLATES_DIR = BASE_DIR / "templates"
UPLOAD_DIR = BASE_DIR / "uploads"

# Current model settings
init_db()
current_model = get_last_used_model()

# Mount static files
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
templates = Jinja2Templates(directory=TEMPLATES_DIR)

def get_available_models():
    """Dynamically fetch available models from Ollama"""
    try:
        response = requests.get("http://localhost:11434/api/tags", timeout=10)
        response.raise_for_status()
        models_data = response.json()
        
        available_models = {}
        for model in models_data.get("models", []):
            model_name = model.get("name", "")
            # Format model name for display
            display_name = model_name.replace(":", " - ").title()
            available_models[model_name] = display_name
        
        return available_models
    except requests.exceptions.RequestException:
        # Fallback to basic models if Ollama is not reachable
        return {
            "gemma2:2b": "Gemma 2 - 2B",
            "deepseek-coder:6.7b": "Deepseek Coder - 6.7B"
        }

def get_conversation_history(user_id="default_user", limit=10):
    """Get conversation history from SQLite database"""
    try:
        return simple_memory.get_conversation_history(user_id, limit)
    except Exception as e:
        print(f"Error retrieving conversation history: {e}")
        return []
def get_ai_response(user_input):
    """Use Ollama to generate AI response"""
    global current_model
    try:
        # Create prompt for the AI assistant
        prompt = f"You are TARS, a helpful AI assistant. Answer the following question clearly and professionally.\\n\\nUser: {user_input}\\nTARS:"
        
        # Prepare data for Ollama API request
        ollama_data = {
            "model": current_model,
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
        
        save_message("default_user", "user", user_input)
        save_message("default_user", "assistant", ai_response)
    except requests.exceptions.RequestException as e:
        return f"Error communicating with AI model: {str(e)}"
    except Exception as e:
        return f"Unexpected error occurred: {str(e)}"

def get_system_stats():
    """Get real-time system statistics"""
    try:
        # Get CPU temperature (only if reliable)
        cpu_temp = "N/A"
        try:
            temp_result = subprocess.run(
                ['/home/flip/tars-ai-project/scripts/accurate_temp.sh'],
                capture_output=True, text=True, timeout=3
            )
            if temp_result.returncode == 0:
                cpu_temp = temp_result.stdout.strip()
        except (subprocess.TimeoutExpired, subprocess.CalledProcessError):
            pass  # Keep as N/A if measurement fails
        
        # GPU stats (if NVIDIA) - reliable
        gpu_stats = {}
        try:
            nvidia_smi = subprocess.check_output([
                'nvidia-smi', '--query-gpu=utilization.gpu,memory.used,memory.total,temperature.gpu',
                '--format=csv,noheader,nounits'
            ], text=True)
            gpu_data = nvidia_smi.strip().split(', ')
            gpu_stats = {
                'gpu_usage': f"{gpu_data[0]}%",
                'vram_used': f"{gpu_data[1]} MB",
                'vram_total': f"{gpu_data[2]} MB",
                'vram_display': f"{gpu_data[1]}MB / {gpu_data[2]}MB",
                'gpu_temp': f"{gpu_data[3]}°C"
            }
        except (subprocess.CalledProcessError, FileNotFoundError):
            gpu_stats = {'gpu_available': False}
        
        # Get memory stats
        memory = psutil.virtual_memory()
        memory_stats = {
            'memory_percent': f"{memory.percent}%",
            'memory_used_mb': memory.used // (1024**2),
            'memory_total_mb': memory.total // (1024**2),
            'memory_display': f"{memory.used // (1024**2)}MB / {memory.total // (1024**2)}MB ({memory.percent}%)"
        }
        
        # System stats
        return {
            'cpu_usage': f"{psutil.cpu_percent()}%",
            'cpu_temp': cpu_temp,
            **memory_stats,
            'current_model': current_model,
            'model_name': get_available_models().get(current_model, current_model),
            'timestamp': time.time(),
            **gpu_stats
        }
    except Exception as e:
        return {'error': str(e)}

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    """Serve the main chat interface with system stats"""
    stats = get_system_stats()
    available_models = get_available_models()
    return templates.TemplateResponse("index.html", {
        "request": request,
        "system_stats": stats,
        "available_models": available_models
    })

@app.get("/api/stats")
async def get_stats():
    """API endpoint for system statistics"""
    return JSONResponse(get_system_stats())

@app.get("/api/models")
async def get_models():
    """API endpoint for available models"""
    return JSONResponse(get_available_models())

@app.post("/api/switch-model")
async def switch_model(request: Request):
    """API endpoint to switch AI model"""
    global current_model
    try:
        data = await request.json()
        new_model = data.get("model")
        available_models = get_available_models()
        
        if new_model in available_models:
            current_model = new_model
            save_last_used_model(new_model)
            return JSONResponse({
                "status": "success",
                "message": f"Model switched to {new_model}",
                "model": new_model
            })
        else:
            return JSONResponse({
                "status": "error",
                "message": f"Model not available: {new_model}"
            }, status_code=400)
            
    except Exception as e:
        return JSONResponse({
            "status": "error",
            "message": str(e)
        }, status_code=500)

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    """Handle file uploads"""
    try:
        # Create uploads directory if it doesn't exist
        UPLOAD_DIR.mkdir(exist_ok=True)
        
        # Save the file
        file_path = UPLOAD_DIR / file.filename
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
        
        return JSONResponse({
            "status": "success",
            "message": f"File {file.filename} uploaded successfully",
            "file_path": str(file_path)
        })
    except Exception as e:
        return JSONResponse({
            "status": "error",
            "message": f"Upload failed: {str(e)}"
        }, status_code=500)

@app.get("/api/files")
async def list_files():
    """List uploaded files"""
    try:
        files = []
        if UPLOAD_DIR.exists():
            for file_path in UPLOAD_DIR.iterdir():
                if file_path.is_file():
                    files.append({
                        "name": file_path.name,
                        "size": file_path.stat().st_size,
                        "upload_time": file_path.stat().st_mtime
                    })
        return JSONResponse({"files": files})
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """Handle WebSocket connections for real-time chat"""
    await websocket.accept()
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            if message_data.get("type") == "get_stats":
                # Send system stats
                stats = get_system_stats()
                await websocket.send_text(json.dumps({
                    "type": "system_stats",
                    "data": stats
                }))
            else:
                # Handle chat message
                user_message = message_data["message"]
                ai_response = get_ai_response(user_message)
                
                # Send response back to client
                response_data = {
                    "message": ai_response,
                    "type": "response",
                    "model": current_model
                }
                await websocket.send_text(json.dumps(response_data))
            
    except WebSocketDisconnect:
        print("Client disconnected from WebSocket")

@app.get("/api/conversations")
async def get_conversations(user_id: str = "default_user", limit: int = 10):
    """API endpoint to get conversation history"""
    try:
        history = get_conversation_history(user_id, limit)
        return JSONResponse({"conversations": history})
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

@app.delete("/api/conversations/{conversation_id}")
async def delete_conversation(conversation_id: str):
    """API endpoint to delete a specific conversation"""
    try:
        # Simple implementation - in real version would actually delete
        return JSONResponse({
            "status": "success",
            "message": "Delete functionality coming soon"
        })
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
