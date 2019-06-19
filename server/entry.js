const path = require('path');
const url = require('url');
const axios = require('axios');
const express = require('express');
const cookieParser = require('cookie-parser');
const next = require('next');
const nextConfig = require('../next.config');

const isLocal = process.env.NODE_ENV === 'local';
const app = next({
  dev: isLocal,
  dir: path.resolve(__dirname, '../src'),
  conf: nextConfig,
});

// next가 로드된 후 불러와야함
const routes = require('./routes');

const handle = routes.getRequestHandler(app, async ({ req, res, route, query }) => {
  const token = req.cookies['ridi-at'];
  if (route.page !== '/login') {
    let needRefresh = false;
    if (token == null) {
      needRefresh = true;
    } else {
      try {
        await axios.get('/accounts/me/', {
          baseURL: nextConfig.publicRuntimeConfig.ACCOUNT_BASE_URL,
          headers: {
            Cookie: `ridi-at=${token};`,
          },
        });
      } catch (err) {
        needRefresh = true;
      }
    }
    if (needRefresh) {
      const search = new url.URLSearchParams({ next: req.url });
      const location = `/login?${search}`;
      res.redirect(location);
      return;
    }
  }
  req.token = token;
  app.render(req, res, route.page, query);
});

app
  .prepare()
  .then(() => {
    const server = express();
    server.use(cookieParser());
    server.use(express.json());

    // For health check
    server.get('/health', (req, res) => {
      res.send('I am healthy');
    });

    const ssrRouter = express.Router();
    ssrRouter.use(cookieParser());
    ssrRouter.get('*', (req, res) => handle(req, res));
    server.use('/', ssrRouter);

    const port = process.env.PORT || 8080;
    const listener = server.listen(port, err => {
      if (err) {
        throw err;
      }
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
