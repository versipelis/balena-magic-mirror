FROM balenalib/raspberrypi3-node:18-bookworm-run

# --- UPDATE: Audio-Pakete hinzugefügt (pulseaudio-utils, alsa-utils, mpg123, mplayer) ---
RUN apt-get update && apt-get install -y \
    git wget curl unzip dos2unix python3 build-essential gettext-base \
    pulseaudio-utils alsa-utils mpg123 mplayer \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# MagicMirror Core laden
RUN curl -L https://github.com/MichMich/MagicMirror/archive/refs/tags/v2.25.0.tar.gz | tar xz --strip-components=1

# Core-Abhängigkeiten installieren
RUN npm install --include=dev

# --- MMM-OpenWeatherMapForecast laden ---
RUN mkdir -p modules/MMM-OpenWeatherMapForecast && \
    curl -L https://github.com/MarcLandis/MMM-OpenWeatherMapForecast/archive/refs/heads/master.tar.gz | tar xz -C modules/MMM-OpenWeatherMapForecast --strip-components=1
RUN cd modules/MMM-OpenWeatherMapForecast && npm install --omit=dev

# --- NEU: MMM-TouchPlayerBasic laden ---
RUN mkdir -p modules/MMM-TouchPlayerBasic && \
    curl -L https://github.com/brobergp/MMM-TouchPlayerBasic/archive/refs/heads/master.tar.gz | tar xz -C modules/MMM-TouchPlayerBasic --strip-components=1
# Dieses Modul braucht meist kein npm install, da es interne Player nutzt.

# --- MMM-FOSHKplugin laden ---
RUN mkdir -p modules/MMM-FOSHKplugin-PWS-Observations && \
    curl -L https://github.com/git-olicat/MMM-FOSHKplugin-PWS-Observations/archive/refs/heads/main.tar.gz | tar xz -C modules/MMM-FOSHKplugin-PWS-Observations --strip-components=1
RUN cd modules/MMM-FOSHKplugin-PWS-Observations && \
    npm install request && \
    npm install --omit=dev

# Template kopieren
COPY config.js.template ./config/config.js.template

# Kopiere den kompletten Modul-Ordner in das Verzeichnis für externe Module
COPY MMM-EcowittLocal modules/MMM-EcowittLocal

EXPOSE 8080 3000

# Variablen ersetzen und Server starten
CMD envsubst < ./config/config.js.template > ./config/config.js && node serveronly
