
module.exports = {
  apps: [
    {
      name: "Library Rendering Server",
      script: "./server.js",
      env: {
        "PORT": 8080,
        "NODE_ENV": "development"
      },
      env_production: {
        "PORT": 8080,
        "NODE_ENV": "production"
      }
    }
  ],
};
