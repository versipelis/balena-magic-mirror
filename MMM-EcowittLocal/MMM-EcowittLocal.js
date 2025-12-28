Module.register("MMM-EcowittLocal", {
    defaults: {
        deviceIP: "192.168.178.98",
        updateInterval: 30000
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

        // Wir nutzen die Standard MagicMirror CSS-Klassen für ein sauberes Design
        wrapper.innerHTML = `
            <div class="large bright">${this.dataLocal.temp}°C</div>
            <div class="small dimmed">
                <span>Feuchte: ${this.dataLocal.hum}%</span> | 
                <span>Wind: ${this.dataLocal.wind} km/h</span>
            </div>
        `;
        return wrapper;
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "DATA") {
            this.dataLocal = payload;
            this.updateDom();
        }
    }
});
