#!/bin/bash
sudo killall mpg123 2>/dev/null
sleep 0.1
mpg123 https://liveradio.swr.de/sw282p3/swr3/play.mp3
