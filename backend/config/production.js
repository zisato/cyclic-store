const path = require('path');

module.exports = {
  publicPath: path.join(
    __dirname,
    '..',
    '..',
    'frontend',
    'dist'
  ),
  container: {
    loadModules: {
      patterns: [
        path.join(
          __dirname,
          '..',
          'build',
          'src',
          'infrastructure',
          '**',
          '*.js'
        ),
        path.join(__dirname, '..', 'build', 'src', 'application', '**', '*.js'),
      ],
    },
  },
};
