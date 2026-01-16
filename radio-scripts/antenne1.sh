#!/bin/bash
sudo killall mpg123 2>/dev/null
sleep 0.1
mpg123 https://stream.antenne1.de/a1stg/livestream2.mp3
