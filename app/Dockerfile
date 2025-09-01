# Coqui TTS Dockerfile for TARS
FROM python:3.10-slim

WORKDIR /app

# Install dependencies
RUN apt-get update && apt-get install -y build-essential libsndfile1 && rm -rf /var/lib/apt/lists/*

# Install Coqui TTS
RUN pip install --upgrade pip && pip install TTS fastapi uvicorn

COPY tts_server.py /app/tts_server.py

EXPOSE 5002

CMD ["uvicorn", "tts_server:app", "--host", "0.0.0.0", "--port", "5002"]
