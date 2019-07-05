/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { ButtonType } from '../../../components/ActionBar/constants';
import { ACTION_BAR_HEIGHT } from '../../../components/ActionBar/styles';
import BookDownLoader from '../../../components/BookDownLoader';
import { Books } from '../../../components/Books';
import Editable from '../../../components/Editable';
import Empty from '../../../components/Empty';
import { BookError } from '../../../components/Error';
import ResponsivePaginator from '../../../components/ResponsivePaginator';
import SearchBar from '../../../components/SearchBar';
import SelectShelfModal from '../../../components/SelectShelfModal';
import SkeletonBooks from '../../../components/Skeleton/SkeletonBooks';
import * as featureIds from '../../../constants/featureIds';
import { UnitType } from '../../../constants/unitType';
import { URLMap } from '../../../constants/urls';
import ViewType from '../../../constants/viewType';
import { getBooks, getUnits } from '../../../services/book/selectors';
import * as featureSelectors from '../../../services/feature/selectors';
import { getRecentlyUpdatedData } from '../../../services/purchased/common/selectors';
import { downloadSelectedBooks, hideSelectedBooks, loadItems, selectAllBooks } from '../../../services/purchased/search/actions';
import { getIsFetchingBooks, getItemsByPage, getTotalPages } from '../../../services/purchased/search/selectors';
import { clearSelectedItems } from '../../../services/selection/actions';
import { getTotalSelectedCount } from '../../../services/selection/selectors';
import * as shelfActions from '../../../services/shelf/actions';
import SearchIcon from '../../../svgs/Search.svg';
import { toFlatten } from '../../../utils/array';
import { TabBar, TabMenuTypes } from '../../base/LNB';
import { ResponsiveBooks } from '../../base/Responsive';

const paddingForPagination = {
  paddingBottom: ACTION_BAR_HEIGHT,
};

