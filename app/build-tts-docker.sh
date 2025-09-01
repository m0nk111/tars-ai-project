#!/bin/bash
# Build the Coqui TTS Docker image for TARS
cd "$(dirname "$0")"
docker build -t tars-tts:latest .
echo "Docker image 'tars-tts:latest' built. Start with: ./run-tts-docker.sh"
