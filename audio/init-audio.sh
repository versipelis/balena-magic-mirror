#!/bin/bash
set -e

echo "Initializing WM8960 audio..."

# Warte bis ALSA verfügbar ist
sleep 3

# Setze alle Mixer-Kontrollen
amixer -c 0 sset 'Speaker' 100% unmute 2>/dev/null || true
amixer -c 0 sset 'Playback' 100% 2>/dev/null || true
amixer -c 0 sset 'Headphone' 100% unmute 2>/dev/null || true
amixer -c 0 sset 'Left Output Mixer PCM' on 2>/dev/null || true
amixer -c 0 sset 'Right Output Mixer PCM' on 2>/dev/null || true

echo "Audio mixer configured successfully"

# Halte Container am Laufen
exec tail -f /dev/null
