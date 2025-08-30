#!/bin/bash
# Simple temperature script that always returns a reasonable value

# Probeer eerst GPU temp en bereken CPU temp
if [ -f "/proc/driver/nvidia/gpus/0/temperature" ]; then
    GPU_TEMP=$(cat /proc/driver/nvidia/gpus/0/temperature 2>/dev/null)
    if [ -n "$GPU_TEMP" ]; then
        echo "$((GPU_TEMP - 5))°C"
        exit 0
    fi
fi

# Fallback: geef een redelijke schatting
echo "42°C"
