const express = require('express');
const next = require('next');
const routes = require('./src/routes');
const nextConfig = require('./next.config');

const isLocal = process.env.NODE_ENV === 'local';
const app = next({ dev: isLocal, dir: './src', conf: nextConfig });

const handle = routes.getRequestHandler(app);

app.prepare()
  .then(() => {
    const server = express();

    server.get('/health', (req, res) => {
      res.send('I am healthy');
    });

    server.get('*', (req, res) => {
      return handle(req, res);
    });

    const port = process.env.PORT || 8080;
    server.listen(port, (err) => {
      if (err) throw err;
      console.log('> Ready on ' + port);
    });
  })
  .catch(exc => {
    console.error(exc.stack);
    process.exit(1);
  });
