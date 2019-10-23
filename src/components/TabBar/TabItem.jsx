import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { trackClick } from 'services/tracking/actions';
import { makeLinkProps } from '../../utils/uri';
import * as styles from './styles';

export const TabItem = ({ name, onClick, isActive }) => (
  <li css={styles.tabItem}>
    <button type="button" onClick={onClick} css={[styles.tabButton, styles.tabButtonToggle(isActive)]}>
      {name}
      <span css={[styles.activeBar, styles.activeBarToggle(isActive)]} />
    </button>
  </li>
);

export const TabLinkItem = ({ name, as, query, isActive, icon }) => {
  const dispatch = useDispatch();
  return (
    <li css={styles.tabItem}>
      <Link
        {...makeLinkProps({}, as, query)}
        css={[styles.tabButton, styles.tabButtonToggle(isActive)]}
        onClick={() => {
          dispatch(trackClick({ test: '' }));
        }}
      >
        {name}
        {icon && icon(isActive)}
        <span css={[styles.activeBar, styles.activeBarToggle(isActive)]} />
      </Link>
    </li>
  );
};
