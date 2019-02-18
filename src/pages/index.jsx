import React from 'react';
import { parse } from 'qs';
import Head from 'next/head';
import Router from 'next/router';

import window, { LOCATION } from '../utils/window';
import { makeLinkProps } from '../utils/uri';
import { toURLMap } from '../constants/urls';

export default class extends React.Component {
  componentDidMount() {
    console.log('real?');
    const _location = window.get(LOCATION);
    const { pathname } = _location;

    const { href, as } = toURLMap(pathname);
    const query = parse(_location.search, { charset: 'utf-8', ignoreQueryPrefix: true });
    const linkProps = makeLinkProps(href, as, query);

    Router.replace(linkProps.href, linkProps.as);
  }

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
