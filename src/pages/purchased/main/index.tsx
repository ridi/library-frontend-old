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
import { ListInstructions } from '../../../constants/listInstructions';
import { OrderOptions } from '../../../constants/orderOptions';
import { UnitType } from '../../../constants/unitType';
import { BooksPageKind, PageType, URLMap } from '../../../constants/urls';
import ViewType from '../../../constants/viewType';
import { getUnits } from '../../../services/book/selectors';
import { getFilterOptions } from '../../../services/purchased/filter/selectors';
import { downloadSelectedBooks, hideSelectedBooks, loadItems, selectAllBooks } from '../../../services/purchased/main/actions';
import { getIsFetchingBooks, getItemsByPage, getTotalPages, getUnitIdsByPage } from '../../../services/purchased/main/selectors';
import { clearSelectedItems } from '../../../services/selection/actions';
import { getTotalSelectedCount } from '../../../services/selection/selectors';
import * as shelfActions from '../../../services/shelf/actions';
import BookOutline from '../../../svgs/BookOutline.svg';
import SearchIcon from '../../../svgs/Search.svg';
import Footer from '../../base/Footer';
import { TabBar, TabMenuTypes } from '../../base/LNB';
import { ResponsiveBooks } from '../../base/Responsive';

interface MainPageOptions {
  kind: BooksPageKind.MAIN;
  page: number;
  orderType: string;
  orderBy: string;
  categoryFilter: number;
}

interface SearchPageOptions {
  kind: BooksPageKind.SEARCH;
  keyword: string;
  page: number;
}

type PageOptions = MainPageOptions | SearchPageOptions;

function extractPageOptions({ location, path }): PageOptions {
  const urlParams = new URLSearchParams(location.search);
  const page = parseInt(urlParams.get('page'), 10) || 1;
  const orderType = urlParams.get('order_type') || OrderOptions.DEFAULT.orderType;
  const orderBy = urlParams.get('order_by') || OrderOptions.DEFAULT.orderBy;
  const categoryFilter = parseInt(urlParams.get('filter'), 10) || null;
  const keyword = urlParams.get('keyword') || '';

  switch (path) {
    case URLMap[PageType.INDEX].path:
    case URLMap[PageType.MAIN].path:
      return {
        kind: BooksPageKind.MAIN,
        page,
        orderType,
        orderBy,
        categoryFilter,
      };
    case URLMap[PageType.SEARCH].path:
      return {
        kind: BooksPageKind.SEARCH,
        keyword,
        page,
      };
    default:
      throw new Error('Invalid page for Main');
  }
}

function useDispatchOptions(actionDispatcher, options) {
  const { kind, keyword, page, orderType, orderBy, categoryFilter } = options;
  return React.useCallback(() => actionDispatcher(options), [actionDispatcher, keyword, kind, page, orderType, orderBy, categoryFilter]);
}

