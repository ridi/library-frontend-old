const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const next = require('next');
const routes = require('./routes');
const nextConfig = require('../next.config');

const isLocal = process.env.NODE_ENV === 'local';
const app = next({
  dev: isLocal,
  dir: path.resolve(__dirname, '../src'),
  conf: nextConfig,
});
const handle = routes.getRequestHandler(app);

// next가 로드된 후 불러와야함
const middleware = require('./middleware');

app
  .prepare()
  .then(() => {
    const server = express();
    // For health check
    server.get('/health', (req, res) => {
      res.send('I am healthy');
    });

    const ssrRouter = express.Router();
    ssrRouter.use(cookieParser());
    ssrRouter.use(middleware.jwtAuth);
    ssrRouter.get('*', (req, res) => handle(req, res));
    server.use('/', ssrRouter);

    const port = process.env.PORT || 8080;
    const listener = server.listen(port, err => {
      if (err) throw err;
      console.log(`> Ready on ${port}`);
    });

    // Register Signals
    const closeListener = () => {
      listener.close(err => {
        if (err) {
          console.log(err);
          process.exit(1);
        }
        process.exit(0);
      });
    };

    process.on('SIGINT', () => {
      console.info('SIGINT signal received.');
      closeListener();
    });
    process.on('SIGTERM', () => {
      console.log('SIGTERM received');
      closeListener();
    });
  })
  .catch(exc => {
    console.error(exc.stack);
    process.exit(1);
  });
