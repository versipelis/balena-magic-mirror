var config = {
  address: "192.168.178.177",
  port: 8080,
  basePath: "/",
  ipWhitelist: [], 
  language: "de",
  locale: "de-DE",
  useSeconds: false,

  modules: [
    {
      module: "alert",
    },
    {
      module: "clock",
      position: "top_left"
    },
    {
      module: "weather",
      position: "top_right",
      config: {
        weatherProvider: "openweathermap",
        type: "current",
        location: "Berlin",
        locationID: "2950159", // Beispiel ID
        apiKey: "YOUR_FREE_OPENWEATHER_API_KEY" // Kann erst mal leer bleiben
      }
    }
  ]
};

if (typeof module !== "undefined") { module.exports = config; }
