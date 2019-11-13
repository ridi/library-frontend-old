import * as styles from './styles';

const TotalCount = ({ count, unit }) => (count > 0 ? <p css={styles.totalCount}>총 {`${count}${unit}`}</p> : <div />);

export default TotalCount;
