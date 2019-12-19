import React from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';

import { ButtonType } from 'components/ActionBar/constants';
import { Books } from 'components/Books';
import Editable from 'components/Editable';
import Empty from 'components/Empty';
import FlexBar from 'components/FlexBar';
import ResponsivePaginator from 'components/ResponsivePaginator';
import SkeletonBooks from 'components/Skeleton/SkeletonBooks';
import Title from 'components/TitleBar/Title';
import * as Tools from 'components/Tool';
import { OrderOptions } from 'constants/orderOptions';
import { LIBRARY_ITEMS_LIMIT_PER_PAGE } from 'constants/page';
import { SHELF_NAME_LIMIT } from 'constants/shelves';
import { PageType, URLMap } from 'constants/urls';
import { ResponsiveBooks } from 'pages/base/Responsive';
import * as bookSelectors from 'services/book/selectors';
import * as confirmActions from 'services/confirm/actions';
import * as promptActions from 'services/prompt/actions';
import { selectionActions } from 'services/selection/reducers';
import * as selectionSelectors from 'services/selection/selectors';
import * as actions from 'services/shelf/actions';
import * as selectors from 'services/shelf/selectors';
import * as uiActions from 'services/ui/actions';
import BookOutline from 'svgs/BookOutline.svg';
import * as paginationUtils from 'utils/pagination';
import { makeLinkProps } from 'utils/uri';

import SearchModal from './SearchModal';
import * as styles from './styles';
import SelectShelf from './SelectShelf';

const extractPageOptions = locationSearch => {
  const urlParams = new URLSearchParams(locationSearch);
  const page = parseInt(urlParams.get('page'), 10) || 1;
  const orderBy = urlParams.get('order_by') || OrderOptions.SHELF_BOOK_DEFAULT.orderBy;
  const orderDirection = urlParams.get('order_direction') || '';
  return {
    page,
    orderBy,
    orderDirection,
  };
};

