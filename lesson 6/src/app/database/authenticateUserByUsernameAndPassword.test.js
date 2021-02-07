const { authenticateUserByUsernameAndPassword } = require('./authenticateUserByUsernameAndPassword');
const database = require('./database.js');

jest.mock('./database.js');

let username = 'user_name@company.com';
let password = 'user_name';
const doneCallback = jest.fn();

database.User.find.mockImplementation(({ name: username, password: password }) => {
  return {
    exec: () => {
      return new Promise((resolve) => {
        if (username && password) {
          resolve([{ name: username, password: password }]);
        }
        else {
          resolve([]);
        }
      });
    }
  };
});

describe('authenticateUserByUsernameAndPassword method', () => {
    beforeEach(() => {
      doneCallback.mockClear();
    });
    it('Should try to find user in database', async () => {
      await authenticateUserByUsernameAndPassword(username, password, doneCallback);
      expect(database.User.find).toHaveBeenCalled();
    });
    it('When authorization data is correct "done" doneCallback should be called with user\'s object', async () => {
      await authenticateUserByUsernameAndPassword(username, password, doneCallback);
      expect(doneCallback).toHaveBeenCalled();
      expect(doneCallback.mock.calls[0][0]).toBe(null);
      expect(doneCallback.mock.calls[0][1]).toEqual({ name: username, password: password });
    });
    it('When username is incorrect "done" doneCallback should be called with "Invalid username or password"', async () => {
      username = null;
      await authenticateUserByUsernameAndPassword(username, password, doneCallback);
      expect(doneCallback).toHaveBeenCalled();
      expect(doneCallback.mock.calls[0][0]).toBe('Invalid username or password');
    });
    it('When password is incorrect "done" doneCallback should be called with "Invalid username or password"', async () => {
      username = 'user_name@company.com';
      password = null;
      await authenticateUserByUsernameAndPassword(username, password, doneCallback);
      expect(doneCallback).toHaveBeenCalled();
      expect(doneCallback.mock.calls[0][0]).toBe('Invalid username or password');
    });
  }
);





