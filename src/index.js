require("dotenv").config();
const initializeHttp = require("./lib/http-server");
const initializeSocket = require("./lib/websocket-server");
const startTmi = require("./lib/twitch-tmi-irc");
const startEventSub = require("./lib/twitch-event-sub");

//#region Initialization

const httpServer = initializeHttp();
const socketServer = initializeSocket(httpServer);

//#endregion

startTmi(socketServer);
startEventSub(socketServer);
