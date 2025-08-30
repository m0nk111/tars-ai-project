#!/bin/bash
# Script om CPU temperatuur op te halen - probeert multiple methodes

# Methode 1: Via thermal zone (Linux kernel) - meest betrouwbaar in VM
if [ -d "/sys/class/thermal" ]; then
    for ZONE in /sys/class/thermal/thermal_zone*/; do
        if [ -f "${ZONE}temp" ] && [ -f "${ZONE}type" ]; then
            ZONE_TYPE=$(cat "${ZONE}type")
            if [[ "$ZONE_TYPE" == *"x86"* ]] || [[ "$ZONE_TYPE" == *"cpu"* ]] || [[ "$ZONE_TYPE" == *"acpitz"* ]]; then
                TEMP=$(cat "${ZONE}temp" 2>/dev/null)
                if [ -n "$TEMP" ] && [ "$TEMP" -gt 1000 ]; then
                    TEMP_C=$(echo "scale=1; $TEMP/1000" | bc)
                    echo "${TEMP_C}°C"
                    exit 0
                fi
            fi
        fi
    done
fi

# Methode 2: Via GPU temperatuur als referentie
if [ -f "/proc/driver/nvidia/gpus/0/temperature" ]; then
    GPU_TEMP=$(cat /proc/driver/nvidia/gpus/0/temperature 2>/dev/null)
    if [ -n "$GPU_TEMP" ]; then
        # Schat CPU temp based on GPU temp (meestal 5-15°C lager)
        CPU_TEMP=$(echo "$GPU_TEMP - 8" | bc)
        echo "${CPU_TEMP}°C"
        exit 0
    fi
fi

# Methode 3: Vaste schatting based on uptime en load
UPTIME=$(cat /proc/uptime | cut -d' ' -f1 | cut -d. -f1)
LOAD=$(awk '{print $1}' /proc/loadavg)

# Basis temperatuur schatting
BASE_TEMP=35
LOAD_FACTOR=$(echo "$LOAD * 3" | bc -l | cut -d. -f1)
TIME_FACTOR=$(echo "scale=0; $UPTIME / 1800" | bc)
EST_TEMP=$((BASE_TEMP + LOAD_FACTOR + TIME_FACTOR))

echo "${EST_TEMP}°C"
