const port = 8080;

const secret = 'TheOwlsAreNotWhatTheySeem';

const tokenValidity = '24h';

const dbPath = 'mongodb://localhost:27017';

module.exports = {
  port,
  secret,
  tokenValidity,
  dbPath,
};
