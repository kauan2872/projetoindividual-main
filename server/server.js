const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const { GameCollection } = require('./games');
const { initDB, saveMatch } = require('./db');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const games = new GameCollection();

app.use(express.static(path.join(__dirname, '..', 'game')));

const PORT = process.env.PORT || 55555;

const Responses = {
  SUCCESS: 0,
  GAME_EXISTS: 1,
  GAME_NOT_EXISTS: 2,
  GAME_FULL: 3,
};

const Requests = {
  CREATE_GAME: 'create-game',
  JOIN_GAME: 'join-game',
};

io.on('connection', (socket) => {
  socket.on(Requests.CREATE_GAME, (gameName) => {
    if (games.createGame(gameName)) {
      games.getGame(gameName).addPlayer(socket);
      socket.emit('response', Responses.SUCCESS);
    } else {
      socket.emit('response', Responses.GAME_EXISTS);
    }
  });

  socket.on(Requests.JOIN_GAME, (gameName) => {
    const game = games.getGame(gameName);
    if (!game) {
      socket.emit('response', Responses.GAME_NOT_EXISTS);
    } else if (game.addPlayer(socket)) {
      socket.emit('response', Responses.SUCCESS);
    } else {
      socket.emit('response', Responses.GAME_FULL);
    }
  });
});

games.onMatchEnd = async (gameName, winnerIndex) => {
  try {
    await saveMatch(gameName, winnerIndex);
  } catch (err) {
    console.error('Failed to save match:', err.message);
  }
};

async function start() {
  await initDB();
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start();

module.exports = { app, server };
