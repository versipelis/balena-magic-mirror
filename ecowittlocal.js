WeatherProvider.register("ecowittlocal", {
  providerName: "ecowittlocal",

  fetchCurrentWeather() {
    this.fetchData("http://192.168.178.98/get_livedata_info")
      .then((data) => {
        if (!data || !data.common_list) return;

        // Hilfsfunktion um Werte anhand der ID zu finden
        const getVal = (list, id) => {
          const item = list.find((i) => i.id === id);
          return item ? parseFloat(item.val) : null;
        };

        const currentWeather = new WeatherObject(this.config.units);

        // Mapping der Ecowitt-IDs auf MagicMirror Felder
        currentWeather.date = moment();
        currentWeather.temperature = getVal(data.common_list, "0x02"); // Outdoor Temp
        currentWeather.humidity = getVal(data.common_list, "0x07");    // Outdoor Hum
        currentWeather.windSpeed = getVal(data.common_list, "0x0B");   // Wind Speed
        currentWeather.windDirection = getVal(data.common_list, "0x0A"); // Direction
        currentWeather.feelsLike = getVal(data.common_list, "0x03");   // Feels Like (Dew Point genutzt)
        
        // Druck aus wh25 Sektion (Relative Pressure)
        if (data.wh25 && data.wh25[0]) {
          currentWeather.pressure = parseFloat(data.wh25[0].rel);
        }

        // Regenrate aus piezoRain Sektion (Rain Rate 0x0E)
        if (data.piezoRain) {
          currentWeather.rain = getVal(data.piezoRain, "0x0E");
        }

        this.setCurrentWeather(currentWeather);
      })
      .catch((err) => {
        console.error("Fehler beim Abrufen der Ecowitt-Daten:", err);
      });
  },
});
