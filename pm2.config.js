
module.exports = {
  apps: [
    {
      name: "Library Rendering Server",
      script: "./server.js",
      env: {
        "PORT": 8080,
        "NODE_ENV": "local",
        "STATIC_URL": ""
      },
      env_development: {
        "PORT": 8080,
        "NODE_ENV": "development",
        "STATIC_URL": "https://library-static.dev.ridi.io"
      },
      env_production: {
        "PORT": 8080,
        "NODE_ENV": "production",
        "STATIC_URL": "https://library-static.ridibooks.com"
      }
    }
  ],
};
