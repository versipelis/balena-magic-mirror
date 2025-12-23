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
      header: "Wettervorhersage Fornsbach",
      config: {
        weatherProvider: "openweathermap",
        type: "forecast", 
        location: "Murrhardt,DE", 
        locationID: "2867431", // ID für Murrhardt (inkl. Fornsbach)
        apiKey: "9e5482296f1028baf01197b6e80a5b6d"
      }
    }
  ]
};
if (typeof module !== "undefined") { module.exports = config; }

