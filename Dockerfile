# Wir nehmen ein fertiges Node-Image (statt Debian selbst zu basteln)
FROM node:18-bookworm-slim

# Nur Git installieren, um den Code zu holen
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

WORKDIR /opt/magic_mirror

# MagicMirror holen
RUN git clone --depth 1 https://github.com/MichMich/MagicMirror.git .

# Installation ohne Scripte und ohne Electron-Ballast
RUN npm install --omit=dev --ignore-scripts

# Beispiel-Konfiguration nutzen
RUN cp config/config.js.sample config/config.js

EXPOSE 8080
CMD ["node", "serveronly"]