function Search(props) {
  const { location, totalPages } = props;
  const {
    dispatchAddSelectedToShelf,
    dispatchClearSelectedBooks,
    dispatchDownloadSelectedBooks,
    dispatchHideSelectedBooks,
    dispatchLoadItems,
  } = props;
  const urlParams = new URLSearchParams(location.search);
  const currentPage = parseInt(urlParams.get('page'), 10) || 1;
  const keyword = urlParams.get('keyword') || '';

  const [isEditing, setIsEditing] = React.useState(false);
  const [showShelves, setShowShelves] = React.useState(false);

  const toggleEditingMode = React.useCallback(
    () => {
      if (isEditing === true) {
        dispatchClearSelectedBooks();
      }

      setIsEditing(!isEditing);
    },
    [dispatchClearSelectedBooks, isEditing],
  );

  const handleHideClick = React.useCallback(
    () => {
      dispatchHideSelectedBooks();
      dispatchClearSelectedBooks();
      setIsEditing(false);
    },
    [dispatchClearSelectedBooks, dispatchHideSelectedBooks],
  );

  const handleDownloadClick = React.useCallback(
    () => {
      dispatchDownloadSelectedBooks();
      dispatchClearSelectedBooks();
      setIsEditing(false);
    },
    [dispatchClearSelectedBooks, dispatchDownloadSelectedBooks],
  );

  const handleAddToShelf = React.useCallback(() => setShowShelves(true), []);
  const handleShelfBackClick = React.useCallback(() => setShowShelves(false), []);

  const handleShelfSelect = React.useCallback(
    uuid => {
      dispatchAddSelectedToShelf({
        uuid,
        onComplete: () => {
          setIsEditing(false);
          setShowShelves(false);
          dispatchClearSelectedBooks();
        },
      });
    },
    [dispatchAddSelectedToShelf, dispatchClearSelectedBooks],
  );

  const handleRefresh = React.useCallback(
    () => {
      dispatchLoadItems({ page: currentPage, keyword });
    },
    [currentPage, dispatchLoadItems, keyword],
  );

  function makeEditingBarProps() {
    const { isSyncShelfEnabled, items, totalSelectedCount, dispatchSelectAllBooks } = props;
    const filteredItems = isSyncShelfEnabled ? items.filter(item => !UnitType.isCollection(item.unit_type)) : items;
    const isSelectedAllBooks = totalSelectedCount === filteredItems.length;

    return {
      totalSelectedCount,
      isSelectedAllItem: isSelectedAllBooks,
      onClickSelectAllItem: dispatchSelectAllBooks,
      onClickUnselectAllItem: dispatchClearSelectedBooks,
      onClickSuccessButton: toggleEditingMode,
    };
  }

  function makeActionBarProps() {
    const { isSyncShelfEnabled, totalSelectedCount } = props;
    const disable = totalSelectedCount === 0;

    let buttonProps;
    if (isSyncShelfEnabled) {
      buttonProps = [
        {
          name: '숨기기',
          onClick: handleHideClick,
          disable,
        },
        {
          name: '책장에 추가',
          onClick: handleAddToShelf,
          disable,
        },
        {
          type: ButtonType.SPACER,
        },
        {
          name: '다운로드',
          onClick: handleDownloadClick,
          disable,
        },
      ];
    } else {
      buttonProps = [
        {
          name: '선택 숨기기',
          onClick: handleHideClick,
          disable,
        },
        {
          type: ButtonType.SPACER,
        },
        {
          name: '선택 다운로드',
          onClick: handleDownloadClick,
          disable,
        },
      ];
    }

    return { buttonProps };
  }

  function renderSearchBar() {
    const searchBarProps = { keyword, toggleEditingMode };
    return <SearchBar isSearchPage {...searchBarProps} />;
  }

  function renderPaginator() {
    return (
      <ResponsivePaginator
        currentPage={currentPage}
        totalPages={totalPages}
        href={URLMap.search.href}
        as={URLMap.search.as}
        query={{ keyword }}
      />
    );
  }

  const linkBuilder = React.useCallback(
    libraryBookData => {
      const params = new URLSearchParams();
      params.append('keyword', keyword);
      const search = params.toString();

      // TODO: react-router 5.1 나오면 함수로 바꿀 것
      const to = {
        pathname: URLMap.searchUnit.as({ unitId: libraryBookData.unit_id }),
        search: search === '' ? '' : `?${search}`,
        state: {
          backLocation: location,
        },
      };
      return <Link to={to}>더보기</Link>;
    },
    [keyword, location],
  );

  function renderBooks() {
    const { items: libraryBookDTO, units, recentlyUpdatedMap, isFetchingBooks, viewType } = props;
    const showSkeleton = isFetchingBooks && libraryBookDTO.length === 0;

    if (showSkeleton) {
      return <SkeletonBooks viewType={viewType} />;
    }

    return (
      <>
        <Books
          {...{
            libraryBookDTO,
            units,
            isSelectMode: isEditing,
            viewType,
            linkBuilder,
          }}
          recentlyUpdatedMap={recentlyUpdatedMap}
        />
        {renderPaginator()}
      </>
    );
  }

  function renderMain() {
    const { items, isError, isFetchingBooks } = props;

    if (isError) {
      return <BookError onClickRefreshButton={handleRefresh} />;
    }

    if (!isFetchingBooks && items.length === 0) {
      let message = `'${keyword}'에 대한 검색 결과가 없습니다.`;
      if (!keyword) {
        message = '검색어를 입력해주세요.';
      }

      return <Empty IconComponent={SearchIcon} iconWidth={38} message={message} />;
    }

    return (
      <div css={paddingForPagination}>
        <ResponsiveBooks>{renderBooks()}</ResponsiveBooks>
      </div>
    );
  }

  let title = `'${keyword}' 검색 결과 - 내 서재`;
  if (!keyword) {
    title = '검색 - 내 서재';
  }

  let redirection = null;
  if (totalPages > 0) {
    const realPage = Math.max(1, Math.min(totalPages, currentPage));
    if (currentPage !== realPage) {
      const newUrlParams = new URLSearchParams(location.search);
      newUrlParams.set('page', realPage);
      const newSearch = newUrlParams.toString();
      const to = {
        ...location,
        search: newSearch !== '' ? `?${newSearch}` : '',
      };
      redirection = <Redirect to={to} />;
    }
  }

  if (showShelves) {
    return (
      <>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        {redirection}
        <SelectShelfModal onBackClick={handleShelfBackClick} onShelfSelect={handleShelfSelect} />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {redirection}
      <TabBar activeMenu={TabMenuTypes.ALL_BOOKS} />
      <Editable
        allowFixed
        isEditing={isEditing}
        nonEditBar={renderSearchBar()}
        editingBarProps={makeEditingBarProps()}
        actionBarProps={makeActionBarProps()}
      >
        <main>{renderMain()}</main>
        <BookDownLoader />
      </Editable>
    </>
  );
}

Search.prepare = ({ dispatch, location }) => {
  const params = new URLSearchParams(location.search);
  const page = parseInt(params.get('page'), 10) || 1;
  const keyword = params.get('keyword') || '';
  dispatch(clearSelectedItems());
  dispatch(loadItems({ page, keyword }));
};

const mapStateToProps = state => {
  const totalPages = getTotalPages(state);
  const items = getItemsByPage(state);
  const units = getUnits(state, toFlatten(items, 'unit_id'));
  const totalSelectedCount = getTotalSelectedCount(state);
  const isFetchingBooks = getIsFetchingBooks(state);

  const books = getBooks(state, toFlatten(items, 'b_id'));
  const lastBookIds = toFlatten(Object.values(books), 'series.property.opened_last_volume_id', true);
  const recentlyUpdatedMap = getRecentlyUpdatedData(state, lastBookIds);

  const isSyncShelfEnabled = featureSelectors.getIsFeatureEnabled(state, featureIds.SYNC_SHELF);
  return {
    totalPages,
    items,
    units,
    recentlyUpdatedMap,
    totalSelectedCount,
    isFetchingBooks,
    viewType: ViewType.LANDSCAPE,
    isError: state.ui.isError,
    isSyncShelfEnabled,
  };
};

const mapDispatchToProps = {
  dispatchLoadItems: loadItems,
  dispatchSelectAllBooks: selectAllBooks,
  dispatchClearSelectedBooks: clearSelectedItems,
  dispatchHideSelectedBooks: hideSelectedBooks,
  dispatchDownloadSelectedBooks: downloadSelectedBooks,
  dispatchAddSelectedToShelf: shelfActions.addSelectedToShelf,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Search);
