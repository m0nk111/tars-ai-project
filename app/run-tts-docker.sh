#!/bin/bash
# Run the Coqui TTS Docker container for TARS
cd "$(dirname "$0")"
docker run --rm -p 5002:5002 --name tars-tts tars-tts:latest
