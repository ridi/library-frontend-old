import React from 'react';
import Head from 'next/head';
import Router from 'next/router';

import GNB from './base/GNB';

export default class extends React.Component {
  render() {
    return (
      <>
        <Head>
          <title>내 서재</title>
        </Head>
      </>
    );
  }
}
