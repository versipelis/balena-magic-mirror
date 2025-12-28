FROM balenalib/raspberrypi3-node:18-bookworm-run

# gettext-base wird für den Befehl 'envsubst' benötigt
RUN apt-get update && apt-get install -y git wget curl unzip dos2unix python3 build-essential gettext-base && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# MagicMirror Core laden
RUN curl -L https://github.com/MichMich/MagicMirror/archive/refs/tags/v2.25.0.tar.gz | tar xz --strip-components=1

# Core-Abhängigkeiten installieren
RUN npm install --include=dev

# Modul laden
RUN mkdir -p modules/MMM-FOSHKplugin-PWS-Observations && \
    curl -L https://github.com/git-olicat/MMM-FOSHKplugin-PWS-Observations/archive/refs/heads/main.tar.gz | tar xz -C modules/MMM-FOSHKplugin-PWS-Observations --strip-components=1

# Kopiere die Template-Datei anstatt der config.js
COPY config.js.template ./config/config.js.template

EXPOSE 8080 3000

# Der CMD-Befehl ersetzt jetzt die Variablen in der Vorlage und startet dann den Server
CMD envsubst < ./config/config.js.template > ./config/config.js && node serveronly
