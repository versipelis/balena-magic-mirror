FROM balenalib/raspberry-pi-debian:bookworm

# Erweiterte Abhängigkeiten für den Build-Prozess
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl git nano unzip build-essential python3 python-is-python3 \
    libx11-dev libxss1 libasound2 libnss3 libgbm1 libgtk-3-0 \
    && rm -rf /var/lib/apt/lists/*

# Node.js 18
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

WORKDIR /opt/magic_mirror

# MagicMirror Installation mit Fehler-Unterdrückung für optionale Abhängigkeiten
RUN git clone --depth 1 https://github.com/MichMich/MagicMirror.git . && \
    npm install --only=prod --unsafe-perm || npm install --only=prod --unsafe-perm

# Ecowitt Modul
RUN cd modules && git clone https://github.com/vincep5/MMM-Ecowitt.git && \
    cd MMM-Ecowitt && npm install --only=prod

# WICHTIG: Erstelle einen leeren Config-Ordner, falls COPY Probleme macht
RUN mkdir -p config
COPY config.js /opt/magic_mirror/config/config.js

EXPOSE 8080 3000
CMD ["node", "serveronly"]
