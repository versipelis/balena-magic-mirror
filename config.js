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
        // Laut Forum: Versuche 'pws' oder lass es komplett weg, 
        // damit der lokale Server Vorrang bekommt.
        externalSource: "pws", 
        pwsIdentifier: "Noxious", // Muss mit deiner Stations-ID übereinstimmen
        
        // WICHTIG: Wenn du AWEKAS nutzen willst, muss das hier wieder rein,
        // aber erst wenn die lokale Anzeige läuft!
        forwardEnable: false, 
        debug: true
      }
    }
  ]
};

if (typeof module !== "undefined") { module.exports = config; }







