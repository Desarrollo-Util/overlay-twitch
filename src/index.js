require("dotenv").config();
const initializeHttp = require("./tools/http-server");
const initializeSocket = require("./tools/websocket-server");
const initializeTmi = require("./tools/tmi-irc");
const startWebSockets = require("./lib/twitch-socket-events");

//#region Initialization

const httpServer = initializeHttp();
const socketServer = initializeSocket(httpServer);
const tmiClient = initializeTmi();
const { twitchApiClient, twitchEventListener } = initializeTwitchAPI();

//#endregion

startWebSockets(twitchApiClient, twitchEventListener, socketServer);
