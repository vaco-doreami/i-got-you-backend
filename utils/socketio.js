const socketio = require("socket.io");

const { createRoom, joinRoom, getRoleCounts, getAllRoleCounts, getAllRooms } = require("./gameRooms");

module.exports = server => {
  const io = socketio(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", socket => {
    socket.on("enter-room-list", () => {
      const rooms = getAllRooms();

      socket.join("roomList");
      io.in("roomList").emit("send-rooms", rooms);
    });

    socket.on("create-room", ({ nickname, role, characterType, coordinateX, coordinateY }) => {
      const socketId = socket.id;

      const newPlayer = {
        id: socketId,
        nickname,
        role,
        characterType,
        coordinateX,
        coordinateY,
      };

      createRoom(newPlayer);
      socket.join(socketId);

      const rooms = getAllRooms();

      socket.broadcast.to("roomList").emit("send-rooms", rooms);
    });

    socket.on("standby-room", roomId => {
      const roomRoleCounts = getRoleCounts(roomId);

      socket.join(roomId);

      io.in(roomId).emit("receive-player", roomRoleCounts);
    });

    socket.on("join-room", (roomId, { nickname, role, characterType, coordinateX, coordinateY }) => {
      const socketId = socket.id;

      socket.leave("roomList");

      const newPlayer = {
        id: socketId,
        nickname,
        role,
        characterType,
        coordinateX,
        coordinateY,
      };

      joinRoom(roomId, newPlayer);
      socket.join(roomId);

      const roomRoleCounts = getRoleCounts(roomId);
      const rooms = getAllRooms();

      io.in(roomId).emit("receive-player", roomRoleCounts);
      io.in("roomList").emit("send-rooms", rooms);
    });
  });
};
