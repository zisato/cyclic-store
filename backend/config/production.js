const path = require('path');

module.exports = {
  publicPath: path.join(__dirname, '..', '..', 'frontend'),
  container: {
      injectionMode: 'CLASSIC',
      loadModules: {
          patterns: [
            path.join(__dirname, '..', 'src', 'infrastructure', '**', '*.js'),
            path.join(__dirname, '..', 'src', 'application', '**', '*.js'),
          ],
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
      endpoint: null,
    },
  },
};
