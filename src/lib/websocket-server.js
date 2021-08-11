const { Server } = require("socket.io");

const initializeSocket = (httpServer) => {
  const socketServer = new Server(httpServer);

  socketServer.on("connection", (socket) => {
    console.log("A user has connected to socket");
  });

  return socketServer;
};

module.exports = initializeSocket;
