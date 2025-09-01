# Simple Coqui TTS HTTP server for TARS
from fastapi import FastAPI, Request
from fastapi.responses import FileResponse, JSONResponse
from TTS.api import TTS
import tempfile
import os

app = FastAPI()
tts_model = TTS()

def synthesize(text, speaker=None):
    with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as f:
        tts_model.tts_to_file(text, file_path=f.name, speaker=speaker)
        return f.name

@app.post('/api/tts')
async def tts_endpoint(request: Request):
    data = await request.json()
    text = data.get('text', '')
    speaker = data.get('speaker', None)
    if not text:
        return JSONResponse({'error': 'No text provided'}, status_code=400)
    wav_path = synthesize(text, speaker)
    return FileResponse(wav_path, media_type='audio/wav', filename='tts.wav')

@app.get('/api/tts/speakers')
def get_speakers():
    speakers = tts_model.speakers if hasattr(tts_model, 'speakers') else []
    return {'speakers': speakers}
