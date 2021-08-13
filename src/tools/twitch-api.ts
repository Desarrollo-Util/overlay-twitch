import { ApiClient } from "twitch";
import { ClientCredentialsAuthProvider } from "twitch-auth";
import { EventSubListener } from "twitch-eventsub";
import { NgrokAdapter } from "twitch-eventsub-ngrok";

const initializeTwitchAPI = async () => {
  const authProvider = new ClientCredentialsAuthProvider(
    process.env["CLIENT_ID"] as string,
    process.env["CLIENT_SECRET"] as string
  );

  const twitchApiClient = new ApiClient({ authProvider });
  const twitchEventListener = new EventSubListener(
    twitchApiClient,
    new NgrokAdapter(),
    process.env["WEBHOOK_SECRET"] as string
  );

  await twitchApiClient.helix.eventSub.deleteAllSubscriptions();

  await twitchEventListener.listen();

  process.on("SIGINT", async () => {
    await twitchEventListener.unlisten();
    process.exit(0);
  });

  return { twitchApiClient, twitchEventListener };
};

export default initializeTwitchAPI;
