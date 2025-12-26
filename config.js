var config = {
  address: "0.0.0.0",
  port: 8080,
  ipWhitelist: [], 
  language: "de",
  locale: "de-DE",

  modules: [
    {
      module: "clock",
      position: "top_left"
    },
    {
      module: "weather",
      position: "top_right",
      header: "Wettervorhersage Murrhardt",
      config: {
        weatherProvider: "openweathermap",
        type: "forecast",
        location: "Murrhardt",
        locationID: "2867431", // Die korrigierte ID für Murrhardt
        apiKey: "9e5482296f1028baf01197b6e80a5b6d", // <--- DEIN KEY HIER
        apiVersion: "2.5",
        units: "metric"
      }
    },
    {
      module: "MMM-FOSHKplugin-PWS-Observations",
      position: "bottom_left",
      header: "Ecowitt Station Fornsbach",
      config: {
        serverPort: 3000,
        units: "metric",
        pwsType: "Wunderground", 
        externalSource: null, // Verhindert den Versuch, Cloud-Daten zu laden
        forwardEnable: false  // Wir schalten die Weiterleitung zum Testen AUS
      }
    }
  ]
};

if (typeof module !== "undefined") { module.exports = config; }





