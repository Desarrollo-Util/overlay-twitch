import { Server as SocketServer } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { EventSubListener } from "twitch-eventsub/lib";
import { ApiClient } from "twitch/lib";

const startWebSockets = async (
  twitchApiClient: ApiClient,
  twitchEventListener: EventSubListener,
  socketServer: SocketServer<
    DefaultEventsMap,
    DefaultEventsMap,
    DefaultEventsMap
  >
) => {
  const user = await twitchApiClient.helix.users.getUserByName(
    process.env["USERNAME"] as string
  );

  if (!user) throw new Error(`${process.env["USERNAME"]} user not found`);

  twitchEventListener.subscribeToChannelFollowEvents(user.id, (event) => {
    socketServer.emit("follow", event.userName);
  });
};

export default startWebSockets;
