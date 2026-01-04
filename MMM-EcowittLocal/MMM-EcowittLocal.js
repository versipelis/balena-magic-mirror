Module.register("MMM-EcowittLocal", {
    defaults: {
        deviceIP: "192.168.178.98",
        updateInterval: 15000
    },

    getStyles: function() {
        return ["MMM-EcowittLocal.css"];
    },

    start: function() {
        this.dataLocal = null;
        this.sendSocketNotification("CONFIG", this.config);
    },

    getDom: function() {
        var wrapper = document.createElement("div");
        wrapper.className = "weather-local";

        if (!this.dataLocal) {
            wrapper.innerHTML = "Lade Ecowitt Daten...";
            wrapper.className = "dimmed light small";
            return wrapper;
        }

        // Temperatur Anzeige oben
        var tempDiv = document.createElement("div");
        tempDiv.className = "large bright";
        tempDiv.innerHTML = `${this.dataLocal.temp}°C`;
        wrapper.appendChild(tempDiv);

        // Kompass Container
        var compassWrapper = document.createElement("div");
        compassWrapper.className = "compass-container";

        // SVG für den schlichten Kompass
        // Falls windDir fehlt, nutzen wir 0
        var dir = this.dataLocal.windDir || 0;
        var speed = this.dataLocal.wind || 0;

        // Der Pfeil liegt nun am Rand (y=5) und zeigt zur Mitte (y=20)
        compassWrapper.innerHTML = `
            <svg viewBox="0 0 100 100" width="120" height="120">
                <circle cx="50" cy="50" r="45" class="compass-ring-inner" />
                
                <circle cx="50" cy="50" r="45" class="compass-ring" transform="rotate(-90 50 50)" />
                
                <g transform="rotate(${dir}, 50, 50)">
                    <path d="M50 16 L54 2 L46 2 Z" class="comp-arrow" />
                </g>
                
                <text x="50" y="55" class="comp-speed">${speed}</text>
                <text x="50" y="72" class="comp-unit">km/h</text>
            </svg>
        `;
        wrapper.appendChild(compassWrapper);

        // Feuchtigkeits-Info ganz unten
        var humDiv = document.createElement("div");
        humDiv.className = "small dimmed";
        humDiv.innerHTML = `Feuchte: ${this.dataLocal.hum}`;
        wrapper.appendChild(humDiv);

        return wrapper;
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "DATA") {
            this.dataLocal = payload;
            this.updateDom();
        }
    }
});
