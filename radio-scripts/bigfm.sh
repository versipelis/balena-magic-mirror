#!/bin/bash
sudo killall mpg123 2>/dev/null
sleep 0.1
mpg123 https://streams.bigfm.de/bigfm-deutschland-128-mp3
