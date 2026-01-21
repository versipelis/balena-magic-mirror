const NodeHelper = require("node_helper");
const http = require("http");
const https = require("https");

module.exports = NodeHelper.create({
    start: function() {
        console.log("Starting node helper for: " + this.name);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "GET_WEATHER_DATA") {
            this.getWeatherData(payload.url);
        }
    },

    getWeatherData: function(url) {
        const self = this;
        const protocol = url.startsWith('https') ? https : http;

        protocol.get(url, (resp) => {
            let data = '';

            resp.on('data', (chunk) => {
                data += chunk;
            });

            resp.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    self.sendSocketNotification("WEATHER_DATA", jsonData);
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                    self.sendSocketNotification("WEATHER_ERROR", error.message);
                }
            });

        }).on("error", (err) => {
            console.error("Error fetching weather data:", err.message);
            self.sendSocketNotification("WEATHER_ERROR", err.message);
        });
    }
});
