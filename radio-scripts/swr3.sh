#!/bin/bash

# 1. Log-Meldung ans balena-Dashboard senden
echo "[RADIO-START] SWR3 wurde via Button aktiviert" > /proc/1/fd/1

# 2. Bestehende Streams stoppen (Fehlermeldungen unterdrücken)
# In balena-Containern ist 'sudo' meist nicht nötig, da du als root läufst
killall mpg123 2>/dev/null
sleep 0.1

# 3. Audio-Routing zum balena-audio Block sicherstellen
export PULSE_SERVER=tcp:localhost:4317

# 4. Stream starten
# Das '&' am Ende ist wichtig, damit das Script den MagicMirror nicht blockiert!
mpg123 https://liveradio.swr.de/sw282p3/swr3/play.mp3 &

# 5. Bestätigung im Log, dass der Prozess gestartet wurde
echo "[RADIO-STATUS] mpg123 Prozess läuft im Hintergrund" > /proc/1/fd/1
