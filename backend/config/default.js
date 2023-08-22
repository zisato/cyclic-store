const path = require('path');

module.exports = {
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
  }
};
