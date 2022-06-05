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

  newPlayer.job === "police" ? rooms[hostPlayerId].policeId.push(hostPlayerId) : rooms[hostPlayerId].robberId.push(hostPlayerId);
};

exports.joinRoom = (roomId, newPlayer) => {
  const playerId = newPlayer.id;

  players[playerId] = newPlayer;

  rooms[roomId].playersId.push(playerId);

  newPlayer.job === "police" ? rooms[roomId].policeId.push(playerId) : rooms[roomId].robberId.push(playerId);
};

exports.getJobCounts = roomId => {
  const policeCount = rooms[roomId].policeId.length;
  const robberCount = rooms[roomId].robberId.length;

  const roomJobCounts = {
    police: policeCount,
    robber: robberCount,
  };

  return roomJobCounts;
};

exports.getAllJobCounts = () => {
  const allJobCounts = {};

  for (const room in rooms) {
    allJobCounts[room].policeCount = rooms[room].policeId.length;
    allJobCounts[room].robberCount = rooms[room].robberId.length;
  }

  return allJobCounts;
};

exports.getAllRooms = () => {
  return rooms;
};
