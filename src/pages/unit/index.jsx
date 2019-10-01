import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';

import { ButtonType } from '../../components/ActionBar/constants';
import BookDownLoader from '../../components/BookDownLoader';
import { BookError } from '../../components/Error';
import PageRedirect from '../../components/PageRedirect';
import SelectShelfModal from '../../components/SelectShelfModal';
import SeriesList from '../../components/SeriesList';
import TitleBar from '../../components/TitleBar';
import UnitDetailView from '../../components/UnitDetailView';
import * as featureIds from '../../constants/featureIds';
import { OrderOptions } from '../../constants/orderOptions';
import { UnitType } from '../../constants/unitType';
import { PageType, URLMap } from '../../constants/urls';
import * as bookSelectors from '../../services/book/selectors';
import * as confirmActions from '../../services/confirm/actions';
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
  if (location.state?.backLocation != null) {
    const { backLocation } = location.state;
    return {
      ...backLocation,
      state: {
        ...(backLocation.state || {}),
        scroll: { from: backLocation.key },
      },
    };
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

  const { unit, unitOptions, totalCount, totalPages } = props;
  const {
    dispatchAddSelectedToShelf,
    dispatchClearSelectedBooks,
    dispatchDeleteSelectedBooks,
    dispatchDownloadSelectedBooks,
    dispatchHideSelectedBooks,
    dispatchLoadItems,
    dispatchSelectAllBooks,
    dispatchShowConfirm,
    dispatchUnhideSelectedBooks,
  } = props;

  const [isSelecting, setIsSelecting] = React.useState(false);
  const [showShelves, setShowShelves] = React.useState(false);

  React.useEffect(() => {
    dispatchClearSelectedBooks();
    dispatchLoadItems(unitOptions);
  }, [location]);

  const hideSelectedBooksWithOptions = useDispatchOptions(dispatchHideSelectedBooks, options);
  const unhideSelectedBooksWithOptions = useDispatchOptions(dispatchUnhideSelectedBooks, options);
  const selectAllBooksWithOptions = useDispatchOptions(dispatchSelectAllBooks, options);
  const loadItemsWithOptions = useDispatchOptions(dispatchLoadItems, options);
  const deleteSelectedBooksWithOptions = useDispatchOptions(dispatchDeleteSelectedBooks, options);

  const handleHideClick = React.useCallback(() => {
    hideSelectedBooksWithOptions();
    dispatchClearSelectedBooks();
    setIsSelecting(false);
  }, [dispatchClearSelectedBooks, hideSelectedBooksWithOptions]);

  const handleUnhideClick = React.useCallback(() => {
    unhideSelectedBooksWithOptions();
    dispatchClearSelectedBooks();
    setIsSelecting(false);
  }, [dispatchClearSelectedBooks, unhideSelectedBooksWithOptions]);

  const handleDownloadClick = React.useCallback(() => {
    dispatchDownloadSelectedBooks();
    dispatchClearSelectedBooks();
    setIsSelecting(false);
  }, [dispatchDownloadSelectedBooks, dispatchClearSelectedBooks]);

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

  const handleDeleteClick = React.useCallback(() => {
    dispatchShowConfirm({
      title: '영구 삭제',
      message: (
        <>
          내 서재에서 영구히 삭제되며 다시 구매해야 이용할 수 있습니다.
          <br />
          <br />
          그래도 삭제하시겠습니까?
        </>
      ),
      confirmLabel: '삭제',
      onClickConfirmButton: deleteSelectedBooksWithOptions,
    });
  }, [deleteSelectedBooksWithOptions, dispatchShowConfirm]);

  function renderTitleBar() {
    const order = OrderOptions.toKey(orderType, orderBy);
    const usePurchasedTotalCount = [OrderOptions.UNIT_ORDER_DESC.key, OrderOptions.UNIT_ORDER_ASC.key].includes(order);
    const shownTotalCount = usePurchasedTotalCount ? totalCount.purchasedTotalCount : totalCount.itemTotalCount;

    const extraTitleBarProps = unit
      ? {
          title: unit.title,
          showCount: !UnitType.isBook(unit.type) && shownTotalCount > 0,
          totalCount: shownTotalCount,
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
        items={items || []}
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

    let buttonProps = [];
    if (kind === 'hidden') {
      buttonProps = [
        {
          name: '영구 삭제',
          type: ButtonType.DANGER,
          onClick: handleDeleteClick,
          disable,
        },
        {
          type: ButtonType.SPACER,
        },
        {
          name: '숨김 해제',
          onClick: handleUnhideClick,
          disable,
        },
      ];
    } else {
      buttonProps.push({
        name: '숨기기',
        onClick: handleHideClick,
        disable,
      });
      if (isSyncShelfEnabled && UnitType.isCollection(unit.type)) {
        buttonProps.push({
          name: '책장에 추가',
          onClick: handleAddToShelf,
          disable,
        });
      }
      buttonProps.push(
        {
          type: ButtonType.SPACER,
        },
        {
          name: '다운로드',
          onClick: handleDownloadClick,
          disable,
        },
      );
    }

    return { buttonProps };
  }

  function renderSeriesList() {
    const { primaryBook, isFetchingBook, primaryItem, items } = props;
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
  let body = null;
  if (showShelves) {
    body = <SelectShelfModal onBackClick={handleShelfBackClick} onShelfSelect={handleShelfSelect} />;
  } else {
    body = (
      <>
        {renderTitleBar()}
        <PageRedirect currentPage={currentPage} totalPages={totalPages} />
        <main>{renderMain()}</main>
        <BookDownLoader />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {body}
    </>
  );
}

const mapStateToProps = (state, props) => {
  const unitOptions = extractOptions({ location: props.location, ...props.match });
  const { kind, unitId } = unitOptions;
  const primaryBookId = purchasedCommonSelectors.getPrimaryBookId(state, unitId);
  return {
    bookDescription: primaryBookId && bookSelectors.getBookDescription(state, primaryBookId),
    bookStarRating: primaryBookId && bookSelectors.getBookStarRating(state, primaryBookId),
    isFetchingBook: unitPageSelectors.getIsFetchingBook(state),
    isSelected: selectionSelectors.getTotalSelectedCount(state) !== 0,
    isSyncShelfEnabled: featureSelectors.getIsFeatureEnabled(state, featureIds.SYNC_SHELF),
    items: unitPageSelectors.getItemsByPage(state, unitOptions),
    primaryBook: primaryBookId && bookSelectors.getBook(state, primaryBookId),
    primaryBookId,
    primaryItem: unitPageSelectors.getPrimaryItem(state, kind, unitId),
    totalCount: unitPageSelectors.getTotalCount(state, unitOptions),
    totalPages: unitPageSelectors.getTotalPages(state, unitOptions),
    unit: bookSelectors.getUnit(state, unitId),
    unitOptions,
  };
};

const mapDispatchToProps = {
  dispatchAddSelectedToShelf: shelfActions.addSelectedToShelf,
  dispatchClearSelectedBooks: selectionActions.clearSelectedItems,
  dispatchDeleteSelectedBooks: unitPageActions.deleteSelectedBooks,
  dispatchDownloadSelectedBooks: unitPageActions.downloadSelectedBooks,
  dispatchHideSelectedBooks: unitPageActions.hideSelectedBooks,
  dispatchLoadItems: unitPageActions.loadItems,
  dispatchSelectAllBooks: unitPageActions.selectAllBooks,
  dispatchShowConfirm: confirmActions.showConfirm,
  dispatchUnhideSelectedBooks: unitPageActions.unhideSelectedBooks,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Unit);
