FROM balenalib/raspberrypi3-node:18-bookworm-run

# Wir installieren iputils-ping für den Verbindungstest
RUN apt-get update && apt-get install -y git wget curl unzip dos2unix python3 build-essential iputils-ping && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# 1. MagicMirror Core (wie gehabt)
RUN curl -L https://github.com/MichMich/MagicMirror/archive/refs/tags/v2.25.0.tar.gz | tar xz --strip-components=1
RUN npm install --omit=dev --ignore-scripts

# 2. DEBUG-ZONE: Verbindungstest und Download
RUN echo "Prüfe Internetverbindung zu GitHub..." && \
    ping -c 3 github.com || echo "GITHUB NICHT ERREICHBAR!" && \
    echo "Versuche Modul-Download..." && \
    (git clone --depth 1 https://github.com/vincep5/MMM-Ecowitt.git modules/MMM-Ecowitt || \
    (echo "FEHLERDETAILS: Git clone fehlgeschlagen. Prüfe Header..." && \
     curl -I https://github.com/vincep5/MMM-Ecowitt.git && \
     exit 1))

# 3. Installation
RUN cd modules/MMM-Ecowitt && npm install --omit=dev

COPY config.js ./config/config.js
RUN dos2unix ./config/config.js

EXPOSE 8080 3000
CMD ["node", "serveronly"]
