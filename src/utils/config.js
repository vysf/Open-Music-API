/* eslint-disable linebreak-style */
const config = {
  app: {
    host: process.env.HOST,
    port: process.env.PORT,
  },
  rabbitMq: {
    server: process.env.RABBITMQ_SERVER,
  },
  redis: {
    host: process.env.REDIS_SERVER,
  },
  token: {
    keyAccess: process.env.ACCESS_TOKEN_KEY,
    keyRefresh: process.env.REFRESH_TOKEN_KEY,
    age: process.env.ACCESS_TOKEN_AGE,
  },
};

module.exports = config;
