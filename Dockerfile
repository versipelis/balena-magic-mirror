FROM balenalib/raspberrypi3-node:18-bookworm-run

RUN apt-get update && apt-get install -y git wget unzip dos2unix python3 build-essential && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# MagicMirror Core laden
RUN wget https://github.com/MichMich/MagicMirror/archive/refs/tags/v2.25.0.zip && \
    unzip v2.25.0.zip && \
    mv MagicMirror-2.25.0/* . && \
    rm -rf MagicMirror-2.25.0 v2.25.0.zip

# Core Abhängigkeiten installieren (Das fixt die 404/moment.js Fehler)
RUN npm install --include=dev

COPY config.js ./config/config.js
RUN dos2unix ./config/config.js

# Wir bauen ein Start-Skript direkt im Dockerfile
RUN echo "#!/bin/bash\n\
if [ ! -d 'modules/MMM-Ecowitt' ]; then\n\
  git clone --depth 1 https://github.com/vincep5/MMM-Ecowitt.git modules/MMM-Ecowitt\n\
  cd modules/MMM-Ecowitt && npm install --omit=dev && cd ../..\n\
fi\n\
node serveronly" > start.sh && chmod +x start.sh

EXPOSE 8080 3000
CMD ["./start.sh"]
