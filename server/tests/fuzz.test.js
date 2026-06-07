const { GameCollection } = require('../games');

const fuzzInputs = [
  null,
  undefined,
  '',
  0,
  false,
  true,
  [],
  {},
  { toString: () => { throw new Error('inject'); } },
  'a'.repeat(10000),
  '<script>alert(1)</script>',
  "'; DROP TABLE matches; --",
  '\x00\x01\x02\x03',
  '\n\r\t',
  '../../etc/passwd',
  Number.MAX_SAFE_INTEGER,
  -1,
  Infinity,
  NaN,
];

describe('Fuzzing — GameCollection.createGame', () => {
  fuzzInputs.forEach((input, i) => {
    test(`does not throw with input #${i}: ${JSON.stringify(input)}`, () => {
      const collection = new GameCollection();
      expect(() => collection.createGame(input)).not.toThrow();
    });
  });
});

describe('Fuzzing — GameCollection.getGame', () => {
  fuzzInputs.forEach((input, i) => {
    test(`does not throw with input #${i}: ${JSON.stringify(input)}`, () => {
      const collection = new GameCollection();
      expect(() => collection.getGame(input)).not.toThrow();
    });
  });
});

describe('Fuzzing — GameCollection.removeGame', () => {
  fuzzInputs.forEach((input, i) => {
    test(`does not throw with input #${i}: ${JSON.stringify(input)}`, () => {
      const collection = new GameCollection();
      expect(() => collection.removeGame(input)).not.toThrow();
    });
  });
});
