const express = require('express');
const next = require('next');
const routes = require('./routes');
const nextConfig = require('../next.config');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir: '.', conf: nextConfig });

const handle = routes.getRequestHandler(app);

app.prepare()
  .then(() => {
    const server = express();

    server.get('/health', (req, res) => {
      return handle(req, res);
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
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });