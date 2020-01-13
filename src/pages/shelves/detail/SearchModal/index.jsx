import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ButtonType } from 'components/ActionBar/constants';
import BottomActionBar from 'components/BottomActionBar';
import EditingBar from 'components/EditingBar';
import Empty from 'components/Empty';
import FixedToolbarView from 'components/FixedToolbarView';
import { ResponsivePaginatorWithHandler } from 'components/ResponsivePaginator';
import SkeletonBooks from 'components/Skeleton/SkeletonBooks';
import { BooksPageKind } from 'constants/urls';
import ViewType from 'constants/viewType';
import { ResponsiveBooks } from 'pages/base/Responsive';
import * as filterActions from 'services/purchased/filter/actions';
import * as mainActions from 'services/purchased/main/actions';
import * as mainSelectors from 'services/purchased/main/selectors';
import { selectionActions } from 'services/selection/reducers';
import * as selectionSelectors from 'services/selection/selectors';
import * as shelfActions from 'services/shelf/actions';
import * as shelfSelectors from 'services/shelf/selectors';
import BookOutline from 'svgs/BookOutline.svg';
import SearchIcon from 'svgs/Search.svg';

import SearchBar from './SearchBar';
import SearchBooks from './SearchBooks';

export default function SearchModal({ onAddSelected, onBackClick, uuid }) {
  const [filter, setFilter] = React.useState(null);
  const [keyword, setKeyword] = React.useState('');
  const [searchingKeyword, setSearchingKeyword] = React.useState('');
  const [page, setPage] = React.useState(1);

  const processedKeyword = searchingKeyword === '' ? undefined : searchingKeyword;
  const pageOptions = {
    kind: BooksPageKind.SEARCH,
    keyword: processedKeyword,
    filter,
    page,
  };

  const dispatch = useDispatch();
  const selectedItemIds = useSelector(state => selectionSelectors.getSelectedItemIds(state));
  const shelfAllBookUnitIds = useSelector(state => shelfSelectors.getShelfAllBookUnitIds(state, uuid));
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
  const totalSelectedCount = selectedItemIds.length;
  const searchItemUnitIds = searchItems ? searchItems.map(searchItem => searchItem.unit_id) : [];
  const activeBookUnitIds = shelfAllBookUnitIds ? searchItemUnitIds.filter(unitId => !shelfAllBookUnitIds.includes(unitId)) : [];
  const activeBookIds =
    activeBookUnitIds && searchItems
      ? activeBookUnitIds.map(activeBookUnitId => searchItems.find(searchItem => searchItem.unit_id === activeBookUnitId)?.b_id)
      : [];
  const isSelectedAllItem = searchItems && activeBookIds.every(activeBookId => selectedItemIds.includes(activeBookId));
  const selectAllItem = () => {
    dispatch(selectionActions.selectItems(activeBookIds));
  };

  const deselectAllItem = () => {
    dispatch(selectionActions.deselectItems(activeBookIds));
  };

  React.useEffect(() => {
    dispatch(mainActions.loadItems(pageOptions));
    window.scrollTo(0, 0);
  }, [dispatch, page]);

  React.useEffect(() => {
    if (page !== 1) {
      setPage(1);
      return;
    }
    dispatch(mainActions.loadItems(pageOptions));
    window.scrollTo(0, 0);
  }, [filter, searchingKeyword]);

  React.useEffect(() => {
    dispatch(filterActions.updateCategories());
    dispatch(shelfActions.loadShelfAllBook(uuid));
  }, [dispatch]);

  function renderToolBar() {
    return (
      <>
        <EditingBar
          totalSelectedCount={totalSelectedCount}
          isSelectedAllItem={isSelectedAllItem}
          onClickSelectAllItem={selectAllItem}
          onClickDeselectAllItem={deselectAllItem}
          onClickSuccessButton={onBackClick}
        />
        <SearchBar
          isSearching={searchingKeyword !== ''}
          filter={filter}
          keyword={keyword}
          onClear={handleSearchClear}
          onConfirm={handleSearchConfirm}
          onFilterChange={setFilter}
          onKeywordChange={setKeyword}
        />
      </>
    );
  }

  function renderActionBar() {
    const buttons = [{ type: ButtonType.SPACER }, { name: '추가', onClick: handleAddToShelf, disable: totalSelectedCount === 0 }];
    return <BottomActionBar buttonProps={buttons} />;
  }

  function renderPaginator() {
    return <ResponsivePaginatorWithHandler currentPage={page} totalPages={totalPages} onPageChange={setPage} />;
  }

  function renderBooks() {
    return (
      <>
        <SearchBooks items={searchItems} shelfAllBookUnitIds={shelfAllBookUnitIds} totalSelectedCount={totalSelectedCount} />
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
    <FixedToolbarView allowFixed toolbar={renderToolBar()} actionBar={renderActionBar()}>
      <main>{renderMain()}</main>
    </FixedToolbarView>
  );
}
