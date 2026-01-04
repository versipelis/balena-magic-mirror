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

        compassWrapper.innerHTML = `
            <svg viewBox="0 0 100 100" width="120" height="120">
                <circle cx="50" cy="50" r="45" class="compass-ring" />
                <text x="50" y="15" class="comp-label">N</text>
                <text x="85" y="53" class="comp-label">O</text>
                <text x="50" y="92" class="comp-label">S</text>
                <text x="15" y="53" class="comp-label">W</text>
                
                <g transform="rotate(${dir}, 50, 50)">
                    <path d="M50 22 L56 42 L50 38 L44 42 Z" class="comp-arrow" />
                </g>
                
                <text x="50" y="55" class="comp-speed">${speed}</text>
                <text x="50" y="70" class="comp-unit">km/h</text>
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
