#!/bin/bash
set -e

echo "Initializing WM8960 audio..."
sleep 5

# Configure WM8960 mixer
amixer -c 0 sset 'Speaker' 50% unmute 2>/dev/null || true
amixer -c 0 sset 'Playback' 50% 2>/dev/null || true
amixer -c 0 sset 'Headphone' 50% unmute 2>/dev/null || true
amixer -c 0 sset 'Left Output Mixer PCM' on 2>/dev/null || true
amixer -c 0 sset 'Right Output Mixer PCM' on 2>/dev/null || true

echo "Audio configured successfully"

# Keep container running
exec tail -f /dev/null
