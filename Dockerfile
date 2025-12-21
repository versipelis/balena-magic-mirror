FROM balenalib/raspberrypi3-node:18-bookworm-run

# Git nur installieren, falls wir es später brauchen
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# MagicMirror herunterladen und entpacken
RUN curl -L https://github.com/MichMich/MagicMirror/archive/refs/tags/v2.25.0.tar.gz | tar xz --strip-components=1

# Nur die allernötigsten Kern-Abhängigkeiten installieren
RUN npm install --omit=dev --ignore-scripts

# Deine config.js in den richtigen Ordner kopieren
COPY config.js ./config/config.js

EXPOSE 8080
CMD ["node", "serveronly"]
