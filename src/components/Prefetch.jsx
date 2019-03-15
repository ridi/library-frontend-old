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
    return (
      <div css={styles.hidden}>
        {Object.keys(URLMap).map(key => {
          const urlInfo = URLMap[key];
          let linkProps = { href: urlInfo.href, as: urlInfo.as };
          if (typeof urlInfo.as === 'function') {
            linkProps = {
              href: { pathname: urlInfo.href, query: { unitId: _virtualUnitId } },
              as: { pathname: urlInfo.as({ unitId: _virtualUnitId }) },
            };
          }
          return (
            <Link prefetch {...linkProps} key={key}>
              <a />
            </Link>
          );
        })}
      </div>
    );
  }
}
