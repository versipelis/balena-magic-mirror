FROM bastilimbach/docker-magicmirror:latest

WORKDIR /opt/magic_mirror

# Wir kopieren nur deine config.js in den richtigen Ordner
COPY config.js /opt/magic_mirror/config/config.js

EXPOSE 8080
