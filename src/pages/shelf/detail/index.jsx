/** @jsx jsx */
import { jsx } from '@emotion/core';
import Head from 'next/head';
import { connect } from 'react-redux';

import { Books } from '../../../components/Books';
import Editable from '../../../components/Editable';
import FlexBar from '../../../components/FlexBar';
import SkeletonBooks from '../../../components/Skeleton/SkeletonBooks';
import Title from '../../../components/TitleBar/Title';
import ViewType from '../../../constants/viewType';
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
  function renderShelfBar() {
    const { name } = props;
    const left = <Title title={name} showCount={false} href="" as="/shelves" query={{}} />;
    return <FlexBar css={shelfBar} flexLeft={left} />;
  }

  function renderMain() {
    const { booksLoading, items } = props;
    let books = null;
    if (items == null || (items.length === 0 && booksLoading)) {
      books = <SkeletonBooks viewType={ViewType.PORTRAIT} />;
    } else if (items.length > 0) {
      const bookIds = items.map(item => item.bookIds[0]);
      books = <Books bookIds={bookIds} platformBookDTO={{}} isSelectMode={false} viewType={ViewType.PORTRAIT} linkBuilder={{}} />;
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

function mapStateToProps(state, props) {
  const { uuid, page, orderBy, orderDirection } = props;
  const name = selectors.getShelfName(state, uuid);
  const bookCount = selectors.getShelfBookCount(state, uuid);
  const tmp = selectors.getShelfBooks(state, uuid, { orderBy, orderDirection, page });
  const { loading: booksLoading, items } = tmp;
  return {
    bookCount,
    booksLoading,
    items,
    name,
  };
}

export default connect(mapStateToProps)(ShelfDetail);
