FROM balenalib/raspberry-pi-debian:bookworm

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl git nano unzip libx11-dev libxss1 libasound2 libnss3 libgbm1 \
    && rm -rf /var/lib/apt/lists/*

RUN curl -sL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

WORKDIR /opt/magic_mirror
RUN git clone --depth 1 https://github.com/MichMich/MagicMirror.git . && \
    npm install --only=prod --unsafe-perm

# Ecowitt Modul
RUN cd modules && git clone https://github.com/vincep5/MMM-Ecowitt.git && \
    cd MMM-Ecowitt && npm install --only=prod

# Kopiert deine config.js in das Image
COPY config.js /opt/magic_mirror/config/config.js

EXPOSE 8080 3000
CMD ["node", "serveronly"]
