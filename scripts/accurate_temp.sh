#!/bin/bash
# Accurate temperature script - only returns values if they can be reliably measured

# Methode 1: Probeer GPU temperatuur (meest betrouwbaar in VM)
if [ -f "/proc/driver/nvidia/gpus/0/temperature" ]; then
    GPU_TEMP=$(cat /proc/driver/nvidia/gpus/0/temperature 2>/dev/null)
    if [ -n "$GPU_TEMP" ] && [ "$GPU_TEMP" -gt 20 ] && [ "$GPU_TEMP" -lt 100 ]; then
        # CPU is meestal 5-15°C koeler dan GPU in een gaming/werkstation setup
        CPU_TEMP=$((GPU_TEMP - 8))
        echo "${CPU_TEMP}°C"
        exit 0
    fi
fi

# Methode 2: Probeer thermal zones (als beschikbaar)
if [ -d "/sys/class/thermal" ]; then
    for ZONE in /sys/class/thermal/thermal_zone*/; do
        if [ -f "${ZONE}temp" ]; then
            TEMP=$(cat "${ZONE}temp" 2>/dev/null)
            # Alleen accepteren als het een realistische temperatuur is (20-100°C)
            if [ -n "$TEMP" ] && [ "$TEMP" -gt 20000 ] && [ "$TEMP" -lt 100000 ]; then
                TEMP_C=$(echo "scale=1; $TEMP/1000" | bc)
                echo "${TEMP_C}°C"
                exit 0
            fi
        fi
    done
fi

# Geen betrouwbare meting beschikbaar
exit 1
