const rooms = {};
const players = {};

exports.createRoom = newPlayer => {
  const hostId = newPlayer.id;

  players[hostId] = newPlayer;

  rooms[hostId] = {
    hostId,
    policeId: [],
    robberId: [],
    isProgressGame: false,
  };

  newPlayer.role === "police" ? rooms[hostId].policeId.push(hostId) : rooms[hostId].robberId.push(hostId);
};

exports.joinRoom = (roomId, newPlayer) => {
  const currentRoom = rooms[roomId];

  const isPlayerInRoom = currentRoom[newPlayer.role + "Id"].find(id => id === newPlayer.id);

  if (!isPlayerInRoom) {
    const playerId = newPlayer.id;

    players[playerId] = newPlayer;

    newPlayer.role === "police" ? rooms[roomId].policeId.push(playerId) : rooms[roomId].robberId.push(playerId);

    return true;
  }

  return false;
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

exports.getPlayersInformation = roomId => {
  const allPlayerId = [...rooms[roomId].policeId, ...rooms[roomId].robberId];

  const robbersId = rooms[roomId].robberId;
  const policesId = rooms[roomId].policeId;

  const playerInformation = allPlayerId.map(id => players[id]);

  const playersInfoCombined = {
    playerInformation,
    policesId,
    robbersId,
  };

  return playersInfoCombined;
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

exports.arrestRobber = (roomId, playerId) => {
  let currentJoiningRoomRobbers = rooms[roomId].robberId;

  if (currentJoiningRoomRobbers.indexOf(playerId) !== -1) {
    currentJoiningRoomRobbers = currentJoiningRoomRobbers.filter(id => id !== playerId);
  }

  return currentJoiningRoomRobbers.length;
};

exports.getRoomById = roomId => {
  return rooms[roomId];
};

exports.getAllRooms = () => {
  return rooms;
};

exports.setStartPosition = (roomId, role) => {
  const position = {
    coordinateX: null,
    coordinateY: null,
  };

  if (role === "police") {
    if (rooms[roomId] && rooms[roomId].policeId.length !== 0) {
      position.coordinateX = 1800;
      position.coordinateY = 600;

      return position;
    }

    position.coordinateX = 100;
    position.coordinateY = 600;
  } else {
    position.coordinateX = 960;
    position.coordinateY = 950;
  }

  return position;
};
