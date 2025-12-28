WeatherProvider.register("ecowittlocal", {
  providerName: "ecowittlocal",

  fetchCurrentWeather() {
    // Wir nutzen hier eine andere Methode, um CORS zu umgehen: 
    // Wir lassen den Server die Anfrage stellen!
    const url = "http://192.168.178.98/get_livedata_info";
    
    // MagicMirror hat einen internen Proxy für genau diesen Fall
    // Wir nutzen die absolute URL über den Server
    fetch("../weather/proxy?url=" + encodeURIComponent(url))
      .then(response => response.json())
      .then((data) => {
        if (!data || !data.common_list) return;

        const getVal = (list, id) => {
          const item = list.find((i) => i.id === id);
          return item ? parseFloat(item.val) : null;
        };

        const currentWeather = new WeatherObject(this.config.units);
        currentWeather.date = moment();
        currentWeather.temperature = getVal(data.common_list, "0x02");
        currentWeather.humidity = getVal(data.common_list, "0x07");
        currentWeather.windSpeed = getVal(data.common_list, "0x0B");
        currentWeather.windDirection = getVal(data.common_list, "0x0A");
        currentWeather.feelsLike = getVal(data.common_list, "0x03");
        
        if (data.wh25 && data.wh25[0]) {
          currentWeather.pressure = parseFloat(data.wh25[0].rel);
        }
        if (data.piezoRain) {
          currentWeather.rain = getVal(data.piezoRain, "0x0E");
        }

        this.setCurrentWeather(currentWeather);
      })
      .catch((err) => {
        console.error("Ecowitt Proxy Fehler:", err);
      });
  },
});
