const socketio = require("socket.io");
const {
  STANDBY,
  JOIN_ROOM,
  SEND_ROOMS,
  ENTER_GAME,
  SET_VIDEO,
  OPEN_VIDEO,
  CLOSE_VIDEO,
  PLAYER_MOVE,
  PLAYER_STOP,
  LEAVE_ROOM,
  LEAVE_GAME,
  ARREST_ROBBER,
  RECEIVE_PLAYER,
  ENTER_ROOM_LIST,
  HANDLE_RUN_BUTTON,
  SEND_MOVE_PLAYER,
  SEND_STOP_PLAYER,
  SEND_SOCKET_ID,
  SEND_EXIT_PLAYER,
  SEND_ARRESTED_PLAYER,
  SEND_COLLIDED_PLAYER,
  POLICE_OPACITY_CHANGED,
  CHANGE_ALL_PLAYER_SCENE,
  SEND_ENTERED_ROOM,
  FIND_ENTERED_ROOM,
  NEW_VIDEO_CHAT_PARTICIPANT,
  ASSIGN_ROOM_CREATOR_AS_HOST,
  SEND_ROOM_PLAYERS_INFORMATION,
  SENDING_SIGNAL_TO_CONNECT_WEBRTC,
  RETURNING_SIGNAL_TO_CONNECT_WEBRTC,
  LEAVE_ROOM_PLAYER_REDIRECT_ROOM_LIST,
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
    socket.on(FIND_ENTERED_ROOM, roomId => {
      const enteredRoom = getRoomById(roomId);

      socket.emit(SEND_ENTERED_ROOM, enteredRoom);
    });

    socket.on(SENDING_SIGNAL_TO_CONNECT_WEBRTC, payload => {
      const { signal, callerID } = payload;

      io.to(payload.userToSignal).emit(NEW_VIDEO_CHAT_PARTICIPANT, { signal, callerID });
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

    socket.on(ASSIGN_ROOM_CREATOR_AS_HOST, ({ role, isHost, nickname, characterPath, characterType }, roomTitle) => {
      const { coordinateX, coordinateY } = setStartPosition(socket.id, role);

      const hostPlayer = {
        id: socket.id,
        role,
        isHost,
        nickname,
        coordinateX,
        coordinateY,
        characterPath,
        characterType,
        currentDirection: "stop",
      };

      createRoom(hostPlayer, roomTitle);
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

    socket.on(JOIN_ROOM, (roomId, { nickname, role, isHost, characterPath, characterType }) => {
      socket.leave("roomListPage");

      const { coordinateX, coordinateY } = setStartPosition(roomId, role);

      const newPlayer = {
        id: socket.id,
        role,
        isHost,
        nickname,
        coordinateX,
        coordinateY,
        characterPath,
        characterType,
        currentDirection: "stop",
      };

      if (!joinRoom(roomId, newPlayer)) return;

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

    socket.on(HANDLE_RUN_BUTTON, roomId => {
      const rooms = getAllRooms();

      const enteredRoom = getRoomById(roomId);

      enteredRoom.isProgressGame = true;

      io.to("roomListPage").emit(SEND_ROOMS, rooms);
      io.to(roomId).emit(CHANGE_ALL_PLAYER_SCENE);
    });

    socket.on(ENTER_GAME, roomId => {
      const playersInformation = getPlayersInformation(roomId);

      const roomRoleCounts = getRoleCounts(roomId);

      io.to(roomId).emit(SEND_ROOM_PLAYERS_INFORMATION, playersInformation, roomRoleCounts);
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

      io.to(roomId).emit(SEND_EXIT_PLAYER, room, playerId);
    });

    socket.on(OPEN_VIDEO, roomId => {
      io.to(roomId).emit(SET_VIDEO, true);
    });

    socket.on(CLOSE_VIDEO, roomId => {
      io.to(roomId).emit(SET_VIDEO, false);
    });
  });
};
