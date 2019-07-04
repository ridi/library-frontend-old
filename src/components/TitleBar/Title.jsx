/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Link } from 'react-router-dom';
import ArrowLeft from '../../svgs/ArrowLeft.svg';
import { thousandsSeperator } from '../../utils/number';
import { makeLinkProps } from '../../utils/uri';
import * as styles from './styles';

const Title = ({ title, showCount, totalCount, as, query, a11y = '뒤로가기' }) => (
  <div css={styles.title}>
    <Link {...makeLinkProps({}, as, query)}>
      <a css={styles.backButton}>
        <ArrowLeft css={styles.backIcon} />
        <span className="a11y">{a11y}</span>
      </a>
    </Link>
    <h2 css={styles.titleTextWrapper}>
      <span css={styles.titleText}>{title}</span>
      {showCount ? <span css={styles.count}>{totalCount ? thousandsSeperator(totalCount) : ''}</span> : null}
    </h2>
  </div>
);

export default Title;
