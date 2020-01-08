import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';

import { ButtonType } from 'components/ActionBar/constants';
import { BookError } from 'components/Error';
import Filler from 'components/Filler';
import PageRedirect from 'components/PageRedirect';
import SeriesList from 'components/SeriesList';
import TitleBar from 'components/TitleBar';
import UnitDetailView from 'components/UnitDetailView';
import { OrderOptions } from 'constants/orderOptions';
import { UnitType } from 'constants/unitType';
import { PageType, URLMap } from 'constants/urls';
import * as bookSelectors from 'services/book/selectors';
import * as confirmActions from 'services/confirm/actions';
import * as purchasedCommonSelectors from 'services/purchased/common/selectors';
import { selectionActions } from 'services/selection/reducers';
import * as selectionSelectors from 'services/selection/selectors';
import * as unitPageActions from 'services/unitPage/actions';
import * as unitPageSelectors from 'services/unitPage/selectors';

import Responsive from '../base/Responsive';

function extractOptions({ location, path, params }) {
  const searchParams = new URLSearchParams(location.search);
  const { unitId } = params;
  const page = parseInt(searchParams.get('page'), 10) || 1;
  const orderBy = searchParams.get('order_by') || OrderOptions.UNIT_LIST_DEFAULT.orderBy;
  const orderDirection = searchParams.get('order_direction') || OrderOptions.UNIT_LIST_DEFAULT.orderDirection;
  let kind;
  switch (path) {
    case URLMap[PageType.MAIN_UNIT].path:
      kind = PageType.MAIN;
      break;
    case URLMap[PageType.SEARCH_UNIT].path:
    case URLMap[PageType.SHELF_UNIT].path:
      kind = PageType.SEARCH;
      break;
    case URLMap[PageType.HIDDEN_UNIT].path:
      kind = PageType.HIDDEN;
      break;
    default:
      kind = '';
      break;
  }
  return {
    kind,
    unitId,
    orderBy,
    orderDirection,
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
      const { uuid } = match.params;
      return {
        pathname: URLMap[PageType.SHELF_DETAIL].as({ uuid }),
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
  const { unitId, orderBy, orderDirection, page } = options;
  return React.useCallback(() => actionDispatcher(options), [actionDispatcher, unitId, orderBy, orderDirection, page]);
}

function Unit(props) {
  const { location, match } = props;
  const options = extractOptions({ location, ...match });
  const { kind, orderBy, orderDirection, page: currentPage } = options;
  const backLocation = makeBackLocation({ location, match });

  const { unit, unitOptions, totalCount, totalPages } = props;
  const {
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
    const order = OrderOptions.toKey(orderBy, orderDirection);
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
        downloadable={kind !== PageType.HIDDEN}
        readableLatest={kind !== PageType.HIDDEN}
      />
    );
  }

  function makeActionBarProps() {
    const { isSelected } = props;
    const disable = !isSelected;

    let buttonProps = [];
    if (kind === PageType.HIDDEN) {
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

    return { buttonProps };
  }

  function renderSeriesList() {
    const { primaryBook, isFetchingBook, primaryItem, items } = props;

    if (unit == null || !primaryBook) {
      return <Filler />;
    }

    if (UnitType.isBook(unit.type)) {
      return null;
    }

    const bookUnitOfCount = primaryBook.series ? primaryBook.series.property.unit : null;
    const order = OrderOptions.toKey(orderBy, orderDirection);
    const orderOptions = UnitType.isSeries(unit.type)
      ? OrderOptions.toSeriesList(bookUnitOfCount)
      : OrderOptions.toCollectionList(bookUnitOfCount);

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
        onClickDeselectAllBooks={dispatchClearSelectedBooks}
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

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {renderTitleBar()}
      <PageRedirect currentPage={currentPage} totalPages={totalPages} />
      <main>{renderMain()}</main>
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
  dispatchClearSelectedBooks: selectionActions.clearSelectedItems,
  dispatchDeleteSelectedBooks: unitPageActions.deleteSelectedBooks,
  dispatchDownloadSelectedBooks: unitPageActions.downloadSelectedBooks,
  dispatchHideSelectedBooks: unitPageActions.hideSelectedBooks,
  dispatchLoadItems: unitPageActions.loadItems,
  dispatchSelectAllBooks: unitPageActions.selectAllBooks,
  dispatchShowConfirm: confirmActions.showConfirm,
  dispatchUnhideSelectedBooks: unitPageActions.unhideSelectedBooks,
};

export default connect(mapStateToProps, mapDispatchToProps)(Unit);
