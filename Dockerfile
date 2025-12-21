# Basis-Image: Aktuelles Debian für Raspberry Pi
FROM balenalib/raspberry-pi-debian:bookworm

# System-Abhängigkeiten installieren
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    git \
    nano \
    unzip \
    libx11-dev \
    libxss1 \
    libasound2 \
    libnss3 \
    libgbm1 \
    && rm -rf /var/lib/apt/lists/*

# Node.js 18 installieren
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# MagicMirror installieren
WORKDIR /opt/magic_mirror
RUN git clone --depth 1 https://github.com/MichMich/MagicMirror.git . && \
    npm install --only=prod --unsafe-perm

# Ecowitt Modul direkt mit einbauen
RUN cd modules && \
    git clone https://github.com/vincep5/MMM-Ecowitt.git && \
    cd MMM-Ecowitt && \
    npm install --only=prod

COPY config.js /opt/magic_mirror/config/config.js

# Ports für Dashboard (8080) und Ecowitt (3000) öffnen
EXPOSE 8080 3000

# Start-Skript
CMD ["node", "serveronly"]