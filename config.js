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
      module: "MMM-Ecowitt",
      position: "top_right",
      config: {
        port: 3000,
        path: "/ecowitt"
      }
    }
  ]
};
if (typeof module !== "undefined") { module.exports = config; }
