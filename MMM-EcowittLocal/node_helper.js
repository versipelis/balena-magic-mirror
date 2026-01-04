const NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
    start: function() {
        console.log("Ecowitt helper started (WS90 Mode)...");
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "CONFIG") {
            this.config = payload;
            this.getData();
            setInterval(() => {
                this.getData();
            }, this.config.updateInterval);
        }
    },

    getData: async function() {
        const url = `http://${this.config.deviceIP}/get_livedata_info`;
        try {
            const response = await fetch(url);
            const json = await response.json();
            
            // Hilfsfunktion um " km/h" oder "C" aus dem String zu entfernen
            const parseVal = (id) => {
                const item = json.common_list.find(i => i.id === id);
                return item ? parseFloat(item.val) : 0;
            };

            const result = {
                temp: parseVal("0x02"), // 0.5
                hum:  json.common_list.find(i => i.id === "0x07")?.val || "0%", // 69%
                wind: parseVal("0x0B"), // Windgeschwindigkeit 0.00
                gust: parseVal("0x0C"), // Böe 2.52
                windDir: parseVal("0x6D") // Windrichtung 354 (Grad)
            };
            
            this.sendSocketNotification("DATA", result);
        } catch (error) {
            console.error("Ecowitt Fetch Error:", error);
        }
    }
});
