const express = require("express");
const http = require("http");
const { join } = require("path");

const initializeHttp = () => {
  process.stdout.write("\033c");
  const app = express();
  const httpServer = http.createServer(app);

  app.get("/", (_, res) => {
    res.sendFile(join(__dirname, "../../public/index.html"));
  });

  app.use(express.static(join(__dirname, "../../public")));

  httpServer.listen(process.env.PORT, () => {
    console.log(`Listening on *:${process.env.PORT}`);
  });

  return httpServer;
};

module.exports = initializeHttp;
