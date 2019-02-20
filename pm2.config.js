module.exports = {
  apps: [
    {
      name: 'App',
      script: 'server/entry.js',
      node_args: '-r esm',
      kill_timeout: 3000,
      env_local: {
        PORT: 3000,
        NODE_ENV: 'local',
      },
      env_development: {
        PORT: 3000,
        NODE_ENV: 'development',
      },
      env_production: {
        PORT: 3000,
        NODE_ENV: 'production',
      },
    },
  ],
};
