var config = {
  address: "192.168.178.177", // Erlaubt Zugriff von anderen Geräten im WLAN
  port: 8080,
  basePath: "/",
  ipWhitelist: [], // Erlaubt jedem Gerät im Netzwerk den Zugriff

  language: "de",
  locale: "de-DE",
  logLevel: ["INFO", "LOG", "WARN", "ERROR"],
  timeFormat: 24,
  units: "metric",

  modules: [
    {
      module: "alert", // Wichtig für Systemmeldungen
    },
    {
      module: "clock",
      position: "top_left", // Große Uhrzeit oben links
      config: {
        displayType: "both",
        showDate: true,
        showWeek: false,
      }
    },
    {
      module: "MMM-Ecowitt",
      position: "top_right", // Deine Wetterdaten oben rechts
      config: {
        port: 3000,          // Der Port, den wir im Dockerfile geöffnet haben
        path: "/ecowitt",    // Diesen Pfad musst du in der Ecowitt App angeben
        units: "metric",
        showIndoor: true,    // Zeigt deine Innensensoren
        showOutdoor: true,   // Zeigt deine Außensensoren
        showLastUpdate: true
      }
    },
    {
      module: "newsfeed",
      position: "bottom_bar", // Ein kleiner Ticker für Nachrichten
      config: {
        feeds: [
          {
            title: "Tagesschau",
            url: "https://www.tagesschau.de/infoservice/rss/tagesschau-gesamt/index.xml"
          }
        ],
        showSourceTitle: true,
        showPublishDate: true,
        broadcastNewsFeeds: true,
        broadcastNewsUpdates: true
      }
    }
  ]
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") { module.exports = config; }