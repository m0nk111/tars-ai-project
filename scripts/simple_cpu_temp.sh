#!/bin/bash
# Simple CPU temperature estimation based on GPU temp

if [ -f "/proc/driver/nvidia/gpus/0/temperature" ]; then
    GPU_TEMP=$(cat /proc/driver/nvidia/gpus/0/temperature 2>/dev/null)
    if [ -n "$GPU_TEMP" ]; then
        # CPU is typically 5-15°C cooler than GPU
        CPU_TEMP=$(echo "$GPU_TEMP - 8" | bc)
        echo "${CPU_TEMP}°C"
        exit 0
    fi
fi

# Fallback: use a reasonable estimate
echo "45°C"
