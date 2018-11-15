import classNames from 'classnames';
import styles from './styles';

const TabItem = ({ title, onClick, isActive }) => (
  <li className={styles.TabItemWrapper}>
    <button type="button" onClick={onClick} className={classNames(styles.TabItem, { [styles.TabItemActive]: isActive })}>
      {title}
    </button>
  </li>
);

export default TabItem;
