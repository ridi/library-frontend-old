/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import React from 'react';
import { connect } from 'react-redux';

import BottomActionBar from '../../../components/BottomActionBar';
import { ButtonType } from '../../../components/ActionBar/constants';
import { ACTION_BAR_HEIGHT } from '../../../components/ActionBar/styles';
import Empty from '../../../components/Empty';
import FixedToolbarView from '../../../components/FixedToolbarView';
import FlexBar from '../../../components/FlexBar';
import { ResponsivePaginatorWithHandler } from '../../../components/ResponsivePaginator';
import SearchBox from '../../../components/SearchBox';
import SkeletonBooks from '../../../components/Skeleton/SkeletonBooks';
import { LIBRARY_ITEMS_LIMIT_PER_PAGE } from '../../../constants/page';
import ViewType from '../../../constants/viewType';
import * as searchRequests from '../../../services/purchased/search/requests';
import * as selectionActions from '../../../services/selection/actions';
import * as selectionSelectors from '../../../services/selection/selectors';
import * as shelfSelectors from '../../../services/shelf/selectors';
import ArrowLeft from '../../../svgs/ArrowLeft.svg';
import SearchIcon from '../../../svgs/Search.svg';
import * as paginationUtils from '../../../utils/pagination';
import Responsive, { ResponsiveBooks } from '../../base/Responsive';
import SearchBooks from './SearchBooks';

const navigationBarStyles = {
  wrapper: css`
    background-color: #0077d9;
    width: 100%;
  `,
  bar: css`
    height: 46px;
    display: flex;
    align-items: center;
  `,
  iconWrapper: css`
    display: block;
    padding: 13px 10px 13px 0;
  `,
  icon: css`
    width: 16px;
    height: 16px;
    fill: white;
  `,
  title: css`
    font-size: 16px;
    font-weight: bold;
    color: white;
    height: 30px;
    line-height: 30px;
  `,
};

const searchBarStyles = {
  bar: css`
    border-bottom: 1px solid #d1d5d9;
    box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.04);
    background-color: #f3f4f5;
  `,
  cancelButton: css`
    display: block;
    margin-left: 14px;
    border-radius: 4px;
    box-shadow: 1px 1px 1px 0 rgba(0, 0, 0, 0.05);
    background-color: white;
    border: 1px solid #d1d5d9;
    width: 50px;
    height: 28px;
    line-height: 28px;
    font-size: 13px;
    font-weight: bold;
    text-align: center;
    color: #808991;
  `,
};

const mainStyles = {
  paddingForPagination: css`
    padding-bottom: ${ACTION_BAR_HEIGHT}px;
  `,
};

function NavigationBar({ shelfTitle, onBackClick }) {
  return (
    <Responsive css={navigationBarStyles.wrapper}>
      <div css={navigationBarStyles.bar}>
        <button type="button" css={navigationBarStyles.iconWrapper} onClick={onBackClick}>
          <ArrowLeft css={navigationBarStyles.icon} />
          <span className="a11y">뒤로 가기</span>
        </button>
        <h2 css={navigationBarStyles.title}>‘{shelfTitle}’에 추가</h2>
      </div>
    </Responsive>
  );
}

function SearchBar({ isSearching, keyword, onClear, onConfirm, onKeywordChange }) {
  const [isFocused, setFocused] = React.useState(false);
  const handleFocus = React.useCallback(() => setFocused(true), []);
  const handleBlur = React.useCallback(() => setFocused(false), []);
  const handleCancelButtonClick = React.useCallback(
    () => {
      onKeywordChange && onKeywordChange('');
      onClear && onClear();
    },
    [onClear, onKeywordChange],
  );
  const left = (
    <SearchBox
      keyword={keyword}
      onBlur={handleBlur}
      onClear={onClear}
      onFocus={handleFocus}
      onSubmit={onConfirm}
      onKeywordChange={onKeywordChange}
    />
  );
  const right =
    isSearching && !isFocused ? (
      <button type="button" css={searchBarStyles.cancelButton} onClick={handleCancelButtonClick}>
        취소
      </button>
    ) : null;
  return <FlexBar css={searchBarStyles.bar} flexLeft={left} flexRight={right} />;
}

function SearchView({ clearSelectedItems, isSelected, onAddSelected, onBackClick, shelfTitle, uuid }) {
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
        <div css={mainStyles.paddingForPagination}>
          <ResponsiveBooks>
            <SkeletonBooks viewType={ViewType.LANDSCAPE} />
          </ResponsiveBooks>
        </div>
      );
    }
    if (searchItems.length === 0) {
      return <Empty IconComponent={SearchIcon} iconWidth={38} message={`'${keyword}'에 대한 검색 결과가 없습니다.`} />;
    }
    return (
      <div css={mainStyles.paddingForPagination}>
        <ResponsiveBooks>{renderBooks()}</ResponsiveBooks>
      </div>
    );
  }

  return (
    <>
      <NavigationBar shelfTitle={shelfTitle} onBackClick={onBackClick} />
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
)(SearchView);
