/** @jsx jsx */
import { jsx } from '@emotion/core';
import Link from 'next/link';
import { Icon } from '@ridi/rsg';
import { makeLinkProps } from '../../utils/uri';
import * as modalStyles from './styles';

export const ModalButtonItem = ({ title, isSelected, icon, IconComponent, onClick, style, showSpinner = false }) => (
  <button type="button" css={[modalStyles.item, style]} onClick={onClick}>
    {icon && <Icon name={icon} css={modalStyles.icon} />}
    {IconComponent && <IconComponent css={modalStyles.icon} />}
    {isSelected && <Icon name="check_6" css={modalStyles.selectedIcon} />}
    {showSpinner ? '로딩중' : title}
  </button>
);

export const ModalLinkItem = ({ title, isSelected, children, count, icon, IconComponent, href, as, style, query = {} }) => (
  <Link {...makeLinkProps(href, as, query)}>
    <a css={[modalStyles.item, style]}>
      {icon && <Icon name={icon} css={modalStyles.icon} />}
      {IconComponent && <IconComponent css={modalStyles.icon} />}
      {isSelected && <Icon name="check_6" css={modalStyles.selectedIcon} />}
      {children}
      {title}
      {count ? <span css={modalStyles.count}>{count}</span> : null}
    </a>
  </Link>
);

export const ModalAnchorItem = ({ title, isSelected, icon, IconComponent, href, style, isOuterLink = false }) => {
  const additionalProps = isOuterLink
    ? {
        target: '_blank',
        rel: 'noopener noreferrer',
      }
    : {};
  return (
    <a css={[modalStyles.item, style]} href={href} {...additionalProps}>
      {icon && <Icon name={icon} css={modalStyles.icon} />}
      {IconComponent && <IconComponent css={modalStyles.icon} />}
      {isSelected && <Icon name="check_6" css={modalStyles.selectedIcon} />}
      {title}
    </a>
  );
};
