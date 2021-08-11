const tmi = require("tmi.js");

const TMIOPTIONS = {
  options: {
    debug: true,
  },
  connection: {
    reconnect: true,
  },
  identity: {
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
  },
  channels: [process.env.USERNAME],
};

const startTmi = (socketServer) => {
  const client = new tmi.client(TMIOPTIONS);

  client.connect();
};

module.exports = startTmi;
