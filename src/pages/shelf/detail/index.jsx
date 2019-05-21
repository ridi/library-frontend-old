/** @jsx jsx */
import { jsx } from '@emotion/core';
import Head from 'next/head';
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { Books } from '../../../components/Books';
import Editable from '../../../components/Editable';
import FlexBar from '../../../components/FlexBar';
import SkeletonBooks from '../../../components/Skeleton/SkeletonBooks';
import Title from '../../../components/TitleBar/Title';
import ViewType from '../../../constants/viewType';
import * as bookSelectors from '../../../services/book/selectors';
import * as actions from '../../../services/shelf/actions';
import * as selectors from '../../../services/shelf/selectors';
import { ResponsiveBooks } from '../../base/Responsive';

const shelfBar = {
  backgroundColor: '#ffffff',
  borderTop: '1px solid #f3f4f5',
  borderBottom: '1px solid #d1d5d9',
  marginTop: -1,
};

function ShelfDetail(props) {
  const linkBuilder = React.useCallback(() => null, []);

  function renderShelfBar() {
    const { name } = props;
    const left = <Title title={name} showCount={false} href="" as="/shelves" query={{}} />;
    return <FlexBar css={shelfBar} flexLeft={left} />;
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
          isSelectMode={false}
          viewType={ViewType.PORTRAIT}
          linkBuilder={linkBuilder}
        />
      );
    }
    return <ResponsiveBooks>{books}</ResponsiveBooks>;
  }

  return (
    <>
      <Head>
        <title>{props.name} - 내 서재</title>
      </Head>
      <Editable allowFixed isEditing={false} nonEditBar={renderShelfBar()} editingBarProps={{}} actionBarProps={{}}>
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

function mapStateToPropsFactory() {
  const selectLibraryBooks = createSelector(
    items => items,
    items =>
      items &&
      items.map(item => ({
        unit_count: item.bookIds.length,
        is_ridiselect: false,
        b_id: item.bookIds[0],
        purchase_date: new Date(0),
        unit_id: item.unitId,
      })),
  );

  const selectBookIds = createSelector(
    items => items,
    items => (items == null ? [] : items.map(item => item.bookIds[0])),
  );

  return function mapStateToProps(state, props) {
    const { uuid, page, orderBy, orderDirection } = props;
    const name = selectors.getShelfName(state, uuid);
    const bookCount = selectors.getShelfBookCount(state, uuid);
    const { loading: booksLoading, items } = selectors.getShelfBooks(state, uuid, { orderBy, orderDirection, page });
    const libraryBooks = selectLibraryBooks(items);
    const bookIds = selectBookIds(items);
    const platformBooks = bookSelectors.getBooks(state, bookIds);
    return {
      bookCount,
      booksLoading,
      items,
      libraryBooks,
      name,
      platformBooks,
    };
  };
}

export default connect(mapStateToPropsFactory)(ShelfDetail);
