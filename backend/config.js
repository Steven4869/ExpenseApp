require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  database: {
    uri: process.env.MONGODB_URI
  },
  jwtSecret: 'yourjwtsecretkey',

};
