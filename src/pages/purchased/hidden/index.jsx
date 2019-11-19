import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { ButtonType } from '../../../components/ActionBar/constants';
import { Books } from '../../../components/Books';
import Editable from '../../../components/Editable';
import Empty from '../../../components/Empty';
import { BookError } from '../../../components/Error';
import PageRedirect from '../../../components/PageRedirect';
import ResponsivePaginator from '../../../components/ResponsivePaginator';
import SkeletonBooks from '../../../components/Skeleton/SkeletonBooks';
import TitleBar from '../../../components/TitleBar';
import { URLMap } from '../../../constants/urls';
import { getUnits } from '../../../services/book/selectors';
import { showConfirm } from '../../../services/confirm/actions';
import { deleteSelectedBooks, loadItems, selectAllBooks, unhideSelectedBooks } from '../../../services/purchased/hidden/actions';
import { getIsFetchingBooks, getItemsByPage, getTotalCount, getTotalPages } from '../../../services/purchased/hidden/selectors';
import { clearSelectedItems } from '../../../services/selection/actions';
import { getTotalSelectedCount } from '../../../services/selection/selectors';
import BookOutline from '../../../svgs/BookOutline.svg';
import { toFlatten } from '../../../utils/array';
import { ResponsiveBooks } from '../../base/Responsive';

function extractOptions(location) {
  const searchParams = new URLSearchParams(location.search);
  const page = parseInt(searchParams.get('page'), 10) || 1;
  return { page };
}

function makeBackLocation({ location }) {
  if (location.state?.backLocation != null) {
    return location.state.backLocation;
  }
  return {
    pathname: URLMap.main.as,
  };
}

