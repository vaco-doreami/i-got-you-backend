const rooms = {};
const players = {};

exports.createRoom = newPlayer => {
  const hostPlayerId = newPlayer.id;

  players[hostPlayerId] = newPlayer;

  rooms[hostPlayerId] = {
    policeId: [],
    robberId: [],
    hostId: hostPlayerId,
    isProgressGame: false,
  };

  newPlayer.role === "police" ? rooms[hostPlayerId].policeId.push(hostPlayerId) : rooms[hostPlayerId].robberId.push(hostPlayerId);
};

exports.joinRoom = (roomId, newPlayer) => {
  const isRoomInPlayer = rooms[roomId][newPlayer.role + "Id"].find(id => id === newPlayer.id);

  if (!isRoomInPlayer) {
    const playerId = newPlayer.id;

    players[playerId] = newPlayer;

    newPlayer.role === "police" ? rooms[roomId].policeId.push(playerId) : rooms[roomId].robberId.push(playerId);

    return true;
  } else {
    return false;
  }
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

exports.leaveRoom = payload => {
  if (payload.isHost) {
    delete rooms[payload.roomId];

    return;
  }

  if (rooms[payload.roomId]) {
    const leaveRoomPlayerIdIndex = rooms[payload.roomId][payload.role + "Id"].findIndex(target => target === payload.id);

    rooms[payload.roomId][payload.role + "Id"].splice(leaveRoomPlayerIdIndex, 1);

    return;
  }
};

exports.getAllRooms = () => {
  return rooms;
};
