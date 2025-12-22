FROM balenalib/raspberrypi3-node:18-bookworm-run

# Git installieren (wichtig für spätere Module)
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

# Arbeitsverzeichnis festlegen
WORKDIR /usr/src/app

# MagicMirror Core herunterladen und entpacken
RUN curl -L https://github.com/MichMich/MagicMirror/archive/refs/tags/v2.25.0.tar.gz | tar xz --strip-components=1

# Nur die notwendigen Abhängigkeiten installieren (ohne Dev-Tools, spart Platz)
RUN npm install --omit=dev --ignore-scripts

# DEINE config.js von GitHub direkt in den richtigen Ordner kopieren
# Da wir keine Volumes mehr in der docker-compose haben, wird diese Datei jetzt benutzt!
COPY config.js ./config/config.js

# Ports öffnen
EXPOSE 8080

# Den Server-Modus starten
CMD ["node", "serveronly"]
