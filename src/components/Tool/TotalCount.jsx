import * as styles from './styles';

const TotalCount = ({ count, unit }) =>
  count && count > 0 ? (
    <p css={styles.totalCount}>총 {`${count}${unit}`}</p>
  ) : (
    <p>
      <span className="a11y">0{unit}</span>
    </p>
  );

export default TotalCount;
