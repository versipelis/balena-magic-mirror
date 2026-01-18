#!/bin/bash
# Passe den Pfad im node_helper.js an

sed -i 's|/home/pi/MagicMirror|/usr/src/app|g' /usr/src/app/modules/MMM-TouchPlayerBasic/node_helper.js
sed -i 's|scriptfiles|stations|g' /usr/src/app/modules/MMM-TouchPlayerBasic/node_helper.js
