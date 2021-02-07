const { authorizeUserByToken } = require('./authorizeUserByToken');
const database = require('./database.js');

jest.mock('./database.js');

let token = 'qwewqweqweqweqweq';
let username = 'user_name@company.com';
const doneCallback = jest.fn();

database.User.findOne.mockImplementation(({ jwt: token }) => {
  return {
    exec: () => {
      return new Promise((resolve) => {
        if (token) {
          resolve({ name: username });
        }
        else {
          resolve(null);
        }
      });
    }
  };
});

describe('authorizeUserByToken method', () => {
    beforeEach(() => {
      doneCallback.mockClear();
    });
    it('Should try to find user in database', async () => {
      await authorizeUserByToken(token, doneCallback);
      expect(database.User.findOne).toHaveBeenCalled();
    });
    it('When token is correct "done" doneCallback should be called with user\'s object', async () => {
      await authorizeUserByToken(token, doneCallback);
      expect(doneCallback).toHaveBeenCalled();
      expect(doneCallback.mock.calls[0][0]).toBe(null);
      expect(doneCallback.mock.calls[0][1]).toEqual({ name: username });
    });
    it('When token is incorrect "done" doneCallback should be called with "Invalid token"', async () => {
      token = null;
      await authorizeUserByToken(token, doneCallback);
      expect(doneCallback).toHaveBeenCalled();
      expect(doneCallback.mock.calls[0][0]).toBe('Invalid token');
    });
  }
);
