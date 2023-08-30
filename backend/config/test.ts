import { Lifetime } from 'awilix';

const path = require('path');

module.exports = {
  container: {
    loadModules: {
      patterns: [
        path.join(__dirname, '..', 'src', 'infrastructure', '**', '*.ts'),
        path.join(__dirname, '..', 'src', 'application', '**', '*.ts'),
        [
          path.join(
            __dirname,
            '..',
            'src',
            'infrastructure',
            '**',
            'repository',
            'in-memory-*-repository.ts'
          ),
          Lifetime.SINGLETON,
        ],
      ]
    }
  },
  server: {
    port: Math.floor(Math.random() * 9000 + 1000)
  }
};
