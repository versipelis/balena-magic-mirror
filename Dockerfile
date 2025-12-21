FROM bastilimbach/docker-magicmirror:latest

# Wir wechseln in das Verzeichnis, das das Image vorgibt
WORKDIR /opt/magicmirror

# Wir kopieren die Datei genau dorthin, wo das Image sie sucht
COPY config.js /opt/magicmirror/config/config.js

EXPOSE 8080
