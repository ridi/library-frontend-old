import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as filterActions from 'services/purchased/filter/actions';
import * as mainActions from 'services/purchased/main/actions';
import * as mainSelectors from 'services/purchased/main/selectors';
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
import { BooksPageKind } from '../../../../constants/urls';
import ViewType from '../../../../constants/viewType';
import BookOutline from '../../../../svgs/BookOutline.svg';
import SearchIcon from '../../../../svgs/Search.svg';
import { ResponsiveBooks } from '../../../base/Responsive';
import SearchBar from './SearchBar';
import SearchBooks from './SearchBooks';

export default function SearchModal({ onAddSelected, onBackClick, uuid }) {
  const [categoryFilter, setCategoryFilter] = React.useState(null);
  const [keyword, setKeyword] = React.useState('');
  const [searchingKeyword, setSearchingKeyword] = React.useState('');
  const [page, setPage] = React.useState(1);

  const processedKeyword = searchingKeyword === '' ? undefined : searchingKeyword;
  const pageOptions = {
    kind: BooksPageKind.SEARCH,
    keyword: processedKeyword,
    categoryFilter,
    page,
  };

  const dispatch = useDispatch();
  const shelfTitle = useSelector(state => shelfSelectors.getShelfName(state, uuid));
  const isSelected = useSelector(state => selectionSelectors.getTotalSelectedCount(state) !== 0);
  const totalPages = useSelector(state => mainSelectors.getTotalPages(state, pageOptions));
  const searchItems = useSelector(state => {
    if (mainSelectors.getIsPageCold(state, pageOptions)) {
      return null;
    }
    return mainSelectors.getItemsByPage(state, pageOptions);
  });

  const handleSearchConfirm = React.useCallback(() => {
    setSearchingKeyword(keyword);
  }, [keyword]);

  const handleSearchClear = React.useCallback(() => {
    setSearchingKeyword('');
    setKeyword('');
  }, []);

  const handleAddToShelf = React.useCallback(() => onAddSelected(uuid), [uuid]);

  React.useEffect(() => {
    dispatch(selectionActions.clearSelectedItems());
    dispatch(mainActions.loadItems(pageOptions));
    window.scrollTo(0, 0);
  }, [categoryFilter, dispatch, page, searchingKeyword]);

  React.useEffect(() => {
    dispatch(filterActions.updateCategories());
  }, [dispatch]);

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
    return <ResponsivePaginatorWithHandler currentPage={page} totalPages={totalPages} onPageChange={setPage} />;
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
