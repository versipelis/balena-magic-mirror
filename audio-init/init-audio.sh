#!/bin/bash
set -e

echo "Initializing WM8960 audio..."
sleep 5

# DEFAULT-LAUTSTÄRKE auf deine aktuelle angenehme Lautstärke setzen
DEFAULT_VOLUME=85

echo "Setting default volume to ${DEFAULT_VOLUME}%..."

# Speaker auf Maximum (Hardware-Verstärkung)
amixer -c 0 sset Speaker 100% unmute 2>/dev/null || true

# Playback auf 85% (deine angenehme Lautstärke)
amixer -c 0 sset Playback ${DEFAULT_VOLUME}% 2>/dev/null || true

# Headphone auch setzen
amixer -c 0 sset Headphone 100% unmute 2>/dev/null || true

# Audio-Routing aktivieren
amixer -c 0 sset 'Left Output Mixer PCM' on 2>/dev/null || true
amixer -c 0 sset 'Right Output Mixer PCM' on 2>/dev/null || true

echo "Audio configured - Speaker: 100%, Playback: ${DEFAULT_VOLUME}%"

# Keep container running
exec tail -f /dev/null
