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
          'SINGLETON',
        ],
      ],
    },
  },
};
