import React from 'react';
import { Helmet } from 'react-helmet';

import { SHELVES_LIMIT, ITEMS_LIMIT_PER_SHELF } from 'constants/shelves';

const SelectShelf = ({ pageTitle, handleBackButtonClick, handleMoveButtonClick }) => {
  React.useEffect(() => {
    // load totalShelf
    // load shelvesTotalCount
    // SHELVES_LIMIT에 따른 책장 생성 제한
    // ITEMS_LIMIT_PER_SHELF에 따른 disabled 처리
  }, []);

  return (
    <>
      <Helmet>
        <title>{`${pageTitle} - 내 서재`}</title>
      </Helmet>
      <div>
        이동 선택!!!
        <button type="button" onClick={handleBackButtonClick}>
          close!
        </button>
        <button type="button" onClick={handleMoveButtonClick}>
          옮기기!!
        </button>
      </div>
    </>
  );
};

export default SelectShelf;
