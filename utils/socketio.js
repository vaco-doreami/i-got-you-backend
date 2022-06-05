const socketio = require("socket.io");

const {
  createRoom,
  joinRoom,
  getRoomPlayers,
  getAllRooms,
} = require("./gameRooms");

module.exports = server => {
  const io = socketio(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", socket => {
    socket.on("enter-roomList", () => {
      const rooms = getAllRooms();

      socket.join("roomList");
      socket.broadcast.to("roomList").emit("send-rooms", rooms);
    });

    socket.on(
      "create-room",
      ({ nickname, job, characterType, coordinateX, coordinateY }) => {
        const socketId = socket.id;

        const player = {
          isHost: true,
          nickname,
          job,
          characterType,
          coordinateX,
          coordinateY,
        };

        createRoom(socketId, player);
        socket.join(socketId);

        const rooms = getAllRooms();

        socket.broadcast.to("roomList").emit("send-rooms", rooms);
      }
    );

    socket.on(
      "join-room",
      ({ roomId, nickname, job, characterType, coordinateX, coordinateY }) => {
        const socketId = socket.id;

        socket.leave("roomList");

        const player = {
          isHost: false,
          nickname,
          job,
          characterType,
          coordinateX,
          coordinateY,
        };

        joinRoom(roomId, socketId, player);
        socket.join(roomId);

        const players = getRoomPlayers(roomId);

        socket.broadcast.to(roomId).emit("receive-player", players);
      }
    );
  });
};
