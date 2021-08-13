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

const initializeTmi = () => {
  const client = new tmi.client(TMIOPTIONS);

  client.connect();
};

module.exports = initializeTmi;
