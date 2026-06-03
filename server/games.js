const Messages = {
  EVENT: 'event',
  LIFE_UPDATE: 'life-update',
  POSITION_UPDATE: 'position-update',
  PLAYER_CONNECTED: 'player-connected',
};

class Game {
  constructor(id, gameCollection) {
    this._id = id;
    this._gameCollection = gameCollection;
    this._players = [];
  }

  getId() {
    return this._id;
  }

  addPlayer(p) {
    if (this._players.length >= 2) return false;
    this._players.push(p);
    if (this._players.length === 2) {
      this._addHandlers();
      this._players[0].emit(Messages.PLAYER_CONNECTED, 0);
    }
    return true;
  }

  _addHandlers() {
    const [p1, p2] = this._players;
    const m = Messages;

    p1.on(m.EVENT, (data) => p2.emit(m.EVENT, data));
    p1.on(m.LIFE_UPDATE, (data) => p2.emit(m.LIFE_UPDATE, data));
    p1.on(m.POSITION_UPDATE, (data) => p2.emit(m.POSITION_UPDATE, data));

    p2.on(m.EVENT, (data) => p1.emit(m.EVENT, data));
    p2.on(m.LIFE_UPDATE, (data) => p1.emit(m.LIFE_UPDATE, data));
    p2.on(m.POSITION_UPDATE, (data) => p1.emit(m.POSITION_UPDATE, data));

    p1.on('disconnect', () => this.endGame(0));
    p2.on('disconnect', () => this.endGame(1));
  }

  endGame(playerOut) {
    if (!this._players.length) return;
    const winnerIndex = playerOut === 0 ? 1 : 0;
    const opponent = this._players[winnerIndex];
    this._players = [];
    opponent.disconnect();
    this._gameCollection.removeGame(this._id);
    if (this._gameCollection.onMatchEnd) {
      this._gameCollection.onMatchEnd(this._id, winnerIndex);
    }
  }
}

class GameCollection {
  constructor() {
    this._games = {};
    this.onMatchEnd = null;
  }

  getGame(id) {
    return this._games[id];
  }

  createGame(id) {
    if (this._games[id]) return false;
    this._games[id] = new Game(id, this);
    return true;
  }

  removeGame(id) {
    if (this._games[id]) {
      delete this._games[id];
      return true;
    }
    return false;
  }
}

module.exports = { GameCollection, Game };
