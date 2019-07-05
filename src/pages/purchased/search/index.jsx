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
import { makeLinkProps } from '../../../utils/uri';
import { TabBar, TabMenuTypes } from '../../base/LNB';
import { ResponsiveBooks } from '../../base/Responsive';

const paddingForPagination = {
  paddingBottom: ACTION_BAR_HEIGHT,
};

class Search extends React.Component {
  static async prepare({ dispatch, location }) {
    const params = new URLSearchParams(location.search);
    const page = parseInt(params.get('page'), 10) || 1;
    const keyword = params.get('keyword') || '';
    await dispatch(clearSelectedItems());
    await dispatch(loadItems({ page, keyword }));
  }

  constructor(props) {
    super(props);

    this.state = {
      isEditing: false,
      showShelves: false,
    };
  }

  toggleEditingMode = () => {
    const { isEditing } = this.state;
    const { dispatchClearSelectedBooks } = this.props;

    if (isEditing === true) {
      dispatchClearSelectedBooks();
    }

    this.setState({ isEditing: !isEditing });
  };

  handleOnClickHide = () => {
    const { dispatchHideSelectedBooks, dispatchClearSelectedBooks } = this.props;

    dispatchHideSelectedBooks();
    dispatchClearSelectedBooks();
    this.setState({ isEditing: false });
  };

  handleOnClickDownload = () => {
    const { dispatchDownloadSelectedBooks, dispatchClearSelectedBooks } = this.props;
    dispatchDownloadSelectedBooks();
    dispatchClearSelectedBooks();
    this.setState({ isEditing: false });
  };

  handleAddToShelf = () => {
    this.setState({ showShelves: true });
  };

  handleShelfBackClick = () => {
    this.setState({ showShelves: false });
  };

  handleShelfSelect = uuid => {
    this.props.dispatchAddSelectedToShelf({
      uuid,
      onComplete: () => {
        this.setState({ isEditing: false, showShelves: false });
        this.props.dispatchClearSelectedBooks();
      },
    });
  };

  makeEditingBarProps() {
    const { isSyncShelfEnabled, items, totalSelectedCount, dispatchSelectAllBooks, dispatchClearSelectedBooks } = this.props;
    const filteredItems = isSyncShelfEnabled ? items.filter(item => !UnitType.isCollection(item.unit_type)) : items;
    const isSelectedAllBooks = totalSelectedCount === filteredItems.length;

    return {
      totalSelectedCount,
      isSelectedAllItem: isSelectedAllBooks,
      onClickSelectAllItem: dispatchSelectAllBooks,
      onClickUnselectAllItem: dispatchClearSelectedBooks,
      onClickSuccessButton: this.toggleEditingMode,
    };
  }

  makeActionBarProps() {
    const { isSyncShelfEnabled, totalSelectedCount } = this.props;
    const disable = totalSelectedCount === 0;

    let buttonProps;
    if (isSyncShelfEnabled) {
      buttonProps = [
        {
          name: '책장에 추가',
          onClick: this.handleAddToShelf,
          disable,
        },
        {
          name: '숨기기',
          onClick: this.handleOnClickHide,
          disable,
        },
        {
          type: ButtonType.SPACER,
        },
        {
          name: '다운로드',
          onClick: this.handleOnClickDownload,
          disable,
        },
      ];
    } else {
      buttonProps = [
        {
          name: '선택 숨기기',
          onClick: this.handleOnClickHide,
          disable,
        },
        {
          type: ButtonType.SPACER,
        },
        {
          name: '선택 다운로드',
          onClick: this.handleOnClickDownload,
          disable,
        },
      ];
    }

    return { buttonProps };
  }

  renderSearchBar() {
    const { keyword } = this;

    const searchBarProps = {
      keyword,
      toggleEditingMode: this.toggleEditingMode,
    };

    return <SearchBar isSearchPage {...searchBarProps} />;
  }

  renderBooks() {
    const { isEditing: isSelectMode } = this.state;
    const { items: libraryBookDTO, units, recentlyUpdatedMap, isFetchingBooks, viewType } = this.props;
    const { keyword } = this;
    const showSkeleton = isFetchingBooks && libraryBookDTO.length === 0;

    if (showSkeleton) {
      return <SkeletonBooks viewType={viewType} />;
    }

    const linkBuilder = _keyword => libraryBookData => {
      const linkProps = makeLinkProps({}, URLMap.searchUnit.as({ unitId: libraryBookData.unit_id }), { keyword: _keyword });

      return <Link {...linkProps}>더보기</Link>;
    };

    return (
      <>
        <Books
          {...{
            libraryBookDTO,
            units,
            isSelectMode,
            viewType,
            linkBuilder: linkBuilder(keyword),
          }}
          recentlyUpdatedMap={recentlyUpdatedMap}
        />
        {this.renderPaginator()}
      </>
    );
  }

  renderPaginator() {
    const { totalPages } = this.props;
    const { page: currentPage, keyword } = this;

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

  renderMain() {
    const { items, isFetchingBooks } = this.props;
    const { keyword } = this;

    if (!isFetchingBooks && items.length === 0) {
      let message = `'${keyword}'에 대한 검색 결과가 없습니다.`;
      if (!keyword) {
        message = '검색어를 입력해주세요.';
      }

      return <Empty IconComponent={SearchIcon} iconWidth={38} message={message} />;
    }

    return (
      <div css={paddingForPagination}>
        <ResponsiveBooks>{this.renderBooks()}</ResponsiveBooks>
      </div>
    );
  }

  get page() {
    const { location } = this.props;
    const params = new URLSearchParams(location.search);
    return parseInt(params.get('page'), 10) || 1;
  }

  get keyword() {
    const { location } = this.props;
    const params = new URLSearchParams(location.search);
    return params.get('keyword') || '';
  }

  render() {
    const { isEditing, showShelves } = this.state;
    const { totalPages, isError, dispatchLoadItems, location } = this.props;
    const { page: currentPage, keyword } = this;

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
          <SelectShelfModal onBackClick={this.handleShelfBackClick} onShelfSelect={this.handleShelfSelect} />
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
          nonEditBar={this.renderSearchBar()}
          editingBarProps={this.makeEditingBarProps()}
          actionBarProps={this.makeActionBarProps()}
        >
          <main>{isError ? <BookError onClickRefreshButton={() => dispatchLoadItems()} /> : this.renderMain()}</main>
          <BookDownLoader />
        </Editable>
      </>
    );
  }
}

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
