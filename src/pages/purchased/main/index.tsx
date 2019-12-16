import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { observer } from 'mobx-react';

import { selectionActions } from 'services/selection/reducers';

import { ButtonType } from '../../../components/ActionBar/constants';
import { MobxBooks } from '../../../components/Books';
import Editable from '../../../components/Editable';
import Empty from '../../../components/Empty';
import { BookError } from '../../../components/Error';
import PageRedirect from '../../../components/PageRedirect';
import ResponsivePaginator from '../../../components/ResponsivePaginator';
import SearchBar from '../../../components/SearchBar';
import SkeletonBooks from '../../../components/Skeleton/SkeletonBooks';
import { ListInstructions } from '../../../constants/listInstructions';
import { OrderOptions } from '../../../constants/orderOptions';
import { BooksPageKind, PageType, URLMap } from '../../../constants/urls';
import ViewType from '../../../constants/viewType';
import { updateCategories, updateServiceTypes } from '../../../services/purchased/filter/actions';
import { getFilterOptions } from '../../../services/purchased/filter/selectors';
import { downloadSelectedBooks, hideSelectedBooks, selectAllBooks } from '../../../services/purchased/main/actions';
import { getTotalSelectedCount } from '../../../services/selection/selectors';
import BookOutline from '../../../svgs/BookOutline.svg';
import SearchIcon from '../../../svgs/Search.svg';
import Footer from '../../base/Footer';
import { TabBar, TabMenuTypes } from '../../base/LNB';
import { ResponsiveBooks } from '../../base/Responsive';
import { useItemStore } from 'src/models/items';

interface MainPageOptions {
  kind: BooksPageKind.MAIN;
  page: number;
  orderBy: string;
  orderDirection: string;
  filter: number | string;
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
  const orderBy = urlParams.get('order_by') || OrderOptions.DEFAULT.orderBy;
  const orderDirection = urlParams.get('order_direction') || OrderOptions.DEFAULT.orderDirection;
  const keyword = urlParams.get('keyword') || '';
  const urlFilterParam = urlParams.get('filter');
  const filter = parseInt(urlFilterParam, 10) || urlFilterParam || null;

  switch (path) {
    case URLMap[PageType.INDEX].path:
    case URLMap[PageType.MAIN].path:
      return {
        kind: BooksPageKind.MAIN,
        page,
        orderBy,
        orderDirection,
        filter,
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
  const { kind, keyword, page, orderBy, orderDirection, filter } = options;
  return React.useCallback(() => actionDispatcher(options), [actionDispatcher, keyword, kind, page, orderBy, orderDirection, filter]);
}

function PurchasedMain(props) {
  const itemStore = useItemStore();
  const { location, match } = props;
  const {
    dispatchClearSelectedBooks,
    dispatchDownloadSelectedBooks,
    dispatchHideSelectedBooks,
    dispatchLoadItems,
    dispatchSelectAllBooks,
    dispatchUpdateCategories,
    dispatchUpdateServiceTypes,
  } = props;

  const pageOptions = extractPageOptions({ location, ...match });
  const currentPage = pageOptions.page;
  const pageGroup = itemStore.pageGroupOf(pageOptions);
  const listInstruction = pageGroup == null ? ListInstructions.SKELETON : pageGroup.listInstruction(currentPage);
  const totalPages = pageGroup?.totalPages || 0;

  const [isEditing, setIsEditing] = React.useState(false);

  const dispatchDownloadSelectedBooksWithOptions = useDispatchOptions(dispatchDownloadSelectedBooks, pageOptions);
  const dispatchHideSelectedBooksWithOptions = useDispatchOptions(dispatchHideSelectedBooks, pageOptions);
  const dispatchSelectAllBooksWithOptions = useDispatchOptions(dispatchSelectAllBooks, pageOptions);
  const handleRefresh = useDispatchOptions(dispatchLoadItems, pageOptions);

  const linkBuilder = React.useCallback(
    item => {
      const unitId = item.unit.id;
      let pathname = '';
      const params = new URLSearchParams();
      if (pageOptions.kind === BooksPageKind.MAIN) {
        pathname = URLMap.mainUnit.as({ unitId });

        const { orderBy, orderDirection } = pageOptions;
        const order = OrderOptions.toKey(orderBy, orderDirection);
        if (OrderOptions.EXPIRE_DATE.key === order || OrderOptions.EXPIRED_BOOKS_ONLY.key === order) {
          params.append('order_by', orderBy);
          params.append('order_direction', orderDirection);
        }
      } else {
        pathname = URLMap.searchUnit.as({ unitId });
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
    const pageGroup = itemStore.getOrCreatePageGroup(pageOptions);
    pageGroup.loadPage(pageOptions.page);
    if (pageOptions.kind === BooksPageKind.MAIN) {
      dispatchUpdateCategories();
      dispatchUpdateServiceTypes();
    }
  }, [location]);

  function renderPaginator() {
    return <ResponsivePaginator currentPage={currentPage} totalPages={totalPages} />;
  }

  function renderBooks() {
    const { viewType } = props;

    if (pageGroup == null || listInstruction === ListInstructions.SKELETON) {
      return <SkeletonBooks viewType={viewType} />;
    }

    return (
      <>
        <MobxBooks
          {...{
            page: pageGroup.pages.get(String(currentPage)),
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
      const order = OrderOptions.toKey(pageOptions.orderBy, pageOptions.orderDirection);
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
        filter: pageOptions.filter,
        filterOptions,
        orderOptions,
        orderBy: pageOptions.orderBy,
        orderDirection: pageOptions.orderDirection,
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
    const { totalSelectedCount } = props;
    const pageItemCount = pageGroup?.pages.get(String(currentPage))?.items.length || 0;
    const isSelectedAllBooks = totalSelectedCount === pageItemCount;

    return {
      totalSelectedCount,
      isSelectedAllItem: isSelectedAllBooks,
      onClickSelectAllItem: dispatchSelectAllBooksWithOptions,
      onClickDeselectAllItem: dispatchClearSelectedBooks,
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

  function makeActionBarProps() {
    const { totalSelectedCount } = props;
    const disable = totalSelectedCount === 0;

    return {
      buttonProps: [
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
    title = '모든 책';
  } else if (pageOptions.keyword !== '') {
    title = `'${pageOptions.keyword}' 검색 결과`;
  } else {
    title = '검색';
  }

  return (
    <>
      <Helmet>
        <title>{title} - 내 서재</title>
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
    </>
  );
}

const mapStateToProps = (state, props) => {
  const { location, match } = props;
  const pageOptions = extractPageOptions({ location, ...match });
  const filterOptions = getFilterOptions(state);
  const totalSelectedCount = getTotalSelectedCount(state);

  return {
    filterOptions,
    totalSelectedCount,
    viewType: pageOptions.kind === BooksPageKind.MAIN ? state.ui.viewType : ViewType.LANDSCAPE,
    isError: state.ui.isError,
  };
};

const mapDispatchToProps = {
  dispatchSelectAllBooks: selectAllBooks,
  dispatchClearSelectedBooks: selectionActions.clearSelectedItems,
  dispatchHideSelectedBooks: hideSelectedBooks,
  dispatchDownloadSelectedBooks: downloadSelectedBooks,
  dispatchUpdateCategories: updateCategories,
  dispatchUpdateServiceTypes: updateServiceTypes,
};

export default connect(mapStateToProps, mapDispatchToProps)(observer(PurchasedMain));
