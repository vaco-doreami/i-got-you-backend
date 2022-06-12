const rooms = {};
const players = {};

exports.createRoom = newPlayer => {
  const hostPlayerId = newPlayer.id;

  players[hostPlayerId] = newPlayer;

  rooms[hostPlayerId] = {
    policeId: [],
    robberId: [],
    hostId: hostPlayerId,
  };

  newPlayer.role === "police" ? rooms[hostPlayerId].policeId.push(hostPlayerId) : rooms[hostPlayerId].robberId.push(hostPlayerId);
};

exports.joinRoom = (roomId, newPlayer) => {
  const playerId = newPlayer.id;

  players[playerId] = newPlayer;

  newPlayer.role === "police" ? rooms[roomId].policeId.push(playerId) : rooms[roomId].robberId.push(playerId);
};

exports.getRoleCounts = roomId => {
  const policeCount = rooms[roomId].policeId.length;
  const robberCount = rooms[roomId].robberId.length;

  const roomRoleCounts = {
    police: policeCount,
    robber: robberCount,
  };

  return roomRoleCounts;
};

exports.getCurrentRoomInfo = roomId => {
  return rooms[roomId];
};

exports.getPlayersInfo = roomId => {
  const playersId = [...rooms[roomId].policeId, ...rooms[roomId].robberId];

  const playersInfo = playersId.map(playerId => players[playerId]);

  return playersInfo;
};

exports.updatePlayerPosition = (playerId, currentDirection, coordinateX, coordinateY) => {
  players[playerId] = {
    ...players[playerId],
    currentDirection,
    coordinateX,
    coordinateY,
  };

  return players[playerId];
};

exports.getAllRooms = () => {
  return rooms;
};
