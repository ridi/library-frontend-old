/** @jsx jsx */
import { jsx } from '@emotion/core';
import Link from 'next/link';
import { PageType, URLMap } from '../../constants/urls';
import { makeLinkProps } from '../../utils/uri';
import { shelfStyles } from './styles';

export const ShelfDetailLink = ({ uuid, name }) => {
  const { href, as } = URLMap[PageType.SHELF_DETAIL];
  const linkProps = makeLinkProps(
    {
      pathname: href,
      query: { uuid },
    },
    as({ uuid }),
  );
  return (
    <Link prefetch {...linkProps}>
      <a css={shelfStyles.link}>
        <span className="a11y">{name} 바로가기</span>
      </a>
    </Link>
  );
};
