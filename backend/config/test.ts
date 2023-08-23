const path = require('path');

module.exports = {
  container: {
    loadModules: {
      patterns: [
        path.join(__dirname, '..', 'src', 'infrastructure', '**', '*.ts'),
        path.join(__dirname, '..', 'src', 'application', '**', '*.ts')
      ]
    }
  },
  server: {
    port: Math.floor(Math.random() * 9000 + 1000)
  }
};
