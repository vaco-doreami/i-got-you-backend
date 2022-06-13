const socketio = require("socket.io");

const { createRoom, joinRoom, getRoleCounts, getPlayersInfo, updatePlayerPosition, getAllRooms, leaveRoom, arrestRobber } = require("./gameRooms");

module.exports = server => {
  const io = socketio(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", socket => {
    socket.on("find-current-joining-room", roomId => {
      const rooms = getAllRooms();

      const currentRoom = rooms[roomId];

      socket.emit("send-current-joining-room", currentRoom);
    });

    socket.on("sending-signal-to-connect-webRTC", payload => {
      io.to(payload.userToSignal).emit("new-video-chat-participant", { signal: payload.signal, callerID: payload.callerID });
    });

    socket.on("returning-signal-to-connect-webRTC", payload => {
      io.to(payload.callerID).emit("receiving-returned-signal-to-connect-webRTC", { signal: payload.signal, id: socket.id });
    });

    socket.on("enter-room-list", () => {
      const rooms = getAllRooms();

      socket.join("roomListPage");

      io.to(socket.id).emit("send-socket-id", socket.id);
      io.to("roomListPage").emit("send-rooms", rooms);
    });

    socket.on("create-room", ({ role, isHost, nickname, characterType }) => {
      const newPlayer = {
        id: socket.id,
        role,
        isHost,
        nickname,
        characterType,
        currentDirection: "stop",
        coordinateX: Math.floor(Math.random() * 600) + 200,
        coordinateY: Math.floor(Math.random() * 300) + 500,
      };

      createRoom(newPlayer);
      socket.join(socket.id);

      const rooms = getAllRooms();

      io.to(socket.id).emit("send-socket-id", socket.id);
      socket.broadcast.to("roomListPage").emit("send-rooms", rooms);
    });

    socket.on("standby-room", roomId => {
      const roomRoleCounts = getRoleCounts(roomId);

      socket.join(roomId);

      io.to(roomId).emit("receive-player", roomRoleCounts);
    });

    socket.on("join-room", (roomId, { nickname, role, isHost, characterType }) => {
      const socketId = socket.id;

      socket.leave("roomListPage");

      const newPlayer = {
        id: socketId,
        nickname,
        role,
        isHost,
        characterType,
        currentDirection: "stop",
        coordinateX: Math.floor(Math.random() * 600) + 200,
        coordinateY: Math.floor(Math.random() * 300) + 500,
      };

      joinRoom(roomId, newPlayer);
      socket.join(roomId);

      const roomRoleCounts = getRoleCounts(roomId);

      const rooms = getAllRooms();

      io.to(roomId).emit("receive-player", roomRoleCounts);
      socket.broadcast.to("roomListPage").emit("send-rooms", rooms);
    });

    socket.on("leave-room", payload => {
      leaveRoom(payload);

      const rooms = getAllRooms();

      if (rooms[payload.roomId]) {
        socket.leave(payload.roomId);

        const roomRoleCounts = getRoleCounts(payload.roomId);

        io.in(payload.roomId).emit("receive-player", roomRoleCounts);
        io.in(payload.id).emit("leave-room-player-redirect-room-list");
      } else {
        io.in(payload.roomId).emit("leave-room-player-redirect-room-list");
      }
    });

    socket.on("press-run-button", roomId => {
      const rooms = getAllRooms();

      rooms[roomId].isProgressGame = true;

      io.in("roomListPage").emit("send-rooms", rooms);
      io.to(roomId).emit("change-all-player-scene");
    });

    socket.on("game-enter", roomId => {
      const playerInfoCombined = getPlayersInfo(roomId);

      const { playerInfo, robbersId } = playerInfoCombined;

      io.to(roomId).emit("send-room-players-info", playerInfo, robbersId);
    });

    socket.on("player-move", ({ roomId, playerId, currentDirection, coordinateX, coordinateY }) => {
      const player = updatePlayerPosition(playerId, currentDirection, coordinateX, coordinateY);

      io.to(roomId).emit("send-move-player", player);
    });

    socket.on("player-stop", ({ roomId, playerId, currentDirection, coordinateX, coordinateY }) => {
      const player = updatePlayerPosition(playerId, currentDirection, coordinateX, coordinateY);

      io.to(roomId).emit("send-stop-player", player);
    });

    socket.on("police-opacity-change", ({ roomId, playerId }) => {
      io.to(roomId).emit("send-collided-player", playerId);
    });

    socket.on("arrest-robber", ({ roomId, playerId }) => {
      const remainingRobberNumber = arrestRobber(roomId, playerId);

      io.to(roomId).emit("send-arrested-player", playerId, remainingRobberNumber);
    });
  });
};
