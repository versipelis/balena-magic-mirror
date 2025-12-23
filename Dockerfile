FROM balenalib/raspberrypi3-node:18-bookworm-run

RUN apt-get update && apt-get install -y git wget curl unzip dos2unix python3 build-essential && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# MagicMirror Core laden
RUN curl -L https://github.com/MichMich/MagicMirror/archive/refs/tags/v2.25.0.tar.gz | tar xz --strip-components=1

# WICHTIG: Erst die Core-Abhängigkeiten installieren, inklusive Vendor-Sachen
# Wir entfernen --ignore-scripts, damit MagicMirror seine Vendor-Scripte bauen kann
RUN npm install --include=dev

# Neues Modul laden: MMM-FOSHKplugin-PWS-Observations
RUN mkdir -p modules/MMM-FOSHKplugin-PWS-Observations && \
    curl -L https://github.com/git-olicat/MMM-FOSHKplugin-PWS-Observations/archive/refs/heads/main.tar.gz | tar xz -C modules/MMM-FOSHKplugin-PWS-Observations --strip-components=1

# Modul-Abhängigkeiten
RUN cd modules/MMM-FOSHKplugin-PWS-Observations && npm install --omit=dev || echo "Keine extra Installation nötig"

COPY config.js ./config/config.js
RUN dos2unix ./config/config.js

EXPOSE 8080 3000
CMD ["node", "serveronly"]