const Hidden = props => {
  const { currentPage, isError, isFetchingBooks, items, location, totalCount, totalPages, totalSelectedCount, units, viewType } = props;

  const {
    dispatchClearSelectedBooks,
    dispatchDeleteSelectedBooks,
    dispatchLoadItems,
    dispatchSelectAllBooks,
    dispatchShowConfirm,
    dispatchUnhideSelectedBooks,
  } = props;

  const { page } = extractOptions(location);

  const [isEditing, setIsEditing] = React.useState(false);
  React.useEffect(() => {
    dispatchClearSelectedBooks();
    dispatchLoadItems(page);
  }, [location]);

  const toggleEditingMode = React.useCallback(() => {
    if (isEditing === true) {
      dispatchClearSelectedBooks();
    }

    setIsEditing(!isEditing);
  }, [dispatchClearSelectedBooks, isEditing]);

  const handleOnClickUnhide = React.useCallback(() => {
    dispatchUnhideSelectedBooks(currentPage);
    dispatchClearSelectedBooks();
    setIsEditing(false);
  }, [dispatchClearSelectedBooks, dispatchUnhideSelectedBooks]);

  const handleOnclickDeleteConfirm = React.useCallback(() => {
    dispatchDeleteSelectedBooks(currentPage);
    dispatchClearSelectedBooks();
    setIsEditing(false);
  }, [dispatchDeleteSelectedBooks, dispatchClearSelectedBooks]);

  const handleOnClickDelete = () => {
    dispatchShowConfirm({
      title: '영구 삭제',
      message: (
        <>
          내 서재에서 영구히 삭제되며 다시 구매해야 이용할 수 있습니다.
          <br />
          <br />
          그래도 삭제하시겠습니까?
        </>
      ),
      confirmLabel: '삭제',
      onClickConfirmButton: handleOnclickDeleteConfirm,
    });
  };
  const handleRefreshClick = () => dispatchLoadItems(currentPage);
  const handleSelectAllBooks = () => dispatchSelectAllBooks(currentPage);
  const linkBuilder = libraryBookData => {
    const to = {
      pathname: URLMap.hiddenUnit.as({ unitId: libraryBookData.unit_id }),
      state: {
        backLocation: location,
      },
    };
    return <Link to={to}>더보기</Link>;
  };

  const makeEditingBarProps = () => {
    const isSelectedAllBooks = totalSelectedCount === items.length;

    return {
      totalSelectedCount,
      isSelectedAllItem: isSelectedAllBooks,
      onClickSelectAllItem: handleSelectAllBooks,
      onClickUnselectAllItem: dispatchClearSelectedBooks,
      onClickSuccessButton: toggleEditingMode,
    };
  };

  const makeActionBarProps = () => {
    const disable = totalSelectedCount === 0;
    return {
      buttonProps: [
        {
          name: '선택 영구 삭제',
          type: ButtonType.DANGER,
          onClick: handleOnClickDelete,
          disable,
        },
        {
          type: ButtonType.SPACER,
        },
        {
          name: '선택 숨김 해제',
          onClick: handleOnClickUnhide,
          disable,
        },
      ],
    };
  };

  const renderTitleBar = () => {
    const titleBarProps = {
      backLocation: makeBackLocation({ location }),
      title: '숨긴 도서 목록',
      showCount: totalCount.itemTotalCount > 0,
      totalCount: totalCount.itemTotalCount,
      edit: true,
      showTools: true,
      toggleEditingMode,
    };

    return <TitleBar {...titleBarProps} />;
  };

  const renderPaginator = () => <ResponsivePaginator currentPage={currentPage} totalPages={totalPages} />;

  const renderBooks = () => {
    const libraryBookDTO = items;
    const showSkeleton = isFetchingBooks && libraryBookDTO.length === 0;

    return showSkeleton ? (
      <SkeletonBooks viewType={viewType} />
    ) : (
      <>
        <Books
          {...{
            libraryBookDTO,
            units,
            isSelectMode: isEditing,
            viewType,
            linkBuilder,
          }}
        />
        {renderPaginator()}
      </>
    );
  };

  const renderMain = () => {
    if (isError) {
      return <BookError onClickRefreshButton={handleRefreshClick} />;
    }

    if (!isFetchingBooks && items.length === 0) {
      return <Empty IconComponent={BookOutline} message="숨긴 도서가 없습니다." />;
    }

    return <ResponsiveBooks>{renderBooks()}</ResponsiveBooks>;
  };

  return (
    <>
      <Helmet>
        <title>숨긴 도서 목록 - 내 서재</title>
      </Helmet>
      <PageRedirect currentPage={currentPage} totalPages={totalPages} />
      <Editable
        allowFixed
        isEditing={isEditing}
        nonEditBar={renderTitleBar()}
        editingBarProps={makeEditingBarProps()}
        actionBarProps={makeActionBarProps()}
      >
        <main>{renderMain()}</main>
      </Editable>
    </>
  );
};

const mapStateToProps = (state, props) => {
  const { location } = props;
  const { page: currentPage } = extractOptions(location);
  const items = getItemsByPage(state, currentPage);
  const units = getUnits(state, toFlatten(items, 'unit_id'));
  const totalCount = getTotalCount(state);
  const totalPages = getTotalPages(state);
  const totalSelectedCount = getTotalSelectedCount(state);
  const isFetchingBooks = getIsFetchingBooks(state);

  return {
    currentPage,
    items,
    units,
    totalCount,
    totalPages,
    totalSelectedCount,
    isFetchingBooks,
    viewType: state.ui.viewType,
    isError: state.ui.isError,
  };
};

const mapDispatchToProps = {
  dispatchShowConfirm: showConfirm,
  dispatchLoadItems: loadItems,
  dispatchSelectAllBooks: selectAllBooks,
  dispatchClearSelectedBooks: clearSelectedItems,
  dispatchUnhideSelectedBooks: unhideSelectedBooks,
  dispatchDeleteSelectedBooks: deleteSelectedBooks,
};

export default connect(mapStateToProps, mapDispatchToProps)(Hidden);
