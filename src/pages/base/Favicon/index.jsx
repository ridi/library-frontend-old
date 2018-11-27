import React from 'react';

import config from '../../../config';

const Favicon = () => (
  <>
    <link rel="apple-touch-icon" sizes="57x57" href={`${config.STATIC_URL}/static/favicon/apple-icon-57x57.png`} />
    <link rel="apple-touch-icon" sizes="60x60" href={`${config.STATIC_URL}/static/favicon/apple-icon-60x60.png`} />
    <link rel="apple-touch-icon" sizes="72x72" href={`${config.STATIC_URL}/static/favicon/apple-icon-72x72.png`} />
    <link rel="apple-touch-icon" sizes="76x76" href={`${config.STATIC_URL}/static/favicon/apple-icon-76x76.png`} />
    <link rel="apple-touch-icon" sizes="114x114" href={`${config.STATIC_URL}/static/favicon/apple-icon-114x114.png`} />
    <link rel="apple-touch-icon" sizes="120x120" href={`${config.STATIC_URL}/static/favicon/apple-icon-120x120.png`} />
    <link rel="apple-touch-icon" sizes="144x144" href={`${config.STATIC_URL}/static/favicon/apple-icon-144x144.png`} />
    <link rel="apple-touch-icon" sizes="152x152" href={`${config.STATIC_URL}/static/favicon/apple-icon-152x152.png`} />
    <link rel="apple-touch-icon" sizes="180x180" href={`${config.STATIC_URL}/static/favicon/apple-icon-180x180.png`} />
    <link rel="icon" type="image/png" sizes="192x192" href={`${config.STATIC_URL}/static/favicon/android-icon-192x192.png`} />
    <link rel="icon" type="image/png" sizes="32x32" href={`${config.STATIC_URL}/static/favicon/favicon-32x32.png`} />
    <link rel="icon" type="image/png" sizes="96x96" href={`${config.STATIC_URL}/static/favicon/favicon-96x96.png`} />
    <link rel="icon" type="image/png" sizes="16x16" href={`${config.STATIC_URL}/static/favicon/favicon-16x16.png`} />
    <link rel="manifest" href={`${config.STATIC_URL}/static/favicon/manifest.json`} />
    <meta name="msapplication-TileColor" content="#ffffff" />
    <meta name="msapplication-TileImage" content={`${config.STATIC_URL}/static/favicon/ms-icon-144x144.png`} />
    <meta name="theme-color" content="#ffffff" />
  </>
);

export default Favicon;
