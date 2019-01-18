/** @jsx jsx */
import { jsx } from '@emotion/core';
import Link from 'next/link';
import { Icon } from '@ridi/rsg';
import { makeLinkProps } from '../../utils/uri';
import * as modalStyles from './styles';

export const ModalButtonItem = ({ title, icon, IconComponent, onClick, style, showSpinner = false, showIcon = true }) => (
  <button type="button" css={[modalStyles.item, style]} onClick={onClick}>
    {showIcon && icon && <Icon name={icon} css={modalStyles.icon} />}
    {showIcon && IconComponent && <IconComponent css={modalStyles.icon} />}
    {showSpinner ? '로딩중' : title}
  </button>
);

export const ModalLinkItem = ({ title, icon, IconComponent, href, as, style, query = {}, showIcon = true }) => (
  <Link {...makeLinkProps(href, as, query)}>
    <a css={[modalStyles.item, style]}>
      {showIcon && icon && <Icon name={icon} css={modalStyles.icon} />}
      {showIcon && IconComponent && <IconComponent css={modalStyles.icon} />}
      {title}
    </a>
  </Link>
);

export const ModalAnchorItem = ({ title, icon, IconComponent, href, style, isOuterLink = false, showIcon = true }) => {
  const additionalProps = isOuterLink
    ? {
        target: '_blank',
        rel: 'noopener noreferrer',
      }
    : {};
  return (
    <a css={[modalStyles.item, style]} href={href} {...additionalProps}>
      {showIcon && icon && <Icon name={icon} css={modalStyles.icon} />}
      {showIcon && IconComponent && <IconComponent css={modalStyles.icon} />}
      {title}
    </a>
  );
};
