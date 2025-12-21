# Wir nutzen ein fertiges Image von einem Docker-Experten (bastilimbach)
FROM bastilimbach/docker-magicmirror:latest

# Wir setzen das Arbeitsverzeichnis auf das des fertigen Images
WORKDIR /opt/magic_mirror

# Optional: Falls du später deine eigene Config nutzen willst
# COPY config.js /opt/magic_mirror/config/config.js

EXPOSE 8080
