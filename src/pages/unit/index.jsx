import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';

import { ButtonType } from '../../components/ActionBar/constants';
import BookDownLoader from '../../components/BookDownLoader';
import { BookError } from '../../components/Error';
import SelectShelfModal from '../../components/SelectShelfModal';
import SeriesList from '../../components/SeriesList';
import TitleBar from '../../components/TitleBar';
import UnitDetailView from '../../components/UnitDetailView';
import * as featureIds from '../../constants/featureIds';
import { OrderOptions } from '../../constants/orderOptions';
import { UnitType } from '../../constants/unitType';
import { PageType, URLMap } from '../../constants/urls';
import * as bookSelectors from '../../services/book/selectors';
import * as featureSelectors from '../../services/feature/selectors';
import * as purchasedCommonSelectors from '../../services/purchased/common/selectors';
import * as selectionActions from '../../services/selection/actions';
import * as selectionSelectors from '../../services/selection/selectors';
import * as shelfActions from '../../services/shelf/actions';
import * as unitPageActions from '../../services/unitPage/actions';
import * as unitPageSelectors from '../../services/unitPage/selectors';
import Responsive from '../base/Responsive';

function extractOptions({ location, path, params }) {
  const searchParams = new URLSearchParams(location.search);
  const { unitId } = params;
  const page = parseInt(searchParams.get('page'), 10) || 1;
  const orderType = searchParams.get('order_type') || OrderOptions.UNIT_LIST_DEFAULT.orderType;
  const orderBy = searchParams.get('order_by') || OrderOptions.UNIT_LIST_DEFAULT.orderBy;
  let kind;
  switch (path) {
    case URLMap[PageType.MAIN_UNIT].path:
      kind = 'main';
      break;
    case URLMap[PageType.SEARCH_UNIT].path:
    case URLMap[PageType.SHELF_UNIT].path:
      kind = 'search';
      break;
    case URLMap[PageType.HIDDEN_UNIT].path:
      kind = 'hidden';
      break;
    default:
      kind = '';
      break;
  }
  return {
    kind,
    unitId,
    orderType,
    orderBy,
    page,
  };
}

function makeBackLocation({ location, match }) {
  const { backLocation } = location.state;
  if (backLocation != null) {
    return backLocation;
  }

  const searchParams = new URLSearchParams(location.search);
  switch (match.path) {
    case URLMap[PageType.MAIN_UNIT].path:
      return {
        pathname: URLMap[PageType.MAIN].as,
      };
    case URLMap[PageType.SEARCH_UNIT].path:
      if (searchParams.get('keyword')) {
        const newParams = new URLSearchParams();
        newParams.set('keyword', searchParams.get('keyword'));
        const search = newParams.toString();
        return {
          pathname: URLMap[PageType.SEARCH].as,
          search: search === '' ? '' : `?${search}`,
        };
      }
      return {
        pathname: URLMap[PageType.MAIN].as,
      };
    case URLMap[PageType.SHELF_UNIT].path:
      return {
        pathname: URLMap[PageType.SHELF_DETAIL].as(match.params.uuid),
      };
    case URLMap[PageType.HIDDEN_UNIT].path:
      return {
        pathname: URLMap[PageType.HIDDEN].as,
      };
    default:
      return {
        pathname: URLMap[PageType.MAIN].as,
      };
  }
}

function useDispatchOptions(actionDispatcher, options) {
  const { unitId, orderType, orderBy, page } = options;
  return React.useCallback(() => actionDispatcher(options), [actionDispatcher, unitId, orderType, orderBy, page]);
}

