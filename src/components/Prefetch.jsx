/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import Link from 'next/link';
import * as shortid from 'shortid';
import { URLMap } from '../constants/urls';

const styles = {
  hidden: {
    position: 'absolute',
    width: 1,
    height: 1,
    margin: -1,
    padding: 0,
    overflow: 'hidden',
    border: 0,
    clip: 'rect(0, 0, 0, 0)',
  },
};

export default class extends React.Component {
  render() {
    const _virtualUnitId = 1;
    const urlMapList = Object.keys(URLMap).map(key => URLMap[key]);
    return (
      <div css={styles.hidden}>
        {urlMapList.map(urlMap => {
          let linkProps = { href: urlMap.href, as: urlMap.as };
          if (typeof urlMap.as === 'function') {
            linkProps = {
              href: { pathname: urlMap.href, query: { unitId: _virtualUnitId } },
              as: { pathname: urlMap.as({ unitId: _virtualUnitId }) },
            };
          }
          return (
            <Link prefetch {...linkProps} key={`${JSON.stringify(urlMap)}`}>
              <a />
            </Link>
          );
        })}
      </div>
    );
  }
}
