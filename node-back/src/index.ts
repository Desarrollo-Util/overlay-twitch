import startWebSockets from "@Lib/twitch-socket-events";
import initializeHttp from "@Tools/http-server";
import initializeTmi from "@Tools/tmi-irc";
import initializeTwitchAPI from "@Tools/twitch-api";
import initializeSocket from "@Tools/websocket-server";
import dotenv from "dotenv";
dotenv.config();

const startServer = async () => {
  //#region Initialization

  const httpServer = initializeHttp();
  const socketServer = initializeSocket(httpServer);
  await initializeTmi();
  const { twitchApiClient, twitchEventListener } = await initializeTwitchAPI();

  //#endregion

  await startWebSockets(twitchApiClient, twitchEventListener, socketServer);

  console.log("Server is ready");
};

startServer();