function Unit(props) {
  const { location, match } = props;
  const options = extractOptions({ location, ...match });
  const { kind, orderType, orderBy, page: currentPage } = options;
  const backLocation = makeBackLocation({ location, match });

  const { unit, totalCount } = props;
  const {
    dispatchAddSelectedToShelf,
    dispatchClearSelectedBooks,
    dispatchDownloadSelectedBooks,
    dispatchHideSelectedBooks,
    dispatchLoadItems,
    dispatchSelectAllBooks,
  } = props;

  const [isSelecting, setIsSelecting] = React.useState(false);
  const [showShelves, setShowShelves] = React.useState(false);

  const hideSelectedBooksWithOptions = useDispatchOptions(dispatchHideSelectedBooks, options);
  const selectAllBooksWithOptions = useDispatchOptions(dispatchSelectAllBooks, options);
  const loadItemsWithOptions = useDispatchOptions(dispatchLoadItems, options);

  const handleHideClick = React.useCallback(
    () => {
      hideSelectedBooksWithOptions();
      dispatchClearSelectedBooks();
      setIsSelecting(false);
    },
    [dispatchHideSelectedBooks, dispatchClearSelectedBooks],
  );

  const handleDownloadClick = React.useCallback(
    () => {
      dispatchDownloadSelectedBooks();
      dispatchClearSelectedBooks();
      setIsSelecting(false);
    },
    [dispatchDownloadSelectedBooks, dispatchClearSelectedBooks],
  );

  const handleAddToShelf = React.useCallback(() => setShowShelves(true), []);

  const handleShelfBackClick = React.useCallback(() => setShowShelves(false), []);

  const handleShelfSelect = React.useCallback(
    uuid => {
      dispatchAddSelectedToShelf({
        uuid,
        onComplete: () => {
          setIsSelecting(false);
          setShowShelves(false);
          dispatchClearSelectedBooks();
        },
      });
    },
    [dispatchAddSelectedToShelf, dispatchClearSelectedBooks],
  );

  function renderTitleBar() {
    const order = OrderOptions.toKey(orderType, orderBy);
    const usePurchasedTotalCount = [OrderOptions.UNIT_ORDER_DESC.key, OrderOptions.UNIT_ORDER_ASC.key].includes(order);

    const extraTitleBarProps = unit
      ? {
          title: unit.title,
          showCount:
            !UnitType.isBook(unit.type) && (usePurchasedTotalCount ? totalCount.purchasedTotalCount > 0 : totalCount.itemTotalCount > 0),
          totalCount: usePurchasedTotalCount ? totalCount.purchasedTotalCount : totalCount.itemTotalCount,
        }
      : {};

    return <TitleBar backLocation={backLocation} {...extraTitleBarProps} />;
  }

  function renderDetailView() {
    const { primaryBookId, primaryItem, items, bookDescription, bookStarRating } = props;

    return (
      <UnitDetailView
        unit={unit}
        primaryBookId={primaryBookId}
        primaryItem={primaryItem}
        items={items}
        bookDescription={bookDescription}
        bookStarRating={bookStarRating}
        downloadable
        readableLatest
      />
    );
  }

  function makeActionBarProps() {
    const { isSelected, isSyncShelfEnabled } = props;
    const disable = !isSelected;

    let buttonProps;
    if (kind === 'hidden') {
      buttonProps = [];
    } else if (isSyncShelfEnabled) {
      if (UnitType.isCollection(unit.type)) {
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
        ];
      }
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

  function renderSeriesList() {
    const { primaryBook, isFetchingBook, primaryItem, totalPages, items } = props;
    if (unit == null || UnitType.isBook(unit.type) || !primaryBook) {
      return null;
    }

    const bookUnitOfCount = primaryBook.series ? primaryBook.series.property.unit : null;
    const order = OrderOptions.toKey(orderType, orderBy);
    const orderOptions = UnitType.isSeries(unit.type)
      ? OrderOptions.toSeriesList(bookUnitOfCount)
      : OrderOptions.toShelfList(bookUnitOfCount);

    return (
      <SeriesList
        currentPage={currentPage}
        totalPages={totalPages}
        actionBarProps={makeActionBarProps()}
        currentOrder={order}
        orderOptions={orderOptions}
        isFetching={isFetchingBook}
        isEditing={isSelecting}
        onEditingChange={setIsSelecting}
        primaryItem={primaryItem}
        items={items}
        unit={unit}
        linkWebviewer
        onClickSelectAllBooks={selectAllBooksWithOptions}
        onClickUnselectAllBooks={dispatchClearSelectedBooks}
      />
    );
  }

  function renderMain() {
    const { isError } = props;
    if (isError) {
      return <BookError onClickRefreshButton={loadItemsWithOptions} />;
    }
    return (
      <>
        <Responsive>{renderDetailView()}</Responsive>
        {renderSeriesList()}
      </>
    );
  }

  const title = unit.title ? `${unit.title} - 내 서재` : '내 서재';
  if (showShelves) {
    return (
      <>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <SelectShelfModal onBackClick={handleShelfBackClick} onShelfSelect={handleShelfSelect} />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {renderTitleBar()}
      <main>{renderMain()}</main>
      <BookDownLoader />
    </>
  );
}

Unit.prepare = ({ dispatch, location, path, params }) => {
  const options = extractOptions({ location, path, params });
  dispatch(selectionActions.clearSelectedItems());
  dispatch(unitPageActions.loadItems(options));
};

const mapStateToProps = (state, props) => {
  const options = extractOptions({ location: props.location, ...props.match });
  const { unitId } = options;
  const primaryBookId = purchasedCommonSelectors.getPrimaryBookId(state, unitId);
  return {
    bookDescription: primaryBookId && bookSelectors.getBookDescription(state, primaryBookId),
    bookStarRating: primaryBookId && bookSelectors.getBookStarRating(state, primaryBookId),
    isFetchingBook: unitPageSelectors.getIsFetchingBook(state),
    isSelected: selectionSelectors.getTotalSelectedCount(state) !== 0,
    isSyncShelfEnabled: featureSelectors.getIsFeatureEnabled(state, featureIds.SYNC_SHELF),
    items: unitPageSelectors.getItemsByPage(state, options),
    primaryBook: primaryBookId && bookSelectors.getBook(state, primaryBookId),
    primaryBookId,
    primaryItem: unitPageSelectors.getPrimaryItem(state, unitId),
    totalCount: unitPageSelectors.getTotalCount(state, options),
    totalPages: unitPageSelectors.getTotalPages(state, options),
    unit: bookSelectors.getUnit(state, unitId),
  };
};

const mapDispatchToProps = {
  dispatchAddSelectedToShelf: shelfActions.addSelectedToShelf,
  dispatchClearSelectedBooks: selectionActions.clearSelectedItems,
  dispatchDownloadSelectedBooks: unitPageActions.downloadSelectedBooks,
  dispatchHideSelectedBooks: unitPageActions.hideSelectedBooks,
  dispatchLoadItems: unitPageActions.loadItems,
  dispatchSelectAllBooks: unitPageActions.selectAllBooks,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Unit);
