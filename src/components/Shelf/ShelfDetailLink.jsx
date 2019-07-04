/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Link } from 'react-router-dom';
import { PageType, URLMap } from '../../constants/urls';
import { makeLinkProps } from '../../utils/uri';
import { shelfStyles } from './styles';

export const ShelfDetailLink = ({ uuid, name }) => {
  const { as } = URLMap[PageType.SHELF_DETAIL];
  const linkProps = makeLinkProps({}, as({ uuid }));
  return (
    <Link {...linkProps} css={shelfStyles.link}>
      <span className="a11y">{name} 바로가기</span>
    </Link>
  );
};
