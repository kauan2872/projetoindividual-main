const { GameCollection, Game } = require('../games');

describe('GameCollection', () => {
  let collection;

  beforeEach(() => {
    collection = new GameCollection();
  });

  test('createGame returns true for a new game', () => {
    expect(collection.createGame('room1')).toBe(true);
  });

  test('createGame returns false when game already exists', () => {
    collection.createGame('room1');
    expect(collection.createGame('room1')).toBe(false);
  });

  test('getGame returns the created game', () => {
    collection.createGame('room1');
    const game = collection.getGame('room1');
    expect(game).toBeInstanceOf(Game);
    expect(game.getId()).toBe('room1');
  });

  test('getGame returns undefined for nonexistent game', () => {
    expect(collection.getGame('nonexistent')).toBeUndefined();
  });

  test('removeGame returns true and removes existing game', () => {
    collection.createGame('room1');
    expect(collection.removeGame('room1')).toBe(true);
    expect(collection.getGame('room1')).toBeUndefined();
  });

  test('removeGame returns false for nonexistent game', () => {
    expect(collection.removeGame('nonexistent')).toBe(false);
  });
});

describe('Game', () => {
  let collection;

  beforeEach(() => {
    collection = new GameCollection();
  });

  const makeSocket = () => ({
    emit: jest.fn(),
    on: jest.fn(),
    disconnect: jest.fn(),
  });

  test('addPlayer accepts first player', () => {
    collection.createGame('room1');
    const game = collection.getGame('room1');
    expect(game.addPlayer(makeSocket())).toBe(true);
  });

  test('addPlayer accepts second player', () => {
    collection.createGame('room1');
    const game = collection.getGame('room1');
    game.addPlayer(makeSocket());
    expect(game.addPlayer(makeSocket())).toBe(true);
  });

  test('addPlayer rejects third player', () => {
    collection.createGame('room1');
    const game = collection.getGame('room1');
    game.addPlayer(makeSocket());
    game.addPlayer(makeSocket());
    expect(game.addPlayer(makeSocket())).toBe(false);
  });

  test('second player connection emits PLAYER_CONNECTED to first player', () => {
    collection.createGame('room1');
    const game = collection.getGame('room1');
    const p1 = makeSocket();
    const p2 = makeSocket();
    game.addPlayer(p1);
    game.addPlayer(p2);
    expect(p1.emit).toHaveBeenCalledWith('player-connected', 0);
  });
});
