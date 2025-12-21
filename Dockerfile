FROM balenalib/raspberry-pi-debian:bookworm

# Nur das Nötigste installieren
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl git nodejs npm && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /opt/magic_mirror

# MagicMirror klonen und NUR die Kern-Abhängigkeiten installieren
RUN git clone --depth 1 https://github.com/MichMich/MagicMirror.git . && \
    npm install --only=prod --unsafe-perm --ignore-scripts

# Wir nutzen erst mal die Standard-Beispiel-Konfiguration
RUN cp config/config.js.sample config/config.js

EXPOSE 8080
CMD ["node", "serveronly"]
