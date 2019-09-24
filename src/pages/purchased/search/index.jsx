import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { ButtonType } from '../../../components/ActionBar/constants';
import BookDownLoader from '../../../components/BookDownLoader';
import { Books } from '../../../components/Books';
import Editable from '../../../components/Editable';
import Empty from '../../../components/Empty';
import { BookError } from '../../../components/Error';
import PageRedirect from '../../../components/PageRedirect';
import ResponsivePaginator from '../../../components/ResponsivePaginator';
import SearchBar from '../../../components/SearchBar';
import SelectShelfModal from '../../../components/SelectShelfModal';
import SkeletonBooks from '../../../components/Skeleton/SkeletonBooks';
import { UnitType } from '../../../constants/unitType';
import { URLMap } from '../../../constants/urls';
import ViewType from '../../../constants/viewType';
import { getUnits } from '../../../services/book/selectors';
import { downloadSelectedBooks, hideSelectedBooks, loadItems, selectAllBooks } from '../../../services/purchased/search/actions';
import { getIsFetchingBooks, getItemsByPage, getTotalPages } from '../../../services/purchased/search/selectors';
import { clearSelectedItems } from '../../../services/selection/actions';
import { getTotalSelectedCount } from '../../../services/selection/selectors';
import * as shelfActions from '../../../services/shelf/actions';
import SearchIcon from '../../../svgs/Search.svg';
import { toFlatten } from '../../../utils/array';
import { TabBar, TabMenuTypes } from '../../base/LNB';
import { ResponsiveBooks } from '../../base/Responsive';

function extractPageOptions(location) {
  const params = new URLSearchParams(location.search);
  const page = parseInt(params.get('page'), 10) || 1;
  const keyword = params.get('keyword') || '';
  return { page, keyword };
}

function useDispatchOptions(actionDispatcher, options) {
  const { page, keyword } = options;
  return React.useCallback(() => actionDispatcher(options), [actionDispatcher, page, keyword]);
}

function Search(props) {
  const { location, totalPages } = props;
  const {
    dispatchAddSelectedToShelf,
    dispatchClearSelectedBooks,
    dispatchDownloadSelectedBooks,
    dispatchHideSelectedBooks,
    dispatchLoadItems,
    dispatchSelectAllBooks,
  } = props;
  const pageOptions = extractPageOptions(location);
  const { page: currentPage, keyword } = pageOptions;

  const [isEditing, setIsEditing] = React.useState(false);
  const [showShelves, setShowShelves] = React.useState(false);

  const dispatchDownloadSelectedBooksWithOptions = useDispatchOptions(dispatchDownloadSelectedBooks, pageOptions);
  const dispatchHideSelectedBooksWithOptions = useDispatchOptions(dispatchHideSelectedBooks, pageOptions);
  const dispatchSelectAllBooksWithOptions = useDispatchOptions(dispatchSelectAllBooks, pageOptions);
  const handleRefresh = useDispatchOptions(dispatchLoadItems, pageOptions);

  const toggleEditingMode = React.useCallback(() => {
    if (isEditing === true) {
      dispatchClearSelectedBooks();
    }

    setIsEditing(!isEditing);
  }, [dispatchClearSelectedBooks, isEditing]);

  const handleHideClick = React.useCallback(() => {
    dispatchHideSelectedBooksWithOptions();
    dispatchClearSelectedBooks();
    setIsEditing(false);
  }, [dispatchClearSelectedBooks, dispatchHideSelectedBooksWithOptions]);

  const handleDownloadClick = React.useCallback(() => {
    dispatchDownloadSelectedBooksWithOptions();
    dispatchClearSelectedBooks();
    setIsEditing(false);
  }, [dispatchClearSelectedBooks, dispatchDownloadSelectedBooksWithOptions]);

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

  React.useEffect(() => {
    dispatchClearSelectedBooks();
    dispatchLoadItems(pageOptions);
  }, [location]);

  function makeEditingBarProps() {
    const { items, totalSelectedCount } = props;
    const filteredItems = items.filter(item => !UnitType.isCollection(item.unit_type));
    const isSelectedAllBooks = totalSelectedCount === filteredItems.length;

    return {
      totalSelectedCount,
      isSelectedAllItem: isSelectedAllBooks,
      onClickSelectAllItem: dispatchSelectAllBooksWithOptions,
      onClickUnselectAllItem: dispatchClearSelectedBooks,
      onClickSuccessButton: toggleEditingMode,
    };
  }

  function makeActionBarProps() {
    const { totalSelectedCount } = props;
    const disable = totalSelectedCount === 0;

    return {
      buttonProps: [
        {
          name: '책장에 추가',
          onClick: handleAddToShelf,
          disable,
        },
        {
          name: '숨기기',
          onClick: handleHideClick,
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
      ],
    };
  }

  function renderSearchBar() {
    const searchBarProps = { keyword, toggleEditingMode };
    return <SearchBar isSearchPage {...searchBarProps} />;
  }

  function renderPaginator() {
    return <ResponsivePaginator currentPage={currentPage} totalPages={totalPages} />;
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
    const { items: libraryBookDTO, units, isFetchingBooks, viewType } = props;
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

    return <ResponsiveBooks>{renderBooks()}</ResponsiveBooks>;
  }

  let title = `'${keyword}' 검색 결과 - 내 서재`;
  if (!keyword) {
    title = '검색 - 내 서재';
  }

  if (showShelves) {
    return (
      <>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <PageRedirect currentPage={currentPage} totalPages={totalPages} />
        <SelectShelfModal onBackClick={handleShelfBackClick} onShelfSelect={handleShelfSelect} />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <PageRedirect currentPage={currentPage} totalPages={totalPages} />
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

const mapStateToProps = (state, props) => {
  const pageOptions = extractPageOptions(props.location);
  const totalPages = getTotalPages(state, pageOptions);
  const items = getItemsByPage(state, pageOptions);
  const units = getUnits(state, toFlatten(items, 'unit_id'));
  const totalSelectedCount = getTotalSelectedCount(state);
  const isFetchingBooks = getIsFetchingBooks(state);

  return {
    totalPages,
    items,
    units,
    totalSelectedCount,
    isFetchingBooks,
    viewType: ViewType.LANDSCAPE,
    isError: state.ui.isError,
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
