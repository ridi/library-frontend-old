/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Link } from 'react-router-dom';
import Check from '../../svgs/Check.svg';
import Sync from '../../svgs/Sync.svg';
import LoadingSpinner from '../LoadingSpinner';
import * as modalStyles from './styles';

function ItemIcon(props) {
  const { isSelected, IconComponent } = props;
  if (isSelected) {
    return <Check css={modalStyles.selectedIcon} />;
  }
  if (IconComponent) {
    return <IconComponent css={modalStyles.icon} />;
  }
  return <div css={modalStyles.paddedIcon} />;
}

export const ModalButtonItem = ({ title, isSelected, IconComponent, onClick, style, showSpinner = false }) => (
  <button type="button" css={[modalStyles.item, style]} onClick={onClick} disabled={showSpinner}>
    <ItemIcon isSelected={isSelected} IconComponent={showSpinner ? LoadingSpinner : IconComponent} />
    {title}
  </button>
);

export const ModalSyncButtonItem = ({ title, syncing, onClick, style }) => (
  <button type="button" css={[modalStyles.item, style]} onClick={onClick} disabled={syncing}>
    <Sync css={[modalStyles.selectedIcon, modalStyles.paddedIcon, syncing && modalStyles.iconSpinning]} />
    {title}
  </button>
);

export const ModalLinkItem = ({ title, isSelected, children, count, IconComponent, to, style, replace = false }) => (
  <Link replace={replace} to={to} css={[modalStyles.item, style]}>
    <ItemIcon isSelected={isSelected} IconComponent={IconComponent} />
    {children}
    {title}
    {count ? <span css={modalStyles.count}>{count}</span> : null}
  </Link>
);

export const ModalAnchorItem = ({ title, isSelected, IconComponent, href, style }) => {
  return (
    <a css={[modalStyles.item, style]} href={href}>
      <ItemIcon isSelected={isSelected} IconComponent={IconComponent} />
      {title}
    </a>
  );
};
