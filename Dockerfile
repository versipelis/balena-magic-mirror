# Ein sehr stabiles Node-Image für Raspberry Pi
FROM balenalib/raspberrypi3-node:18-bookworm-run

# Git für das Modul installieren
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# Wir laden MagicMirror direkt als fertiges Paket herunter (kein npm install nötig)
RUN curl -L https://github.com/MichMich/MagicMirror/archive/refs/tags/v2.25.0.tar.gz | tar xz --strip-components=1 && \
    npm install --omit=dev --ignore-scripts

# Ecowitt Modul hinzufügen
RUN cd modules && git clone --depth 1 https://github.com/vincep5/MMM-Ecowitt.git

# Deine Config kopieren
COPY config.js ./config/config.js

EXPOSE 8080
CMD ["node", "serveronly"]
