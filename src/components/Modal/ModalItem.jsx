/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Link } from 'react-router-dom';
import Check from '../../svgs/Check.svg';
import { makeLinkProps } from '../../utils/uri';
import * as modalStyles from './styles';

export const ModalButtonItem = ({ title, isSelected, IconComponent, onClick, style, showSpinner = false }) => (
  <button type="button" css={[modalStyles.item, style, modalStyles.spinner(showSpinner)]} onClick={onClick} disabled={showSpinner}>
    {IconComponent && <IconComponent css={modalStyles.icon} />}
    {isSelected && <Check css={modalStyles.selectedIcon} />}
    {title}
  </button>
);

export const ModalLinkItem = ({ title, isSelected, children, count, IconComponent, as, style, query = {}, replace = false }) => (
  <Link replace={replace} {...makeLinkProps({}, as, query)} css={[modalStyles.item, style]}>
    {IconComponent && <IconComponent css={modalStyles.icon} />}
    {isSelected && <Check css={modalStyles.selectedIcon} />}
    {children}
    {title}
    {count ? <span css={modalStyles.count}>{count}</span> : null}
  </Link>
);

export const ModalAnchorItem = ({ title, isSelected, IconComponent, href, style }) => {
  return (
    <a css={[modalStyles.item, style]} href={href}>
      {IconComponent && <IconComponent css={modalStyles.icon} />}
      {isSelected && <Check css={modalStyles.selectedIcon} />}
      {title}
    </a>
  );
};
