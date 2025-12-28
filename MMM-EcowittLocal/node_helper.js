const NodeHelper = require("node_helper");
const fetch = require("node_fetch");

module.exports = NodeHelper.create({
    start: function() {
        console.log("Ecowitt helper started...");
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

    getData: function() {
        const url = `http://${this.config.deviceIP}/get_livedata_info`;
        fetch(url)
            .then(res => res.json())
            .then(json => {
                // Mapping deiner IDs aus dem JSON
                const result = {
                    temp: json.common_list.find(i => i.id === "0x02").val,
                    hum: json.common_list.find(i => i.id === "0x07").val,
                    wind: json.common_list.find(i => i.id === "0x0B").val
                };
                this.sendSocketNotification("DATA", result);
            })
            .catch(err => console.error("Ecowitt Fetch Error:", err));
    }
});
