#!/bin/bash
# Parameter $1 = Stream-URL

# Beende vorherige Instanzen
pkill -9 mpg123 2>/dev/null

# Starte Stream
mpg123 "$1"
