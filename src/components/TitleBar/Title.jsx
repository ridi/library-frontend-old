import { Link } from 'react-router-dom';

import ArrowLeft from 'svgs/ArrowLeft.svg';
import { thousandsSeperator } from 'utils/number';

import * as styles from './styles';

const Title = ({ title, showCount, totalCount, to, onBackClick, invertColor }) => {
  const BackButton = ({ WrapperComponent, ...wrapperProps }) => (
    <WrapperComponent {...wrapperProps} css={styles.BackButton}>
      <ArrowLeft css={styles.BackIcon} />
      <span className="a11y">뒤로가기</span>
    </WrapperComponent>
  );

  return (
    <div css={styles.Title} className={`${invertColor ? styles.InvertColor : ''}`}>
      {to && <BackButton WrapperComponent={Link} to={to} />}
      {onBackClick && <BackButton WrapperComponent="button" type="button" onClick={onBackClick} />}
      <h2 css={styles.TitleTextWrapper}>
        <span css={styles.TitleText}>{title}</span>
        {showCount ? <span css={styles.Count}>{totalCount ? thousandsSeperator(totalCount) : ''}</span> : null}
      </h2>
    </div>
  );
};

export default Title;
