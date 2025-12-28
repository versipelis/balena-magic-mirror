FROM balenalib/raspberrypi3-node:18-bookworm-run

# gettext-base für envsubst (Template-System)
RUN apt-get update && apt-get install -y git wget curl unzip dos2unix python3 build-essential gettext-base && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# MagicMirror Core laden
RUN curl -L https://github.com/MichMich/MagicMirror/archive/refs/tags/v2.25.0.tar.gz | tar xz --strip-components=1

# Core-Abhängigkeiten installieren
RUN npm install --include=dev

# Modul laden
RUN mkdir -p modules/MMM-FOSHKplugin-PWS-Observations && \
    curl -L https://github.com/git-olicat/MMM-FOSHKplugin-PWS-Observations/archive/refs/heads/main.tar.gz | tar xz -C modules/MMM-FOSHKplugin-PWS-Observations --strip-components=1

# FEHLERBEHEBUNG: 'request' manuell im Modul-Ordner installieren
RUN cd modules/MMM-FOSHKplugin-PWS-Observations && \
    npm install request && \
    npm install --omit=dev

# Template kopieren (Wichtig: Datei muss lokal config.js.template heißen!)
COPY config.js.template ./config/config.js.template

# Kopiere den Provider in das System
COPY ecowittlocal.js modules/default/weather/providers/ecowittlocal.js

EXPOSE 8080 3000

# Variablen ersetzen und Server starten
CMD envsubst < ./config/config.js.template > ./config/config.js && node serveronly
