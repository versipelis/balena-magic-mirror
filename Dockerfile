FROM bastilimbach/docker-magicmirror:latest

WORKDIR /opt/magic_mirror

# 1. Das Ecowitt Modul einfach nur runterladen (kein npm install nötig, da das Image oft schon viel mitbringt)
RUN cd modules && git clone --depth 1 https://github.com/vincep5/MMM-Ecowitt.git

# 2. Deine eigene config.js von GitHub in den Container kopieren
COPY config.js /opt/magic_mirror/config/config.js

EXPOSE 8080
