import classNames from 'classnames';

const TabItem = ({ title, onClick, isActive }) => (
  <li>
    <button type="button" onClick={onClick} className={classNames('TabBar_TabItem', { 'TabBar_TabItem-active': isActive })}>
      {title}
    </button>
  </li>
);

export default TabItem;
