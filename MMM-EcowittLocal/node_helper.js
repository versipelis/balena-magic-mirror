const NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
    start: function() {
        console.log("Ecowitt helper started...");
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "CONFIG") {
            this.config = payload;
            // Erster Aufruf beim Start
            this.getData();
            // Intervall einrichten
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
            
            // Mapping der IDs aus deinem JSON
            const result = {
                temp: json.common_list.find(i => i.id === "0x02").val,
                hum: json.common_list.find(i => i.id === "0x07").val,
                wind: json.common_list.find(i => i.id === "0x0B").val
            };
            
            this.sendSocketNotification("DATA", result);
        } catch (error) {
            console.error("Ecowitt Fetch Error:", error);
        }
    }
});
