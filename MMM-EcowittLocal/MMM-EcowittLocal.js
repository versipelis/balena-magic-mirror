Module.register("MMM-EcowittLocal", {
    defaults: {
        updateInterval: 60000, // 1 minute
        stationUrl: "http://192.168.178.98/get_livedata_info",
        displayMode: "all", // "all", "rain", "wind", "outdoor"
        animationSpeed: 1000,
        retryDelay: 2500,
        
        // ID mappings from your weather station
        ids: {
            outdoorTemp: "0x01",
            outdoorHumidity: "0x07",
            dewPoint: "0x03",
            feelsLike: "0x64",
            windSpeed: "0x0B",
            gustSpeed: "0x0C",
            windDirection: "0x0A",
            windDirectionAvg: "0xED",
            dayWindMax: "0x19",
            rainRate: "0x0E",
            rainEvent: "0x0D",
            rain24h: "0x7C",
            rainDay: "0x10",
            rainWeek: "0x11",
            rainMonth: "0x12",
            rainYear: "0x13",
            vpd: "0x5",
            solarIrradiance: "0x15",
            uvIndex: "0x17",
            indoorTemp: "0x02",
            indoorHumidity: "0x08",
            absolutePressure: "0x06",
            relativePressure: "0x07A"
        }
    },

    start: function() {
        Log.info("Starting module: " + this.name);
        this.weatherData = null;
        this.loaded = false;
        this.scheduleUpdate();
    },

    getStyles: function() {
        return ["MMM-EcowittLocal.css"];
    },

    scheduleUpdate: function() {
        var self = this;
        setInterval(function() {
            self.getData();
        }, this.config.updateInterval);
        this.getData();
    },

    getData: function() {
        this.sendSocketNotification("GET_WEATHER_DATA", {
            url: this.config.stationUrl
        });
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "WEATHER_DATA") {
            this.weatherData = this.parseData(payload);
            this.loaded = true;
            this.updateDom(this.config.animationSpeed);
        } else if (notification === "WEATHER_ERROR") {
            Log.error("Error getting weather data:", payload);
        }
    },

    parseData: function(rawData) {
        const self = this;
        const parsed = {};
        
        // Parse common_list
        if (rawData.common_list) {
            rawData.common_list.forEach(item => {
                const id = item.id;
                const val = item.val;
                
                // Map IDs to readable names
                if (id === self.config.ids.outdoorTemp) parsed.outdoorTemp = parseFloat(val);
                if (id === self.config.ids.outdoorHumidity) parsed.outdoorHumidity = parseInt(val);
                if (id === self.config.ids.dewPoint) parsed.dewPoint = parseFloat(val);
                if (id === self.config.ids.feelsLike) parsed.feelsLike = parseFloat(val);
                if (id === self.config.ids.windSpeed) parsed.windSpeed = parseFloat(val);
                if (id === self.config.ids.gustSpeed) parsed.gustSpeed = parseFloat(val);
                if (id === self.config.ids.windDirection) parsed.windDirection = parseInt(val);
                if (id === self.config.ids.windDirectionAvg) parsed.windDirectionAvg = parseInt(val);
                if (id === self.config.ids.dayWindMax) parsed.dayWindMax = parseFloat(val);
                if (id === self.config.ids.solarIrradiance) parsed.solarIrradiance = parseFloat(val);
                if (id === self.config.ids.uvIndex) parsed.uvIndex = parseInt(val);
                if (id === self.config.ids.vpd) parsed.vpd = parseFloat(val);
            });
        }
        
        // Parse piezoRain
        if (rawData.piezoRain) {
            rawData.piezoRain.forEach(item => {
                const id = item.id;
                const val = item.val;
                
                if (id === self.config.ids.rainEvent) parsed.rainEvent = parseFloat(val);
                if (id === self.config.ids.rainRate) parsed.rainRate = parseFloat(val);
                if (id === self.config.ids.rain24h) parsed.rain24h = parseFloat(val);
                if (id === self.config.ids.rainDay) parsed.rainDay = parseFloat(val);
                if (id === self.config.ids.rainWeek) parsed.rainWeek = parseFloat(val);
                if (id === self.config.ids.rainMonth) parsed.rainMonth = parseFloat(val);
                if (id === self.config.ids.rainYear) parsed.rainYear = parseFloat(val);
            });
        }
        
        // Parse wh25
        if (rawData.wh25) {
            rawData.wh25.forEach(item => {
                if (item.temp) parsed.indoorTemp = parseFloat(item.temp);
                if (item.unit) parsed.tempUnit = item.unit;
                if (item.inHumi) parsed.indoorHumidity = parseInt(item.inHumi);
                if (item.abs) parsed.absolutePressure = parseFloat(item.abs);
                if (item.rel) parsed.relativePressure = parseFloat(item.rel);
            });
        }
        
        return parsed;
    },

    getDom: function() {
        var wrapper = document.createElement("div");
        wrapper.className = "ecowitt-wrapper";

        if (!this.loaded) {
            wrapper.innerHTML = "Loading weather data...";
            wrapper.className = "dimmed light small";
            return wrapper;
        }

        if (!this.weatherData) {
            wrapper.innerHTML = "No data available";
            wrapper.className = "dimmed light small";
            return wrapper;
        }

        const mode = this.config.displayMode;

        if (mode === "all" || mode === "rain") {
            wrapper.appendChild(this.getRainModule());
        }

        if (mode === "all" || mode === "wind") {
            wrapper.appendChild(this.getWindModule());
        }

        if (mode === "all" || mode === "outdoor") {
            wrapper.appendChild(this.getOutdoorModule());
        }

        return wrapper;
    },

    getRainModule: function() {
        const data = this.weatherData;
        const container = document.createElement("div");
        container.className = "weather-module rain-module";

        const title = document.createElement("div");
        title.className = "module-title";
        title.innerHTML = "Regen Piezo";
        container.appendChild(title);

        const content = document.createElement("div");
        content.className = "rain-content";

        // Rain rate display
        const rateSection = document.createElement("div");
        rateSection.className = "rain-rate-section";
        
        const rateLabel = document.createElement("div");
        rateLabel.className = "rain-label";
        rateLabel.innerHTML = "Regenrate/h";
        rateSection.appendChild(rateLabel);

        const rateValue = document.createElement("div");
        rateValue.className = "rain-rate-value";
        rateValue.innerHTML = (data.rainRate || 0).toFixed(1);
        rateSection.appendChild(rateValue);

        const rateUnit = document.createElement("div");
        rateUnit.className = "rain-unit";
        rateUnit.innerHTML = "Tag";
        rateSection.appendChild(rateUnit);

        const dayValue = document.createElement("div");
        dayValue.className = "rain-rate-value";
        dayValue.innerHTML = (data.rainDay || 0).toFixed(1);
        rateSection.appendChild(dayValue);

        content.appendChild(rateSection);

        // Status and values
        const valuesSection = document.createElement("div");
        valuesSection.className = "rain-values-section";

        const statusHeader = document.createElement("div");
        statusHeader.className = "rain-header";
        statusHeader.innerHTML = "Zustand";
        valuesSection.appendChild(statusHeader);

        const noRainHeader = document.createElement("div");
        noRainHeader.className = "rain-header rain-status";
        noRainHeader.innerHTML = "Kein Regen";
        valuesSection.appendChild(noRainHeader);

        const periods = [
            { label: "Ereignis", value: data.rainEvent || 0 },
            { label: "Stunde", value: data.rainRate || 0 },
            { label: "24 Stunden", value: data.rain24h || 0 },
            { label: "Woche", value: data.rainWeek || 0 },
            { label: "Monat", value: data.rainMonth || 0 },
            { label: "Jahr", value: data.rainYear || 0 }
        ];

        periods.forEach(period => {
            const row = document.createElement("div");
            row.className = "rain-row";

            const label = document.createElement("div");
            label.className = "rain-period-label";
            label.innerHTML = period.label;
            row.appendChild(label);

            const value = document.createElement("div");
            value.className = "rain-period-value";
            value.innerHTML = period.value.toFixed(1) + " mm";
            row.appendChild(value);

            valuesSection.appendChild(row);
        });

        content.appendChild(valuesSection);
        container.appendChild(content);

        return container;
    },

    getWindModule: function() {
        const data = this.weatherData;
        const container = document.createElement("div");
        container.className = "weather-module wind-module";

        const title = document.createElement("div");
        title.className = "module-title";
        title.innerHTML = "Wind";
        container.appendChild(title);

        const content = document.createElement("div");
        content.className = "wind-content";

        // Wind speed section
        const speedSection = document.createElement("div");
        speedSection.className = "wind-speed-section";

        const speedLabel = document.createElement("div");
        speedLabel.className = "wind-label";
        speedLabel.innerHTML = "Windgeschwindigkeit";
        speedSection.appendChild(speedLabel);

        const speedValue = document.createElement("div");
        speedValue.className = "wind-speed-value";
        speedValue.innerHTML = (data.windSpeed || 0).toFixed(1);
        speedSection.appendChild(speedValue);

        const speedTime = document.createElement("div");
        speedTime.className = "wind-time";
        speedTime.innerHTML = "↑ " + (data.dayWindMax || 0).toFixed(1) + " km/h";
        speedSection.appendChild(speedTime);

        const timestamp = document.createElement("div");
        timestamp.className = "wind-timestamp";
        timestamp.innerHTML = new Date().toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit'});
        speedSection.appendChild(timestamp);

        content.appendChild(speedSection);

        // Compass
        const compassSection = document.createElement("div");
        compassSection.className = "wind-compass-section";

        const compass = this.createCompass(data.windDirection || 0, data.windDirectionAvg || 0);
        compassSection.appendChild(compass);

        content.appendChild(compassSection);

        // Gust section
        const gustSection = document.createElement("div");
        gustSection.className = "wind-gust-section";

        const gustLabel = document.createElement("div");
        gustLabel.className = "wind-label";
        gustLabel.innerHTML = "Wind-Böen";
        gustSection.appendChild(gustLabel);

        const gustValue = document.createElement("div");
        gustValue.className = "wind-gust-value";
        gustValue.innerHTML = (data.gustSpeed || 0).toFixed(1);
        gustSection.appendChild(gustValue);

        const gustTime = document.createElement("div");
        gustTime.className = "wind-time";
        gustTime.innerHTML = "↑ " + (data.dayWindMax || 0).toFixed(1) + " km/h";
        gustSection.appendChild(gustTime);

        const gustTimestamp = document.createElement("div");
        gustTimestamp.className = "wind-timestamp";
        gustTimestamp.innerHTML = new Date().toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit'});
        gustSection.appendChild(gustTimestamp);

        content.appendChild(gustSection);
        container.appendChild(content);

        return container;
    },

    createCompass: function(currentDirection, avgDirection) {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 200 200");
        svg.setAttribute("class", "wind-compass");

        // Outer circle
        const outerCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        outerCircle.setAttribute("cx", "100");
        outerCircle.setAttribute("cy", "100");
        outerCircle.setAttribute("r", "90");
        outerCircle.setAttribute("fill", "none");
        outerCircle.setAttribute("stroke", "#4dd8d8");
        outerCircle.setAttribute("stroke-width", "2");
        svg.appendChild(outerCircle);

        // Tick marks
        for (let i = 0; i < 360; i += 10) {
            const angle = (i - 90) * Math.PI / 180;
            const x1 = 100 + 85 * Math.cos(angle);
            const y1 = 100 + 85 * Math.sin(angle);
            const x2 = 100 + 90 * Math.cos(angle);
            const y2 = 100 + 90 * Math.sin(angle);

            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", x1);
            line.setAttribute("y1", y1);
            line.setAttribute("x2", x2);
            line.setAttribute("y2", y2);
            line.setAttribute("stroke", "#4dd8d8");
            line.setAttribute("stroke-width", "1");
            svg.appendChild(line);
        }

        // Current direction arrow (blue)
        const currentAngle = (currentDirection - 90) * Math.PI / 180;
        const currentArrow = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const cx = 100 + 70 * Math.cos(currentAngle);
        const cy = 100 + 70 * Math.sin(currentAngle);
        currentArrow.setAttribute("d", `M100,100 L${cx},${cy} L${100 + 60 * Math.cos(currentAngle - 0.2)},${100 + 60 * Math.sin(currentAngle - 0.2)} L${100 + 60 * Math.cos(currentAngle + 0.2)},${100 + 60 * Math.sin(currentAngle + 0.2)} Z`);
        currentArrow.setAttribute("fill", "#4dd8d8");
        svg.appendChild(currentArrow);

        // Average direction arrow (cyan)
        const avgAngle = (avgDirection - 90) * Math.PI / 180;
        const avgArrow = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const ax = 100 + 65 * Math.cos(avgAngle);
        const ay = 100 + 65 * Math.sin(avgAngle);
        avgArrow.setAttribute("d", `M100,100 L${ax},${ay} L${100 + 55 * Math.cos(avgAngle - 0.2)},${100 + 55 * Math.sin(avgAngle - 0.2)} L${100 + 55 * Math.cos(avgAngle + 0.2)},${100 + 55 * Math.sin(avgAngle + 0.2)} Z`);
        avgArrow.setAttribute("fill", "#00ced1");
        svg.appendChild(avgArrow);

        // Center text
        const dirText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        dirText.setAttribute("x", "100");
        dirText.setAttribute("y", "95");
        dirText.setAttribute("text-anchor", "middle");
        dirText.setAttribute("fill", "white");
        dirText.setAttribute("font-size", "32");
        dirText.textContent = currentDirection + "°";
        svg.appendChild(dirText);

        const statusText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        statusText.setAttribute("x", "100");
        statusText.setAttribute("y", "115");
        statusText.setAttribute("text-anchor", "middle");
        statusText.setAttribute("fill", "#8cd98c");
        statusText.setAttribute("font-size", "16");
        statusText.textContent = "0";
        svg.appendChild(statusText);

        return svg;
    },

    getOutdoorModule: function() {
        const data = this.weatherData;
        const container = document.createElement("div");
        container.className = "weather-module outdoor-module";

        const title = document.createElement("div");
        title.className = "module-title";
        title.innerHTML = "Außen";
        container.appendChild(title);

        const content = document.createElement("div");
        content.className = "outdoor-content";

        // Temperature section
        const tempSection = document.createElement("div");
        tempSection.className = "outdoor-section";

        const tempLabel = document.createElement("div");
        tempLabel.className = "outdoor-label";
        tempLabel.innerHTML = "Temperatur";
        tempSection.appendChild(tempLabel);

        const tempValue = document.createElement("div");
        tempValue.className = "outdoor-temp-value";
        tempValue.innerHTML = (data.outdoorTemp || 0).toFixed(1) + " °C";
        tempSection.appendChild(tempValue);

        const tempChange = document.createElement("div");
        tempChange.className = "outdoor-change";
        tempChange.innerHTML = "↝ 2.0 °C/hr";
        tempSection.appendChild(tempChange);

        const tempMaxMin = document.createElement("div");
        tempMaxMin.className = "outdoor-maxmin";
        tempMaxMin.innerHTML = `↑ 7.5 °C<span style="margin: 0 20px"></span>↓ -6.7 °C`;
        tempSection.appendChild(tempMaxMin);

        const tempTimes = document.createElement("div");
        tempTimes.className = "outdoor-times";
        tempTimes.innerHTML = "Heute 14:23<span style=\"margin: 0 10px\"></span>Heute 08:01";
        tempSection.appendChild(tempTimes);

        const vpdRow = document.createElement("div");
        vpdRow.className = "outdoor-vpd";
        vpdRow.innerHTML = `VPD <span class="info-icon">ⓘ</span><span style="flex: 1"></span>${(data.vpd || 0).toFixed(3)} kPa`;
        tempSection.appendChild(vpdRow);

        content.appendChild(tempSection);

        // Humidity section
        const humiSection = document.createElement("div");
        humiSection.className = "outdoor-section";

        const humiLabel = document.createElement("div");
        humiLabel.className = "outdoor-label";
        humiLabel.innerHTML = "Luftfeuchte";
        humiSection.appendChild(humiLabel);

        const humiValue = document.createElement("div");
        humiValue.className = "outdoor-humi-value";
        humiValue.innerHTML = (data.outdoorHumidity || 0) + " %";
        humiSection.appendChild(humiValue);

        const humiMaxMin = document.createElement("div");
        humiMaxMin.className = "outdoor-humi-maxmin";
        humiMaxMin.innerHTML = `<span style="color: #ffa500">↑ 99 %</span><span style="margin: 0 20px"></span><span style="color: #4dd8d8">↓ 54 %</span>`;
        humiSection.appendChild(humiMaxMin);

        const feelsLike = document.createElement("div");
        feelsLike.className = "outdoor-feels";
        feelsLike.innerHTML = `Gefühlt wie<span style="flex: 1"></span>${(data.feelsLike || 0).toFixed(1)} °C`;
        humiSection.appendChild(feelsLike);

        const dewPoint = document.createElement("div");
        dewPoint.className = "outdoor-dew";
        dewPoint.innerHTML = `Taupunkt<span style="flex: 1"></span>${(data.dewPoint || 0).toFixed(1)} °C`;
        humiSection.appendChild(dewPoint);

        content.appendChild(humiSection);
        container.appendChild(content);

        return container;
    }
});
