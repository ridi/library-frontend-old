import React from 'react';
import { connect } from 'react-redux';

import BottomActionBar from '../../../../components/BottomActionBar';
import { ButtonType } from '../../../../components/ActionBar/constants';
import Empty from '../../../../components/Empty';
import FixedToolbarView from '../../../../components/FixedToolbarView';
import PageNavigationBar, { NavigationBarColor } from '../../../../components/PageNavigationBar';
import { ResponsivePaginatorWithHandler } from '../../../../components/ResponsivePaginator';
import SkeletonBooks from '../../../../components/Skeleton/SkeletonBooks';
import { LIBRARY_ITEMS_LIMIT_PER_PAGE } from '../../../../constants/page';
import ViewType from '../../../../constants/viewType';
import * as searchRequests from '../../../../services/purchased/search/requests';
import * as selectionActions from '../../../../services/selection/actions';
import * as selectionSelectors from '../../../../services/selection/selectors';
import * as shelfSelectors from '../../../../services/shelf/selectors';
import SearchIcon from '../../../../svgs/Search.svg';
import * as paginationUtils from '../../../../utils/pagination';
import { ResponsiveBooks } from '../../../base/Responsive';
import SearchBar from './SearchBar';
import SearchBooks from './SearchBooks';

function SearchModal({ clearSelectedItems, isSelected, onAddSelected, onBackClick, shelfTitle, uuid }) {
  const [keyword, setKeyword] = React.useState('');
  const [isSearching, setSearching] = React.useState(false);
  const [searchItems, setSearchItems] = React.useState(null);
  const searchItemRequestId = React.useRef(0);
  const [totalItemCount, setTotalItemCount] = React.useState(null);
  const totalItemCountRequestId = React.useRef(0);
  const [page, setPage] = React.useState(1);
  const totalPages = totalItemCount == null ? null : paginationUtils.calcPage(totalItemCount, LIBRARY_ITEMS_LIMIT_PER_PAGE);

  const handleSearchClear = React.useCallback(() => {
    setSearching(false);
    setSearchItems(null);
    setTotalItemCount(null);
    clearSelectedItems();
  }, []);
  const handleSearchConfirm = React.useCallback(
    async () => {
      const newSearching = keyword !== '';
      const newPage = 1;
      setSearching(newSearching);
      setSearchItems(null);
      setTotalItemCount(null);
      setPage(newPage);
      clearSelectedItems();

      searchItemRequestId.current += 1;
      totalItemCountRequestId.current += 1;

      if (!newSearching) {
        return;
      }

      const searchItemRid = searchItemRequestId.current;
      const totalItemCountRid = totalItemCountRequestId.current;
      await Promise.all([
        searchRequests.fetchSearchItems(keyword, newPage).then(({ items }) => {
          if (searchItemRid === searchItemRequestId.current) {
            setSearchItems(items);
          }
        }),
        searchRequests.fetchSearchItemsTotalCount(keyword).then(({ unit_total_count: totalCount }) => {
          if (totalItemCountRid === totalItemCountRequestId.current) {
            setTotalItemCount(totalCount);
          }
        }),
      ]);
    },
    [keyword],
  );
  const handlePageChange = React.useCallback(
    async newPage => {
      setSearchItems(null);
      setPage(newPage);
      clearSelectedItems();

      searchItemRequestId.current += 1;
      const searchItemRid = searchItemRequestId.current;
      const { items } = await searchRequests.fetchSearchItems(keyword, newPage);
      if (searchItemRid === searchItemRequestId.current) {
        setSearchItems(items);
      }

      window.scrollTo(0, 0);
    },
    [keyword],
  );
  const handleAddToShelf = React.useCallback(() => onAddSelected(uuid), [uuid]);

  function renderSearchBar() {
    return (
      <SearchBar
        isSearching={isSearching}
        keyword={keyword}
        onClear={handleSearchClear}
        onConfirm={handleSearchConfirm}
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
    if (!isSearching) {
      return <Empty IconComponent={SearchIcon} iconWidth={38} message="검색어를 입력해주세요." />;
    }
    if (searchItems == null) {
      return (
        <ResponsiveBooks>
          <SkeletonBooks viewType={ViewType.LANDSCAPE} />
        </ResponsiveBooks>
      );
    }
    if (searchItems.length === 0) {
      return <Empty IconComponent={SearchIcon} iconWidth={38} message={`'${keyword}'에 대한 검색 결과가 없습니다.`} />;
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
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchModal);
