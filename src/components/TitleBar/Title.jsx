import { Link } from 'react-router-dom';
import ArrowLeft from '../../svgs/ArrowLeft.svg';
import { thousandsSeperator } from '../../utils/number';
import * as styles from './styles';

const Title = ({ title, showCount, totalCount, to, a11y = '뒤로가기' }) => (
  <div css={styles.title}>
    <Link to={to} css={styles.backButton}>
      <ArrowLeft css={styles.backIcon} />
      <span className="a11y">{a11y}</span>
    </Link>
    <h2 css={styles.titleTextWrapper}>
      <span css={styles.titleText}>{title}</span>
      {showCount ? <span css={styles.count}>{totalCount ? thousandsSeperator(totalCount) : ''}</span> : null}
    </h2>
  </div>
);

export default Title;
