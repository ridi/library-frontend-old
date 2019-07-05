import React from 'react';
import Helmet from 'react-helmet';

import faviconIco from 'static/favicon/favicon.ico';
import appleTouchIcon from 'static/favicon/apple-touch-icon.png';
import favicon32 from 'static/favicon/favicon-32x32.png';
import favicon16 from 'static/favicon/favicon-16x16.png';
import webmanifest from 'static/favicon/site.2019-06-03.webmanifest.json';
import safariPinnedTab from 'static/favicon/safari-pinned-tab.svg';

const Favicon = () => (
  <Helmet>
    <link rel="icon" type="image/x-icon" href={faviconIco} />
    <link rel="apple-touch-icon" sizes="180x180" href={appleTouchIcon} />
    <link rel="icon" type="image/png" sizes="32x32" href={favicon32} />
    <link rel="icon" type="image/png" sizes="16x16" href={favicon16} />
    <link rel="manifest" href={webmanifest} />
    <link rel="mask-icon" href={safariPinnedTab} color="#5bbad5" />
    <meta name="msapplication-TileColor" content="#da532c" />
    <meta name="theme-color" content="#ffffff" />
  </Helmet>
);

export default Favicon;
