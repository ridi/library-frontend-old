import LoadingSpinner from 'components/LoadingSpinner';
import { Link } from 'react-router-dom';
import Check from 'svgs/Check.svg';
import Sync from 'svgs/Sync.svg';

import * as modalStyles from './styles';

function ItemIcon(props) {
  const { isSelected, IconComponent } = props;
  if (isSelected) {
    return <Check css={[modalStyles.icon, modalStyles.selectedIcon]} />;
  }
  if (IconComponent) {
    return <IconComponent css={modalStyles.icon} />;
  }
  return <div css={modalStyles.icon} />;
}

export const ModalItemCount = ({ children }) => <span css={modalStyles.count}>{children}</span>;

export const ModalButtonItem = ({ children, isSelected, IconComponent, style, showSpinner, onClick }) => (
  <button type="button" css={[modalStyles.item, style]} onClick={onClick} disabled={showSpinner}>
    <ItemIcon isSelected={isSelected} IconComponent={showSpinner ? LoadingSpinner : IconComponent} />
    {children}
  </button>
);

export const ModalSyncButtonItem = ({ children, syncing, style, onClick }) => (
  <button type="button" css={[modalStyles.item, style]} onClick={onClick} disabled={syncing}>
    <Sync css={[modalStyles.icon, modalStyles.selectedIcon, syncing && modalStyles.iconSpinning]} />
    {children}
  </button>
);

export const ModalLinkItem = ({ children, isSelected, IconComponent, style, ...linkProps }) => (
  <Link css={[modalStyles.item, style]} {...linkProps}>
    <ItemIcon isSelected={isSelected} IconComponent={IconComponent} />
    {children}
  </Link>
);

export const ModalAnchorItem = ({ children, isSelected, IconComponent, style, ...anchorProps }) => (
  <a css={[modalStyles.item, style]} {...anchorProps}>
    <ItemIcon isSelected={isSelected} IconComponent={IconComponent} />
    {children}
  </a>
);
