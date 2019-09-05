/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Link, withRouter } from 'react-router-dom';
import { PageType, URLMap } from '../../constants/urls';
import { makeLinkProps } from '../../utils/uri';
import { shelfStyles } from './styles';

const ShelfDetailLink = ({ uuid, name, location }) => {
  const { as } = URLMap[PageType.SHELF_DETAIL];
  const { to } = makeLinkProps({}, as({ uuid }));
  return (
    <Link
      to={{
        ...to,
        state: {
          backLocation: location,
        },
      }}
      css={shelfStyles.link}
    >
      <span className="a11y">{name} 바로가기</span>
    </Link>
  );
};

export default withRouter(ShelfDetailLink);
