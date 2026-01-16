#!/bin/bash
# Beende alle mpg123 Instanzen
sudo killall mpg123 2>/dev/null
sleep 0.1

# Starte Stream mit übergebenem Parameter
mpg123 "$1"
