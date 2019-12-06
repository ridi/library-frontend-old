import React from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';

// import { SHELVES_LIMIT, ITEMS_LIMIT_PER_SHELF } from 'constants/shelves';
import TitleBar from 'components/TitleBar';
import { ButtonType } from 'components/ActionBar/constants';
import BottomActionBar from 'components/BottomActionBar';
import * as shelfActions from 'services/shelf/actions';
import * as shelfSelectors from 'services/shelf/selectors';

const SelectShelf = ({ pageTitle, handleBackButtonClick, handleMoveButtonClick, totalSelectedCount }) => {
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(shelfActions.loadAllShelf());
    // load totalShelf
    // load shelvesTotalCount
    // SHELVES_LIMIT에 따른 책장 생성 제한
    // ITEMS_LIMIT_PER_SHELF에 따른 disabled 처리
  }, []);
  const allShelf = useSelector(shelfSelectors.getAllShelf);
  const allShelfCount = allShelf.items ? allShelf.items.length : 0;

  const actionBarProps = {
    buttonProps: [
      {
        name: '새 책장 추가',
        onClick: handleMoveButtonClick,
        disable: totalSelectedCount === 0,
      },
      {
        type: ButtonType.SPACER,
      },
      {
        name: '이동',
        onClick: handleMoveButtonClick,
        disable: totalSelectedCount === 0,
      },
    ],
  };

  const renderMain = () => {
    const { loading, items: shelves } = allShelf;
    if (loading) {
      return <p>로딩중!</p>;
    }
    if (shelves && shelves.length === 0) {
      return <div>책장이 없어요</div>;
    }
    if (shelves && shelves.length > 0) {
      return <div>책장 {allShelfCount}개</div>;
    }
    return null;
  };

  return (
    <>
      <Helmet>
        <title>{`${pageTitle} - 내 서재`}</title>
      </Helmet>
      <div>
        <TitleBar title={`${totalSelectedCount}권을 이동할 책장 선택`} onBackClick={handleBackButtonClick} invertColor />
        <BottomActionBar {...actionBarProps} />
        {renderMain()}
      </div>
    </>
  );
};

export default SelectShelf;
