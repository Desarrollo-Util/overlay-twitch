const { Server } = require("socket.io");

const initializeSocket = (httpServer) => {
  const socketServer = new Server(httpServer);

  socketServer.on("connection", (socket) => {
    console.log(`A user with socket id ${socket.id} has connected`);
  });

  return socketServer;
};

module.exports = initializeSocket;
