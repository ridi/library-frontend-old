/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import Empty from './index';
import Shelves from '../../svgs/Shelves.svg';
import { BetaAlert } from '../../pages/shelves/list/BetaAlert';

const emptyShelvesMessage = () => (
  <>
    책장이 없습니다.
    <BetaAlert
      styles={css`
        padding: 8px 0 0 0;
      `}
    />
  </>
);

export const EmptyShelves = () => <Empty IconComponent={Shelves} message={emptyShelvesMessage()} iconWidth={47} />;