function ShelfDetail() {
  const history = useHistory();
  const location = useLocation();
  const { uuid } = useParams();

  const pageOptions = extractPageOptions(location.search);
  const { orderBy, orderDirection, page } = pageOptions;

  const dispatch = useDispatch();
  const name = useSelector(state => selectors.getShelfName(state, uuid));
  const totalBookCount = useSelector(state => selectors.getShelfBookCount(state, uuid));
  const { loading: booksLoading } = useSelector(state => selectors.getShelfBooks(state, uuid, pageOptions));
  const libraryBooks = useSelector(state => selectors.getLibraryBooks(state, uuid, pageOptions));
  const bookIds = useSelector(state => selectors.getBookIds(state, uuid, pageOptions));
  const platformBooks = useSelector(state => bookSelectors.getBooks(state, bookIds));
  const totalSelectedCount = useSelector(selectionSelectors.getTotalSelectedCount);
  const viewType = useSelector(state => state.ui.viewType);

  const visibleBookCount = bookIds.length;
  const totalPages = totalBookCount == null ? null : paginationUtils.calcPage(totalBookCount, LIBRARY_ITEMS_LIMIT_PER_PAGE);

  const [isEditing, setIsEditing] = React.useState(false);
  const [isAdding, setIsAdding] = React.useState(false);
  const [isMoving, setIsMoving] = React.useState(false);

  React.useEffect(() => {
    dispatch(actions.loadShelfBookCount(uuid));
  }, [uuid]);

  React.useEffect(() => {
    dispatch(selectionActions.clearSelectedItems());
    dispatch(actions.loadShelfBooks(uuid, pageOptions));
  }, [location, uuid]);

  const toggleEditingMode = React.useCallback(() => {
    dispatch(selectionActions.clearSelectedItems());
    setIsEditing(value => !value);
  }, []);
  const selectAllBooks = React.useCallback(() => dispatch(selectionActions.selectItems(bookIds)), [bookIds]);
  const confirmRemove = React.useCallback(() => {
    dispatch(actions.removeSelectedFromShelf({ uuid, pageOptions: { orderBy, orderDirection, page } }));
    setIsEditing(false);
  }, [uuid, orderBy, orderDirection, page]);
  const showRemoveConfirm = React.useCallback(() => {
    dispatch(
      confirmActions.showConfirm({
        title: '책장에서 책 삭제',
        message: '책장에서 삭제해도 다시 추가할 수 있습니다.',
        confirmLabel: '삭제',
        onClickConfirmButton: confirmRemove,
      }),
    );
  }, []);
  const showSelectShelfModal = () => {
    setIsMoving(true);
  };
  const moveBooks = React.useCallback(() => {
    dispatch(
      actions.moveSelectedBooks({
        uuid,
        pageOptions,
      }),
    );
    setIsMoving(false);
    setIsEditing(false);
  }, []);
  const downloadBooks = React.useCallback(() => {
    dispatch(actions.downloadSelectedUnits());
    dispatch(selectionActions.clearSelectedItems());
    setIsEditing(false);
  }, []);
  const handleAddClick = React.useCallback(() => setIsAdding(true), []);
  const handleAddBackClick = React.useCallback(() => {
    dispatch(selectionActions.clearSelectedItems());
    setIsAdding(false);
  }, []);
  const confirmShelfRemove = React.useCallback(() => dispatch(actions.deleteShelfFromDetail(uuid, history)), [uuid, history]);
  const showShelfRemoveConfirm = React.useCallback(() => {
    dispatch(
      confirmActions.showConfirm({
        title: '책장 삭제',
        message: '모든 기기에서 선택한 책장이 삭제됩니다. 삭제한 책장의 책은 ‘모든 책’에서 볼 수 있습니다.',
        confirmLabel: '삭제',
        onClickConfirmButton: confirmShelfRemove,
      }),
    );
  }, []);
  const confirmShelfRename = React.useCallback(
    newName => {
      if (name !== newName) dispatch(actions.renameShelf({ uuid, name: newName }));
    },
    [name, uuid],
  );
  const showShelfRenamePrompt = React.useCallback(() => {
    dispatch(
      promptActions.showPrompt({
        title: '책장 이름 변경',
        message: '책장의 이름을 입력해주세요.',
        placeHolder: '책장 이름',
        confirmLabel: '확인',
        initialValue: name,
        emptyInputAlertMessage: '책장의 이름을 입력해주세요.',
        onClickConfirmButton: confirmShelfRename,
        limit: SHELF_NAME_LIMIT,
      }),
    );
  }, [name]);
  const handleAddSelected = React.useCallback(
    targetUuid => {
      dispatch(
        actions.addSelectedToShelf({
          fromShelfPageOptions: { orderBy, orderDirection, page },
          uuid: targetUuid,
          onComplete() {
            dispatch(selectionActions.clearSelectedItems());
            setIsAdding(false);
          },
        }),
      );
    },
    [orderBy, orderDirection, page],
  );

  const linkBuilder = React.useCallback(
    libraryBook => {
      const unitId = libraryBook.unit_id;
      const linkProps = makeLinkProps(
        {
          pathname: URLMap[PageType.SHELF_UNIT].href,
          query: { uuid, unitId },
        },
        URLMap[PageType.SHELF_UNIT].as({ uuid, unitId }),
        {},
      );
      return (
        <Link
          to={{
            ...linkProps.to,
            state: {
              backLocation: location,
            },
          }}
        >
          더보기
        </Link>
      );
    },
    [location],
  );

  React.useEffect(() => {
    if (totalPages == null) {
      return;
    }
    const newPage = Math.max(Math.min(page, totalPages), 1);
    if (page !== newPage) {
      const linkProps = makeLinkProps(
        {
          pathname: URLMap[PageType.SHELF_DETAIL].href,
          query: { uuid },
        },
        URLMap[PageType.SHELF_DETAIL].as({ uuid }),
        {
          orderBy,
          orderDirection,
          page: newPage,
        },
      );
      history.push(linkProps.to);
    }
  }, [page, totalPages, history]);

  function makeBackLocation() {
    if (location.state && location.state.backLocation) {
      const { backLocation } = location.state;
      return {
        ...backLocation,
        state: {
          ...(backLocation.state || {}),
          scroll: { from: backLocation.key },
        },
      };
    }
    return URLMap[PageType.SHELVES].as;
  }

  function renderShelfBar() {
    const backLocation = makeBackLocation();
    const left = <Title title={name} showCount={totalBookCount != null} totalCount={totalBookCount} to={backLocation} />;
    return <FlexBar css={styles.shelfBar} flexLeft={left} />;
  }

  function renderToolbar() {
    const right = (
      <div css={styles.toolsWrapper}>
        <Tools.Add onClickAddButton={handleAddClick} />
        <Tools.Editing toggleEditingMode={toggleEditingMode} />
        <Tools.ShelfEdit
          viewType={viewType}
          onRemoveClick={showShelfRemoveConfirm}
          onRenameClick={showShelfRenamePrompt}
          onViewTypeChange={newViewType => dispatch(uiActions.setViewType(newViewType))}
          uuid={uuid}
          orderBy={pageOptions.orderBy}
        />
      </div>
    );
    return <FlexBar css={styles.toolBar} flexRight={right} />;
  }

  function renderPaginator() {
    return totalPages ? <ResponsivePaginator currentPage={page} totalPages={totalPages} /> : null;
  }

  function renderMain() {
    let books;
    if (
      totalPages == null ||
      libraryBooks == null ||
      (libraryBooks.length === 0 && booksLoading) ||
      (totalPages > 0 && page > totalPages)
    ) {
      books = <SkeletonBooks viewType={viewType} />;
    } else if (libraryBooks.length > 0) {
      books = (
        <>
          <Books
            libraryBookDTO={libraryBooks}
            platformBookDTO={platformBooks}
            isSelectMode={isEditing}
            viewType={viewType}
            linkBuilder={linkBuilder}
          />
          {renderPaginator()}
        </>
      );
    } else {
      return <Empty IconComponent={BookOutline} iconWidth={40} iconHeight={48} message="책장에 도서가 없습니다." />;
    }
    return <ResponsiveBooks>{books}</ResponsiveBooks>;
  }

  if (isAdding) {
    return (
      <>
        <Helmet>
          <title>{`${name} - 내 서재`}</title>
        </Helmet>
        <SearchModal onAddSelected={handleAddSelected} onBackClick={handleAddBackClick} uuid={uuid} />
      </>
    );
  }

  if (isMoving) {
    return (
      <SelectShelf
        pageTitle={name}
        handleBackButtonClick={() => {
          dispatch(selectionActions.clearSelectedShelves());
          setIsMoving(false);
        }}
        handleMoveButtonClick={moveBooks}
        totalSelectedCount={totalSelectedCount}
      />
    );
  }

  const editingBarProps = {
    totalSelectedCount,
    isSelectedAllItem: totalSelectedCount === visibleBookCount,
    onClickSelectAllItem: selectAllBooks,
    onClickDeselectAllItem: () => {
      dispatch(selectionActions.clearSelectedItems());
    },
    onClickSuccessButton: toggleEditingMode,
  };

  const actionBarProps = {
    buttonProps: [
      {
        name: '이동',
        onClick: showSelectShelfModal,
        disable: totalSelectedCount === 0,
      },
      {
        name: '삭제',
        onClick: showRemoveConfirm,
        disable: totalSelectedCount === 0,
        type: ButtonType.DANGER,
      },
      {
        type: ButtonType.SPACER,
      },
      {
        name: '다운로드',
        onClick: downloadBooks,
        disable: totalSelectedCount === 0,
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>{`${name} - 내 서재`}</title>
      </Helmet>
      {renderShelfBar()}
      <Editable
        allowFixed
        isEditing={isEditing}
        nonEditBar={renderToolbar()}
        editingBarProps={editingBarProps}
        actionBarProps={actionBarProps}
      >
        <main>{renderMain()}</main>
      </Editable>
    </>
  );
}

export default ShelfDetail;
