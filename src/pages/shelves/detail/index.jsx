/** @jsx jsx */
import { jsx } from '@emotion/core';
// import Router from 'next/router';
import React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { ButtonType } from '../../../components/ActionBar/constants';
import { Books } from '../../../components/Books';
import Editable from '../../../components/Editable';
import Empty from '../../../components/Empty';
import FlexBar from '../../../components/FlexBar';
import ResponsivePaginator from '../../../components/ResponsivePaginator';
import SkeletonBooks from '../../../components/Skeleton/SkeletonBooks';
import Title from '../../../components/TitleBar/Title';
import * as Tools from '../../../components/Tool';
import { LIBRARY_ITEMS_LIMIT_PER_PAGE } from '../../../constants/page';
import { SHELF_NAME_LIMIT } from '../../../constants/shelves';
import { PageType, URLMap } from '../../../constants/urls';
import ViewType from '../../../constants/viewType';
import * as bookSelectors from '../../../services/book/selectors';
import * as confirmActions from '../../../services/confirm/actions';
import * as promptActions from '../../../services/prompt/actions';
import * as selectionActions from '../../../services/selection/actions';
import * as selectionSelectors from '../../../services/selection/selectors';
import * as actions from '../../../services/shelf/actions';
import * as selectors from '../../../services/shelf/selectors';
import BookOutline from '../../../svgs/BookOutline.svg';
import * as paginationUtils from '../../../utils/pagination';
import { makeLinkProps } from '../../../utils/uri';
import { ResponsiveBooks } from '../../base/Responsive';
import EditButton from './EditButton';
import SearchModal from './SearchModal';
import * as styles from './styles';

