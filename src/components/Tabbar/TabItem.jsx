import classNames from 'classnames';
import styles from './styles';

const TabItem = ({ name, onClick, isActive }) => (
  <li className={styles.TabItemWrapper}>
    <button type="button" onClick={onClick} className={classNames(styles.TabItem, { [styles.TabItemActive]: isActive })}>
      {name}
    </button>
  </li>
);

export default TabItem;
