const rooms = {};

exports.createRoom = (socketId, player) => {
  rooms[socketId] = {
    [socketId]: { ...player },
  };
};

exports.joinRoom = (roomId, socketId, player) => {
  rooms[roomId] = {
    ...rooms[roomId],
    [socketId]: { ...player },
  };
};

exports.getRoomPlayers = roomId => {
  const gameRoom = rooms[roomId];
  const players = [];

  for (const player in gameRoom) {
    players.push(player);
  }

  return players;
};

exports.getAllRooms = () => {
  return rooms;
};
