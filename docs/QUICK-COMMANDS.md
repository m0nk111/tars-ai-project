# Quick Commands - TARS AI Assistant

## Development
\`\`\`bash
# Activate virtual environment
source venv/bin/activate

# Run web interface
cd web-ui && python main.py

# Test GPU functionality
python -c "import torch; print(f'PyTorch: {torch.__version__}, CUDA: {torch.cuda.is_available()}, GPU: {torch.cuda.get_device_name(0)}')"
\`\`\`

## Service Management
\`\`\`bash
# Start web service (development)
cd web-ui && python main.py

# Stop service
pkill -f "python main.py"

# Check if running
ps aux | grep "python main.py"
netstat -tlnp | grep :8000
\`\`\`

## Git Operations
\`\`\`bash
# Quick commit and push
git add .
git commit -m "Update: $(date +'%Y-%m-%d %H:%M')"
git push origin main

# Status check
git status
git log --oneline -5
\`\`\`

## System Info
\`\`\`bash
# GPU info
nvidia-smi
nvcc --version

# Python info
python --version
pip list | grep -E "(torch|transformers|fastapi)"

# Disk and memory
df -h
free -h
\`\`\`
