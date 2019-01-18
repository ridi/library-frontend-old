/** @jsx jsx */
import { jsx } from '@emotion/core';
import Link from 'next/link';
import { Icon } from '@ridi/rsg';
import { makeLinkProps } from '../../utils/uri';
import * as styles from './styles';

const Title = ({ title, totalCount, href, as, query, a11y = '뒤로가기' }) => (
  <div css={styles.title}>
    <Link {...makeLinkProps(href, as, query)}>
      <a>
        <span css={styles.backButton}>
          <Icon name="arrow_13_left" css={styles.backIcon} />
          <span className="a11y">{a11y}</span>
        </span>
      </a>
    </Link>
    <div css={styles.titleTextWrapper}>
      <span css={styles.titleText}>{title}</span>
      <span css={styles.count}>{totalCount}</span>
    </div>
  </div>
);

export default Title;
