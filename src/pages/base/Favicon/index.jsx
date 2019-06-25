import React from 'react';

import config from '../../../config';

const DATE = '20190603';

const Favicon = () => (
  <>
    <link rel="icon" type="image/x-icon" href={`${config.STATIC_URL}/static/favicon/favicon.ico?${DATE}`} />
    <link rel="apple-touch-icon" sizes="180x180" href={`${config.STATIC_URL}/static/favicon/apple-touch-icon.png?${DATE}`} />
    <link rel="icon" type="image/png" sizes="32x32" href={`${config.STATIC_URL}/static/favicon/favicon-32x32.png?${DATE}`} />
    <link rel="icon" type="image/png" sizes="16x16" href={`${config.STATIC_URL}/static/favicon/favicon-16x16.png?${DATE}`} />
    <link rel="manifest" href={`${config.STATIC_URL}/static/favicon/site.2019-06-03.webmanifest.json`} />
    <link rel="mask-icon" href={`${config.STATIC_URL}/static/favicon/safari-pinned-tab.svg?${DATE}`} color="#5bbad5" />
    <meta name="msapplication-TileColor" content="#da532c" />
    <meta name="theme-color" content="#ffffff" />
  </>
);

export default Favicon;
