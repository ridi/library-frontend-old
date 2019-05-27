/** @jsx jsx */
import { jsx } from '@emotion/core';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import { connect } from 'react-redux';

import { Books } from '../../../components/Books';
import Editable from '../../../components/Editable';
import FlexBar from '../../../components/FlexBar';
import SkeletonBooks from '../../../components/Skeleton/SkeletonBooks';
import Title from '../../../components/TitleBar/Title';
import * as Tools from '../../../components/Tool';
import { URLMap } from '../../../constants/urls';
import ViewType from '../../../constants/viewType';
import * as bookSelectors from '../../../services/book/selectors';
import * as confirmActions from '../../../services/confirm/actions';
import * as selectionActions from '../../../services/selection/actions';
import * as selectionSelectors from '../../../services/selection/selectors';
import * as actions from '../../../services/shelf/actions';
import * as selectors from '../../../services/shelf/selectors';
import { makeLinkProps } from '../../../utils/uri';
import { ResponsiveBooks } from '../../base/Responsive';

const shelfBar = {
  backgroundColor: '#ffffff',
  borderTop: '1px solid #f3f4f5',
  borderBottom: '1px solid #d1d5d9',
  marginTop: -1,
};

const toolsWrapper = {
  flex: 'auto',
  justifyContent: 'flex-end',
  display: 'flex',
  alignItems: 'center',
  paddingLeft: 2,
  whiteSpace: 'nowrap',
};

function ShelfDetail(props) {
  const {
    bookIds,
    clearSelectedBooks,
    orderBy,
    orderDirection,
    page,
    removeSelectedFromShelf,
    selectBooks,
    showConfirm,
    totalSelectedCount,
    uuid,
  } = props;
  const visibleBookCount = bookIds.length;

  const [isEditing, setIsEditing] = React.useState(false);
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
    showConfirm('책장에서 책을 삭제하시겠습니까?', '책장에서 삭제해도 다시 추가할 수 있습니다.', '삭제', confirmRemove);
  }, []);

  const linkBuilder = React.useCallback(
    libraryBook => {
      const unitId = libraryBook.unit_id;
      const linkProps = makeLinkProps(
        {
          pathname: URLMap.shelfUnit.href,
          query: { uuid, unitId },
        },
        URLMap.shelfUnit.as({ uuid, unitId }),
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

  function renderShelfBar() {
    const { name } = props;
    const left = <Title title={name} showCount={false} href="/shelves/list" as="/shelves" query={{}} />;
    const right = (
      <div css={toolsWrapper}>
        <Tools.Editing toggleEditingMode={toggleEditingMode} />
      </div>
    );
    return <FlexBar css={shelfBar} flexLeft={left} flexRight={right} />;
  }

  function renderMain() {
    const { booksLoading, libraryBooks, platformBooks } = props;
    let books = null;
    if (libraryBooks == null || (libraryBooks.length === 0 && booksLoading)) {
      books = <SkeletonBooks viewType={ViewType.PORTRAIT} />;
    } else if (libraryBooks.length > 0) {
      books = (
        <Books
          libraryBookDTO={libraryBooks}
          platformBookDTO={platformBooks}
          isSelectMode={isEditing}
          viewType={ViewType.PORTRAIT}
          linkBuilder={linkBuilder}
        />
      );
    }
    return <ResponsiveBooks>{books}</ResponsiveBooks>;
  }

  const editingBarProps = {
    totalSelectedCount,
    isSelectedAllBooks: totalSelectedCount === visibleBookCount,
    onClickSelectAllBooks: selectAllBooks,
    onClickUnselectAllBooks: clearSelectedBooks,
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
        name: '다운로드',
        onClick() {},
        disable: totalSelectedCount === 0,
      },
    ],
  };

  return (
    <>
      <Head>
        <title>{props.name} - 내 서재</title>
      </Head>
      <Editable
        allowFixed
        isEditing={isEditing}
        nonEditBar={renderShelfBar()}
        editingBarProps={editingBarProps}
        actionBarProps={actionBarProps}
      >
        <main>{renderMain()}</main>
      </Editable>
    </>
  );
}

ShelfDetail.getInitialProps = async ({ query, store }) => {
  const { uuid } = query;
  const page = parseInt(query.page, 10) || 1;
  const orderBy = '';
  const orderDirection = '';
  store.dispatch(actions.loadShelfBooks(uuid, { orderBy, orderDirection, page }));
  store.dispatch(actions.loadShelfBookCount(uuid));
  return {
    uuid,
    page,
    orderBy,
    orderDirection,
  };
};

function mapStateToProps(state, props) {
  const { uuid, page, orderBy, orderDirection } = props;
  const name = selectors.getShelfName(state, uuid);
  const bookCount = selectors.getShelfBookCount(state, uuid);

  const pageOptions = { orderBy, orderDirection, page };
  const { loading: booksLoading } = selectors.getShelfBooks(state, uuid, pageOptions);
  const libraryBooks = selectors.getLibraryBooks(state, uuid, pageOptions);
  const bookIds = selectors.getBookIds(state, uuid, pageOptions);
  const platformBooks = bookSelectors.getBooks(state, bookIds);

  const totalSelectedCount = selectionSelectors.getTotalSelectedCount(state);
  return {
    bookCount,
    bookIds,
    booksLoading,
    libraryBooks,
    name,
    platformBooks,
    totalSelectedCount,
  };
}

const mapDispatchToProps = {
  clearSelectedBooks: selectionActions.clearSelectedBooks,
  removeSelectedFromShelf: actions.removeSelectedFromShelf,
  selectBooks: selectionActions.selectBooks,
  showConfirm: confirmActions.showConfirm,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ShelfDetail);
