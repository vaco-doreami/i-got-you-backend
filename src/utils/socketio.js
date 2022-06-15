const socketio = require("socket.io");
const {
  ASSIGN_ROOM_CREATOR_AS_HOST,
  ENTER_ROOM_LIST,
  ENTER_GAME,
  JOIN_ROOM,
  STANDBY,
  PRESS_RUN_BUTTON,
  PLAYER_MOVE,
  PLAYER_STOP,
  ARREST_ROBBER,
  RECEIVE_PLAYER,
  CHANGE_ALL_PLAYER_SCENE,
  POLICE_OPACITY_CHANGED,
  FIND_CURRENT_JOINING_ROOM,
  LEAVE_ROOM_PLAYER_REDIRECT_ROOM_LIST,
  LEAVE_ROOM,
  LEAVE_GAME,
  SEND_ROOMS,
  SEND_SOCKET_ID,
  SEND_LEFT_PLAYER,
  SEND_CURRENT_JOINING_ROOM,
  SEND_ARRESTED_PLAYER,
  SEND_ROOM_PLAYERS_INFORMATION,
  SEND_COLLIDED_PLAYER,
  SEND_MOVE_PLAYER,
  SEND_STOP_PLAYER,
  SET_VIDEO,
  OPEN_VIDEO,
  CLOSE_VIDEO,
  RETURNING_SIGNAL_TO_CONNECT_WEBRTC,
  SENDING_SIGNAL_TO_CONNECT_WEBRTC,
  RECEIVING_RETURNED_SIGNAL_TO_CONNECT_WEBRTC,
} = require("../constants/socket");

const { createRoom, joinRoom, getRoleCounts, getPlayersInformation, updatePlayerPosition, getAllRooms, leaveRoom, arrestRobber, getRoomById, setStartPosition } = require("./gameRooms");

module.exports = server => {
  const io = socketio(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", socket => {
    socket.on(FIND_CURRENT_JOINING_ROOM, roomId => {
      const currentRoom = getRoomById(roomId);

      socket.emit(SEND_CURRENT_JOINING_ROOM, currentRoom);
    });

    socket.on(SENDING_SIGNAL_TO_CONNECT_WEBRTC, payload => {
      const { signal, callerID } = payload;

      io.to(payload.userToSignal).emit("new-video-chat-participant", { signal, callerID });
    });

    socket.on(RETURNING_SIGNAL_TO_CONNECT_WEBRTC, payload => {
      const { signal, callerID } = payload;

      io.to(callerID).emit(RECEIVING_RETURNED_SIGNAL_TO_CONNECT_WEBRTC, { signal, id: socket.id });
    });

    socket.on(ENTER_ROOM_LIST, () => {
      const rooms = getAllRooms();

      socket.join("roomListPage");

      io.to(socket.id).emit(SEND_SOCKET_ID, socket.id);
      io.to("roomListPage").emit(SEND_ROOMS, rooms);
    });

    socket.on(ASSIGN_ROOM_CREATOR_AS_HOST, ({ role, isHost, nickname, characterType }) => {
      const { coordinateX, coordinateY } = setStartPosition(socket.id, role);

      const newPlayer = {
        id: socket.id,
        role,
        isHost,
        nickname,
        characterType,
        coordinateX: coordinateX,
        coordinateY: coordinateY,
        currentDirection: "stop",
      };

      createRoom(newPlayer);
      socket.join(socket.id);

      const rooms = getAllRooms();

      io.to(socket.id).emit(SEND_SOCKET_ID, socket.id);
      socket.broadcast.to("roomListPage").emit(SEND_ROOMS, rooms);
    });

    socket.on(STANDBY, roomId => {
      const roomRoleCounts = getRoleCounts(roomId);

      socket.join(roomId);

      io.to(roomId).emit(RECEIVE_PLAYER, roomRoleCounts);
    });

    socket.on(JOIN_ROOM, (roomId, { nickname, role, isHost, characterType }) => {
      socket.leave("roomListPage");

      const { coordinateX, coordinateY } = setStartPosition(roomId, role);

      const newPlayer = {
        id: socket.id,
        role,
        isHost,
        nickname,
        characterType,
        coordinateX: coordinateX,
        coordinateY: coordinateY,
        currentDirection: "stop",
      };

      joinRoom(roomId, newPlayer);
      socket.join(roomId);

      const roomRoleCounts = getRoleCounts(roomId);

      const rooms = getAllRooms();

      io.to(roomId).emit(RECEIVE_PLAYER, roomRoleCounts);
      socket.broadcast.to("roomListPage").emit(SEND_ROOMS, rooms);
    });

    socket.on(LEAVE_ROOM, payload => {
      leaveRoom(payload);

      const rooms = getAllRooms();

      if (rooms[payload.roomId]) {
        socket.leave(payload.roomId);

        const roomRoleCounts = getRoleCounts(payload.roomId);

        io.to(payload.roomId).emit(RECEIVE_PLAYER, roomRoleCounts);
        io.to(payload.id).emit(LEAVE_ROOM_PLAYER_REDIRECT_ROOM_LIST);
      } else {
        io.to(payload.roomId).emit(LEAVE_ROOM_PLAYER_REDIRECT_ROOM_LIST);
      }
    });

    socket.on(PRESS_RUN_BUTTON, roomId => {
      const rooms = getAllRooms();

      const currentRoom = getRoomById(roomId);

      currentRoom.isProgressGame = true;

      io.to("roomListPage").emit(SEND_ROOMS, rooms);
      io.to(roomId).emit(CHANGE_ALL_PLAYER_SCENE);
    });

    socket.on(ENTER_GAME, roomId => {
      const playersInformationAndplayersId = getPlayersInformation(roomId);

      const { playerInformation, policesId, robbersId } = playersInformationAndplayersId;

      io.to(roomId).emit(SEND_ROOM_PLAYERS_INFORMATION, playerInformation, policesId, robbersId);
    });

    socket.on(PLAYER_MOVE, ({ roomId, playerId, currentDirection, coordinateX, coordinateY }) => {
      const player = updatePlayerPosition(playerId, currentDirection, coordinateX, coordinateY);

      io.to(roomId).emit(SEND_MOVE_PLAYER, player);
    });

    socket.on(PLAYER_STOP, ({ roomId, playerId, currentDirection, coordinateX, coordinateY }) => {
      const player = updatePlayerPosition(playerId, currentDirection, coordinateX, coordinateY);

      io.to(roomId).emit(SEND_STOP_PLAYER, player);
    });

    socket.on(POLICE_OPACITY_CHANGED, ({ roomId, playerId }) => {
      io.to(roomId).emit(SEND_COLLIDED_PLAYER, playerId);
    });

    socket.on(ARREST_ROBBER, ({ roomId, playerId }) => {
      const remainingRobberNumber = arrestRobber(roomId, playerId);

      io.to(roomId).emit(SEND_ARRESTED_PLAYER, playerId, remainingRobberNumber);
    });

    socket.on(LEAVE_GAME, ({ roomId, playerId, playerRole }) => {
      socket.leave(roomId);

      const room = getRoomById(roomId);

      if (playerRole === "police") {
        room.policeId = room.policeId.filter(id => id !== playerId);
      } else {
        room.robberId = room.robberId.filter(id => id !== playerId);
      }

      io.to(roomId).emit(SEND_LEFT_PLAYER, room, playerId);
    });

    socket.on(OPEN_VIDEO, roomId => {
      io.to(roomId).emit(SET_VIDEO, true);
    });

    socket.on(CLOSE_VIDEO, roomId => {
      io.to(roomId).emit(SET_VIDEO, false);
    });
  });
};
