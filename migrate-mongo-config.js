const config = {
  mongodb: {
    url: process.env.MONGO_URL || 'mongodb://localhost:27017',
    databaseName: 'todo-api',

    options: {
      useNewUrlParser: true,
    },
  },

  migrationsDir: 'migrations',
  changelogCollectionName: 'changelog',
  migrationFileExtension: '.js',
  useFileHash: false,

  moduleSystem: 'commonjs',
};

module.exports = config;
