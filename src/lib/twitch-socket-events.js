const startWebSockets = async (
  twitchApiClient,
  twitchEventListener,
  socketServer
) => {
  const user = await twitchApiClient.helix.users.getUserByName(
    process.env.USERNAME
  );

  twitchEventListener.subscribeToChannelFollowEvents(user.id, (event) => {
    socketServer.emit("follow", event._data.user_name);
  });
};

module.exports = startWebSockets;
