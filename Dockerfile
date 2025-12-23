FROM balenalib/raspberrypi3-node:18-bookworm-run

RUN apt-get update && apt-get install -y git wget unzip dos2unix python3 build-essential && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# MagicMirror Core laden (Deine bewährte Methode)
RUN wget https://github.com/MichMich/MagicMirror/archive/refs/tags/v2.25.0.zip && \
    unzip v2.25.0.zip && \
    mv MagicMirror-2.25.0/* . && \
    rm -rf MagicMirror-2.25.0 v2.25.0.zip

# Core-Abhängigkeiten
RUN npm install --include=dev

# JETZT NEU: Ecowitt Modul via WGET (statt Git)
RUN mkdir -p modules/MMM-Ecowitt && \
    wget https://github.com/vincep5/MMM-Ecowitt/archive/refs/heads/master.zip -O ecowitt.zip && \
    unzip ecowitt.zip && \
    mv MMM-Ecowitt-master/* modules/MMM-Ecowitt/ && \
    rm -rf MMM-Ecowitt-master ecowitt.zip

# Installation im Modul-Ordner
RUN cd modules/MMM-Ecowitt && npm install --omit=dev

COPY config.js ./config/config.js
RUN dos2unix ./config/config.js

EXPOSE 8080 3000
CMD ["node", "serveronly"]
