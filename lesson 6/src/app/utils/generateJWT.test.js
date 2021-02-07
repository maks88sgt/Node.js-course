const { generateJWT } = require('./generateJWT');
const database = require('../database/database.js');

jest.mock('../database/database.js');
let username = 'user_name@company.com';
let password = 'user_name';
let user = { username, password };
const doneCallback = jest.fn();

database.User.updateOne.mockImplementation(() => {
  return {
    exec: () => {
      return new Promise((resolve) => {
          resolve({ n: 1, nModified: 1, ok: 1 });
      });
    }
  };
});

describe('generateJWT method', () => {
    beforeEach(() => {
      doneCallback.mockClear();
    });
    it('Should try to write token in database', async () => {
      await generateJWT(user, doneCallback);
      expect(database.User.updateOne).toHaveBeenCalled();
    });
    it('When token was generated doneCallback should be called with update object', async () => {
      await generateJWT(user, doneCallback);
      expect(doneCallback).toHaveBeenCalled();
      expect(doneCallback.mock.calls[0][0]).toBe(null);
      expect(doneCallback.mock.calls[0][1]).toEqual({ n: 1, nModified: 1, ok: 1 });
    });
  }
);
