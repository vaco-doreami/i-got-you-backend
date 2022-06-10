const socketio = require("socket.io");

const { createRoom, joinRoom, getRoleCounts, getPlayersInfo, getAllRooms } = require("./gameRooms");

module.exports = server => {
  const io = socketio(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", socket => {
    socket.on("find-current-room", roomId => {
      const rooms = getAllRooms();
      const currentRoom = rooms[roomId];

      socket.emit("return-current-room", currentRoom);
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
      io.in("roomListPage").emit("send-rooms", rooms);
    });

    socket.on("create-room", ({ nickname, role, isHost, characterType, coordinateX, coordinateY }) => {
      const socketId = socket.id;

      const newPlayer = {
        id: socketId,
        nickname,
        role,
        isHost,
        characterType,
        coordinateX,
        coordinateY,
      };

      createRoom(newPlayer);
      socket.join(socketId);

      const rooms = getAllRooms();

      io.to(socket.id).emit("send-socket-id", socketId);
      socket.broadcast.to("roomListPage").emit("send-rooms", rooms);
    });

    socket.on("standby-room", roomId => {
      const roomRoleCounts = getRoleCounts(roomId);

      socket.join(roomId);

      io.in(roomId).emit("receive-player", roomRoleCounts);
    });

    socket.on("join-room", (roomId, { nickname, role, isHost, characterType, coordinateX, coordinateY }) => {
      const socketId = socket.id;

      socket.leave("roomListPage");

      const newPlayer = {
        id: socketId,
        nickname,
        role,
        isHost,
        characterType,
        coordinateX,
        coordinateY,
      };

      joinRoom(roomId, newPlayer);
      socket.join(roomId);

      const roomRoleCounts = getRoleCounts(roomId);
      const rooms = getAllRooms();

      io.in(roomId).emit("receive-player", roomRoleCounts);
      socket.broadcast.to("roomListPage").emit("send-rooms", rooms);
    });

    socket.on("press-run-button", roomId => {
      io.in(roomId).emit("change-all-player-scene");
    });

    socket.on("game-enter", roomId => {
      const playersInfo = getPlayersInfo(roomId);

      socket.emit("send-room-players-info", playersInfo);
    });
  });
};
