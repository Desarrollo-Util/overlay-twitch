const { ApiClient } = require("twitch");
const { ClientCredentialsAuthProvider } = require("twitch-auth");
const { EventSubListener } = require("twitch-eventsub");
const { NgrokAdapter } = require("twitch-eventsub-ngrok");

const initializeTwitchAPI = async () => {
  const authProvider = new ClientCredentialsAuthProvider(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET
  );

  const apiClient = new ApiClient({ authProvider });
  const listener = new EventSubListener(
    apiClient,
    new NgrokAdapter(),
    process.env.WEBHOOK_SECRET
  );

  await twitchApiClient.helix.eventSub.deleteAllSubscriptions();

  await listener.listen();

  process.on("SIGINT", async () => {
    await listener.unlisten();
    process.exit(0);
  });

  return { apiClient, listener };
};

module.exports = initializeTwitchAPI;
