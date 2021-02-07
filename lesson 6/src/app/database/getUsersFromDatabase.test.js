const { getUsersFromDatabase } = require('./getUsersFromDatabase');
const database = require('./database.js');

jest.mock('./database.js');

let mockedUsersInDatabase = [
  { username: 'user_name1@company.com', password: 'user_name1' },
  { username: 'user_name1@company.com', password: 'user_name1', jwt: 'dfsfgsghdhdghk' },
];

const doneCallback = jest.fn();

database.User.find.mockImplementation(() => {
  return {
    exec: () => {
      return new Promise((resolve) => {
        if (mockedUsersInDatabase) {
          resolve(mockedUsersInDatabase);
        }
        else {
          resolve([]);
        }
      });
    }
  };
});

describe('getUsersFromDatabase method', () => {
    beforeEach(() => {
      doneCallback.mockClear();
    });

    it('Should try to find users in database', async () => {
      await getUsersFromDatabase();
      expect(database.User.find).toHaveBeenCalled();
    });

    it('Should return mocked users from database', async () => {
      let usersFromDatabase = await getUsersFromDatabase();
      expect(usersFromDatabase).toEqual(mockedUsersInDatabase);
    });

    it('If users database is empty should return empty array', async () => {
      mockedUsersInDatabase = [];
      let usersFromDatabase = await getUsersFromDatabase();
      expect(usersFromDatabase).toEqual([]);
    });
  }
);