function PurchasedMain(props) {
  const { listInstruction, location, match, totalPages } = props;
  const {
    dispatchAddSelectedToShelf,
    dispatchClearSelectedBooks,
    dispatchDownloadSelectedBooks,
    dispatchHideSelectedBooks,
    dispatchLoadItems,
    dispatchSelectAllBooks,
  } = props;

  const pageOptions = extractPageOptions({ location, ...match });
  const currentPage = pageOptions.page;

  const [isEditing, setIsEditing] = React.useState(false);
  const [showShelves, setShowShelves] = React.useState(false);

  const dispatchDownloadSelectedBooksWithOptions = useDispatchOptions(dispatchDownloadSelectedBooks, pageOptions);
  const dispatchHideSelectedBooksWithOptions = useDispatchOptions(dispatchHideSelectedBooks, pageOptions);
  const dispatchSelectAllBooksWithOptions = useDispatchOptions(dispatchSelectAllBooks, pageOptions);
  const handleRefresh = useDispatchOptions(dispatchLoadItems, pageOptions);

  const linkBuilder = React.useCallback(
    libraryBookData => {
      let pathname = '';
      const params = new URLSearchParams();
      if (pageOptions.kind === BooksPageKind.MAIN) {
        pathname = URLMap.mainUnit.as({ unitId: libraryBookData.unit_id });

        const { orderType, orderBy } = pageOptions;
        const order = OrderOptions.toKey(orderType, orderBy);
        if (OrderOptions.EXPIRE_DATE.key === order || OrderOptions.EXPIRED_BOOKS_ONLY.key === order) {
          params.append('order_type', orderType);
          params.append('order_by', orderBy);
        }
      } else {
        pathname = URLMap.searchUnit.as({ unitId: libraryBookData.unit_id });
        params.append('keyword', pageOptions.keyword);
      }
      const search = params.toString();

      // TODO: react-router 5.1 나오면 함수로 바꿀 것
      const to = {
        pathname,
        search: search === '' ? '' : `?${search}`,
        state: {
          backLocation: location,
        },
      };

      return <Link to={to}>더보기</Link>;
    },
    [location],
  );

  React.useEffect(() => {
    dispatchClearSelectedBooks();
    dispatchLoadItems(pageOptions);
  }, [location]);

  function renderPaginator() {
    return <ResponsivePaginator currentPage={currentPage} totalPages={totalPages} />;
  }

  function renderBooks() {
    const { items: libraryBookDTO, units, viewType } = props;

    if (listInstruction === ListInstructions.SKELETON) {
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

  function getEmptyMessage() {
    if (pageOptions.kind === BooksPageKind.MAIN) {
      const order = OrderOptions.toKey(pageOptions.orderType, pageOptions.orderBy);
      if (OrderOptions.EXPIRE_DATE.key === order) {
        return '대여 중인 도서가 없습니다.';
      }
      if (OrderOptions.EXPIRED_BOOKS_ONLY.key === order) {
        return '만료된 도서가 없습니다.';
      }
      return '구매/대여하신 책이 없습니다.';
    }
    if (pageOptions.keyword === '') {
      return '검색어를 입력해주세요.';
    }
    return `'${pageOptions.keyword}'에 대한 검색 결과가 없습니다.`;
  }

  function renderMain() {
    const { isError } = props;

    if (isError) {
      return <BookError onClickRefreshButton={handleRefresh} />;
    }

    if (listInstruction === ListInstructions.EMPTY) {
      const emptyProps = {
        message: getEmptyMessage(),
        IconComponent: pageOptions.kind === BooksPageKind.MAIN ? BookOutline : SearchIcon,
        iconWidth: pageOptions.kind === BooksPageKind.MAIN ? 30 : 38,
      };
      return <Empty {...emptyProps} />;
    }

    return <ResponsiveBooks>{renderBooks()}</ResponsiveBooks>;
  }

  const toggleEditingMode = React.useCallback(() => {
    if (isEditing) {
      dispatchClearSelectedBooks();
    }
    setIsEditing(!isEditing);
  }, [dispatchClearSelectedBooks, isEditing]);
  function renderSearchBar() {
    let searchBarProps = {};

    if (pageOptions.kind === BooksPageKind.MAIN) {
      const { filterOptions } = props;
      const orderOptions = OrderOptions.toMainList();

      searchBarProps = {
        filter: pageOptions.categoryFilter,
        filterOptions,
        orderOptions,
        orderBy: pageOptions.orderBy,
        orderType: pageOptions.orderType,
      };
    } else {
      searchBarProps = {
        isSearchPage: true,
        keyword: pageOptions.keyword,
      };
    }

    return <SearchBar toggleEditingMode={toggleEditingMode} {...searchBarProps} />;
  }

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

  let title;
  if (pageOptions.kind === BooksPageKind.MAIN) {
    title = '모든 책 - 내 서재';
  } else if (pageOptions.keyword !== '') {
    title = `'${pageOptions.keyword}' 검색 결과 - 내 서재`;
  } else {
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
        {pageOptions.kind === BooksPageKind.MAIN && <Footer />}
      </Editable>
      <BookDownLoader />
    </>
  );
}

const mapStateToProps = (state, props) => {
  const { location, match } = props;
  const pageOptions = extractPageOptions({ location, ...match });
  const totalPages = getTotalPages(state, pageOptions);
  const filterOptions = getFilterOptions(state);
  const items = getItemsByPage(state, pageOptions);
  const unitIds = getUnitIdsByPage(state, pageOptions);
  const units = getUnits(state, unitIds);
  const totalSelectedCount = getTotalSelectedCount(state);
  const isFetchingBooks = getIsFetchingBooks(state);

  let listInstruction;
  if (items.length !== 0) {
    listInstruction = ListInstructions.SHOW;
  } else if (isFetchingBooks) {
    listInstruction = ListInstructions.SKELETON;
  } else {
    listInstruction = ListInstructions.EMPTY;
  }
  return {
    totalPages,
    filterOptions,
    items,
    units,
    totalSelectedCount,
    listInstruction,
    viewType: pageOptions.kind === BooksPageKind.MAIN ? state.ui.viewType : ViewType.LANDSCAPE,
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
)(PurchasedMain);
