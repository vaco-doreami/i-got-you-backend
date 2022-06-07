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
      socket.broadcast.to("roomList").emit("send-rooms", rooms);
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
      const roomRoleCounts = getRoleCounts(socketId);

      socket.broadcast.to("roomList").emit("send-rooms", rooms);
      io.in(socketId).emit("receive-player", roomRoleCounts);
    });

    socket.on("join-room", ({ roomId, nickname, role, characterType, coordinateX, coordinateY }) => {
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
      const allRoleCounts = getAllRoleCounts();

      socket.broadcast.to(roomId).emit("receive-player", roomRoleCounts);
      socket.broadcast.to("roomList").emit("receive-player", allRoleCounts);
    });
  });
};