function ShelfDetail(props) {
  const {
    addSelectedToShelf,
    bookIds,
    clearSelectedBooks,
    removeShelfFromDetail,
    downloadSelectedUnits,
    history,
    name,
    orderBy,
    orderDirection,
    page,
    removeSelectedFromShelf,
    renameShelf,
    selectBooks,
    showConfirm,
    showPrompt,
    totalBookCount,
    totalSelectedCount,
    uuid,
  } = props;
  const visibleBookCount = bookIds.length;
  const totalPages = totalBookCount == null ? null : paginationUtils.calcPage(totalBookCount, LIBRARY_ITEMS_LIMIT_PER_PAGE);

  const [isEditing, setIsEditing] = React.useState(false);
  const [isAdding, setIsAdding] = React.useState(false);
  const toggleEditingMode = React.useCallback(() => {
    clearSelectedBooks();
    setIsEditing(value => !value);
  }, []);
  const selectAllBooks = React.useCallback(() => selectBooks(bookIds), [bookIds]);
  const confirmRemove = React.useCallback(
    () => {
      removeSelectedFromShelf({ uuid, pageOptions: { orderBy, orderDirection, page } });
    },
    [uuid, orderBy, orderDirection, page],
  );
  const showRemoveConfirm = React.useCallback(() => {
    showConfirm({
      title: '책장에서 책을 삭제하시겠습니까?',
      message: '책장에서 삭제해도 다시 추가할 수 있습니다.',
      confirmLabel: '삭제',
      onClickConfirmButton: confirmRemove,
    });
  }, []);
  const downloadBooks = React.useCallback(() => {
    downloadSelectedUnits();
    clearSelectedBooks();
    setIsEditing(false);
  }, []);
  const handleAddClick = React.useCallback(() => setIsAdding(true), []);
  const handleAddBackClick = React.useCallback(() => {
    clearSelectedBooks();
    setIsAdding(false);
  }, []);
  const confirmShelfRemove = React.useCallback(() => removeShelfFromDetail(uuid, history), [uuid, history]);
  const showShelfRemoveConfirm = React.useCallback(() => {
    showConfirm({
      title: '책장을 삭제하겠습니까?',
      message: '삭제한 책장의 책은 ‘모든 책’에서 볼 수 있습니다.',
      confirmLabel: '삭제',
      onClickConfirmButton: confirmShelfRemove,
    });
  }, []);
  const confirmShelfRename = React.useCallback(
    newName => {
      renameShelf({ uuid, name: newName });
    },
    [uuid],
  );
  const showShelfRenamePrompt = React.useCallback(
    () => {
      showPrompt({
        title: '책장 이름 변경',
        message: '책장의 이름을 입력해주세요.',
        placeHolder: '책장 이름',
        confirmLabel: '확인',
        initialValue: name,
        emptyInputAlertMessage: '책장의 이름을 입력해주세요.',
        onClickConfirmButton: confirmShelfRename,
        limit: SHELF_NAME_LIMIT,
      });
    },
    [name],
  );
  const handleAddSelected = React.useCallback(
    targetUuid => {
      addSelectedToShelf({
        fromShelfPageOptions: { orderBy, orderDirection, page },
        uuid: targetUuid,
        onComplete() {
          clearSelectedBooks();
          setIsAdding(false);
        },
      });
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
        <Link prefetch {...linkProps}>
          <a>더보기</a>
        </Link>
      );
    },
    [uuid],
  );

  React.useEffect(
    () => {
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
        console.log(linkProps);
        // Router.replace(linkProps.href, linkProps.as);
      }
    },
    [page, totalPages],
  );

  function renderShelfBar() {
    const { shelfListPageOptions } = props;
    const left = (
      <Title
        title={name}
        showCount={totalBookCount != null}
        totalCount={totalBookCount}
        href={URLMap[PageType.SHELVES].href}
        as={URLMap[PageType.SHELVES].as}
        query={shelfListPageOptions}
      />
    );
    const right = <EditButton onRemoveClick={showShelfRemoveConfirm} onRenameClick={showShelfRenamePrompt} />;
    return <FlexBar css={styles.shelfBar} flexLeft={left} flexRight={right} />;
  }

  function renderToolbar() {
    const right = (
      <div css={styles.toolsWrapper}>
        <Tools.Add onClickAddButton={handleAddClick} />
        <Tools.Editing toggleEditingMode={toggleEditingMode} />
      </div>
    );
    return <FlexBar css={styles.toolBar} flexRight={right} />;
  }

  function renderPaginator() {
    if (totalPages == null) {
      return null;
    }
    return (
      <ResponsivePaginator
        currentPage={page}
        totalPages={totalPages}
        href={{ pathname: URLMap[PageType.SHELF_DETAIL].href, query: { uuid } }}
        as={URLMap[PageType.SHELF_DETAIL].as({ uuid })}
        query={{ orderBy, orderDirection }}
      />
    );
  }

  function renderMain() {
    const { booksLoading, libraryBooks, platformBooks } = props;
    let books;
    if (
      totalPages == null ||
      libraryBooks == null ||
      (libraryBooks.length === 0 && booksLoading) ||
      (totalPages > 0 && page > totalPages)
    ) {
      books = <SkeletonBooks viewType={ViewType.PORTRAIT} />;
    } else if (libraryBooks.length > 0) {
      books = (
        <>
          <Books
            libraryBookDTO={libraryBooks}
            platformBookDTO={platformBooks}
            isSelectMode={isEditing}
            viewType={ViewType.PORTRAIT}
            linkBuilder={linkBuilder}
          />
          {renderPaginator()}
        </>
      );
    } else {
      return <Empty IconComponent={BookOutline} iconWidth={40} iconHeight={48} message="책장에 도서가 없습니다." />;
    }
    return (
      <div css={styles.paddingForPagination}>
        <ResponsiveBooks>{books}</ResponsiveBooks>
      </div>
    );
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

  const editingBarProps = {
    totalSelectedCount,
    isSelectedAllItem: totalSelectedCount === visibleBookCount,
    onClickSelectAllItem: selectAllBooks,
    onClickUnselectAllItem: clearSelectedBooks,
    onClickSuccessButton: toggleEditingMode,
  };

  const actionBarProps = {
    buttonProps: [
      {
        name: '책장에서 삭제',
        onClick: showRemoveConfirm,
        disable: totalSelectedCount === 0,
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

const getPageOptions = locationSearch => {
  const urlParams = new URLSearchParams(locationSearch);
  const page = parseInt(urlParams.get('page'), 10) || 1;
  const orderBy = urlParams.get('order_by') || '';
  const orderDirection = urlParams.get('order_direction') || '';
  return {
    page,
    orderBy,
    orderDirection,
  };
};

const getUuid = matchParams => matchParams.shelfId;

ShelfDetail.prepare = async ({ dispatch, location, ...matchData }) => {
  const pageOptions = getPageOptions(location.search);
  const uuid = getUuid(matchData.params);

  dispatch(actions.loadShelfBooks(uuid, pageOptions));
  dispatch(actions.loadShelfBookCount(uuid));
};

function mapStateToProps(state, props) {
  const pageOptions = getPageOptions(props.location.search);
  const uuid = getUuid(props.match.params);

  const name = selectors.getShelfName(state, uuid);
  const totalBookCount = selectors.getShelfBookCount(state, uuid);

  const { loading: booksLoading } = selectors.getShelfBooks(state, uuid, pageOptions);
  const libraryBooks = selectors.getLibraryBooks(state, uuid, pageOptions);
  const bookIds = selectors.getBookIds(state, uuid, pageOptions);
  const platformBooks = bookSelectors.getBooks(state, bookIds);

  const totalSelectedCount = selectionSelectors.getTotalSelectedCount(state);

  const shelfListPageOptions = selectors.getListPageOptions(state);
  return {
    bookIds,
    booksLoading,
    libraryBooks,
    name,
    platformBooks,
    shelfListPageOptions,
    totalBookCount,
    totalSelectedCount,
    page: pageOptions.page,
    uuid,
  };
}

const mapDispatchToProps = {
  addSelectedToShelf: actions.addSelectedToShelf,
  clearSelectedBooks: selectionActions.clearSelectedItems,
  removeShelfFromDetail: actions.deleteShelfFromDetail,
  downloadSelectedUnits: actions.downloadSelectedUnits,
  removeSelectedFromShelf: actions.removeSelectedFromShelf,
  renameShelf: actions.renameShelf,
  selectBooks: selectionActions.selectItems,
  showConfirm: confirmActions.showConfirm,
  showPrompt: promptActions.showPrompt,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ShelfDetail);
