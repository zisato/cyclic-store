const path = require('path');

module.exports = {
  environment: process.env.NODE_ENV,
  publicPath: path.join(
    __dirname,
    '..',
    'public'
  ),
  container: {
    injectionMode: 'CLASSIC',
    loadModules: {
      patterns: [],
      lifetime: 'SCOPED',
      injectionMode: 'CLASSIC',
    },
  },
  server: {
    host: process.env.HTTP_HOST,
    port: process.env.HTTP_PORT
  },
  aws: {
    dynamodb: {
      endpoint: process.env.AWS_DYNAMODB_ENDPOINT,
    },
  },
};
