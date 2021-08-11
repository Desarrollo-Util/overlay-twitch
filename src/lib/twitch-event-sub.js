const { ApiClient } = require("twitch");
const { ClientCredentialsAuthProvider } = require("twitch-auth");
const { EventSubListener } = require("twitch-eventsub");
const { NgrokAdapter } = require("twitch-eventsub-ngrok");

const startEventSub = async (socketServer) => {
  const authProvider = new ClientCredentialsAuthProvider(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET
  );
  const apiClient = new ApiClient({ authProvider });
  const listener = new EventSubListener(
    apiClient,
    new NgrokAdapter(),
    "thisShouldBeARandomlyGeneratedFixedString"
  );

  await listener.listen();

  const user = await apiClient.helix.users.getUserByName("desarrolloutil");

  await apiClient.helix.eventSub.deleteAllSubscriptions();

  listener.subscribeToChannelFollowEvents(user.id, (event) => {
    socketServer.emit("follow", event._data.user_name);
  });

  process.on("SIGINT", async () => {
    await listener.unlisten();
    process.exit(0);
  });
};

module.exports = startEventSub;
