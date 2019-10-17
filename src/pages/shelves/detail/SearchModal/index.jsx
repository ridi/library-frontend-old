import React from 'react';
import { connect } from 'react-redux';

import * as filterActions from 'services/purchased/filter/actions';
import * as mainRequests from 'services/purchased/main/requests';
import * as selectionActions from 'services/selection/actions';
import * as selectionSelectors from 'services/selection/selectors';
import * as shelfSelectors from 'services/shelf/selectors';

import BottomActionBar from '../../../../components/BottomActionBar';
import { ButtonType } from '../../../../components/ActionBar/constants';
import Empty from '../../../../components/Empty';
import FixedToolbarView from '../../../../components/FixedToolbarView';
import PageNavigationBar, { NavigationBarColor } from '../../../../components/PageNavigationBar';
import { ResponsivePaginatorWithHandler } from '../../../../components/ResponsivePaginator';
import SkeletonBooks from '../../../../components/Skeleton/SkeletonBooks';
import { LIBRARY_ITEMS_LIMIT_PER_PAGE } from '../../../../constants/page';
import { BooksPageKind } from '../../../../constants/urls';
import ViewType from '../../../../constants/viewType';
import BookOutline from '../../../../svgs/BookOutline.svg';
import SearchIcon from '../../../../svgs/Search.svg';
import * as paginationUtils from '../../../../utils/pagination';
import { ResponsiveBooks } from '../../../base/Responsive';
import SearchBar from './SearchBar';
import SearchBooks from './SearchBooks';

function SearchModal({ clearSelectedItems, isSelected, onAddSelected, onBackClick, shelfTitle, updateCategories, uuid }) {
  const [categoryFilter, setCategoryFilter] = React.useState(null);
  const [keyword, setKeyword] = React.useState('');
  const [searchingKeyword, setSearchingKeyword] = React.useState('');
  const [searchItems, setSearchItems] = React.useState(null);
  const searchItemRequestId = React.useRef(0);
  const [totalItemCount, setTotalItemCount] = React.useState(null);
  const totalItemCountRequestId = React.useRef(0);
  const [page, setPage] = React.useState(1);
  const totalPages = totalItemCount == null ? null : paginationUtils.calcPage(totalItemCount, LIBRARY_ITEMS_LIMIT_PER_PAGE);

  const handleSearchConfirm = React.useCallback(() => {
    setSearchingKeyword(keyword);
  }, [keyword]);

  const handleSearchClear = React.useCallback(() => {
    setSearchingKeyword('');
    setKeyword('');
  }, []);

  const handlePageChange = React.useCallback(
    async newPage => {
      const processedKeyword = searchingKeyword === '' ? undefined : searchingKeyword;
      setSearchItems(null);
      setPage(newPage);
      clearSelectedItems();
      window.scrollTo(0, 0);

      searchItemRequestId.current += 1;
      const searchItemRid = searchItemRequestId.current;
      const { items } = await mainRequests.fetchMainItems({
        kind: BooksPageKind.SEARCH,
        keyword: processedKeyword,
        categoryFilter,
        page: newPage,
      });
      if (searchItemRid === searchItemRequestId.current) {
        setSearchItems(items);
      }
    },
    [categoryFilter, keyword],
  );

  const handleAddToShelf = React.useCallback(() => onAddSelected(uuid), [uuid]);

  React.useEffect(() => {
    const processedKeyword = searchingKeyword === '' ? undefined : searchingKeyword;
    const newPage = 1;
    setSearchItems(null);
    setTotalItemCount(null);
    setPage(newPage);
    clearSelectedItems();

    searchItemRequestId.current += 1;
    totalItemCountRequestId.current += 1;

    const searchItemRid = searchItemRequestId.current;
    const totalItemCountRid = totalItemCountRequestId.current;

    const mainItemsPromise = mainRequests
      .fetchMainItems({ kind: BooksPageKind.SEARCH, keyword: processedKeyword, categoryFilter, page: newPage })
      .then(({ items }) => {
        if (searchItemRid === searchItemRequestId.current) {
          setSearchItems(items);
        }
      });
    const mainItemsCountPromise = mainRequests
      .fetchMainItemsTotalCount({ kind: BooksPageKind.SEARCH, keyword: processedKeyword, categoryFilter })
      .then(({ unit_total_count: totalCount }) => {
        if (totalItemCountRid === totalItemCountRequestId.current) {
          setTotalItemCount(totalCount);
        }
      });
    Promise.all([mainItemsPromise, mainItemsCountPromise]);
  }, [categoryFilter, searchingKeyword]);

  React.useEffect(() => {
    updateCategories();
  }, []);

  function renderSearchBar() {
    return (
      <SearchBar
        isSearching={searchingKeyword !== ''}
        filter={categoryFilter}
        keyword={keyword}
        onClear={handleSearchClear}
        onConfirm={handleSearchConfirm}
        onFilterChange={setCategoryFilter}
        onKeywordChange={setKeyword}
      />
    );
  }

  function renderActionBar() {
    const buttons = [{ type: ButtonType.SPACER }, { name: '추가', onClick: handleAddToShelf, disable: !isSelected }];
    return <BottomActionBar buttonProps={buttons} />;
  }

  function renderPaginator() {
    return <ResponsivePaginatorWithHandler currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />;
  }

  function renderBooks() {
    return (
      <>
        <SearchBooks items={searchItems} />
        {renderPaginator()}
      </>
    );
  }

  function renderMain() {
    if (searchItems == null) {
      return (
        <ResponsiveBooks>
          <SkeletonBooks viewType={ViewType.LANDSCAPE} />
        </ResponsiveBooks>
      );
    }
    if (searchItems.length === 0) {
      let message;
      let iconWidth;
      let icon;
      if (searchingKeyword === '') {
        message = '구매/대여하신 책이 없습니다.';
        iconWidth = 30;
        icon = BookOutline;
      } else {
        message = `'${searchingKeyword}'에 대한 검색 결과가 없습니다.`;
        iconWidth = 38;
        icon = SearchIcon;
      }
      return <Empty IconComponent={icon} iconWidth={iconWidth} message={message} />;
    }
    return <ResponsiveBooks>{renderBooks()}</ResponsiveBooks>;
  }

  return (
    <>
      <PageNavigationBar color={NavigationBarColor.BLUE} onBackClick={onBackClick}>
        ‘{shelfTitle}’에 추가
      </PageNavigationBar>
      <FixedToolbarView allowFixed toolbar={renderSearchBar()} actionBar={renderActionBar()}>
        <main>{renderMain()}</main>
      </FixedToolbarView>
    </>
  );
}

function mapStateToProps(state, props) {
  return {
    shelfTitle: shelfSelectors.getShelfName(state, props.uuid),
    isSelected: selectionSelectors.getTotalSelectedCount(state) !== 0,
  };
}

const mapDispatchToProps = {
  clearSelectedItems: selectionActions.clearSelectedItems,
  updateCategories: filterActions.updateCategories,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchModal);
