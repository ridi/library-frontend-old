import Head from 'next/head';
import React from 'react';
import { connect } from 'react-redux';

import Layout from '../../components/Layout';
import BookList from '../../components/BookList';
import LibraryBook from '../../components/LibraryBook';
import Paginator from '../../components/Paginator';

import { getBooks } from '../../services/book/selectors';
import { loadPurchasedHiddenItems } from '../../services/purchased/hidden/actions';
import { getItemsByPage, getPageInfo, getItemTotalCount } from '../../services/purchased/hidden/selectors';
import { PAGE_COUNT } from '../../constants/page';

import { toFlatten } from '../../utils/array';

class Hidden extends React.Component {
  static async getInitialProps({ store }) {
    await store.dispatch(loadPurchasedHiddenItems());
  }

  renderBooks() {
    const { items, books } = this.props;
    return (
      <BookList>
        {items.map(item => (
          <LibraryBook key={item.b_id} item={item} book={books[item.b_id]} />
        ))}
      </BookList>
    );
  }

  renderPaginator() {
    const {
      pageInfo: { currentPage, totalPages },
    } = this.props;

    return <Paginator currentPage={currentPage} totalPages={totalPages} pageCount={PAGE_COUNT} pathname="/purchased/hidden/" query={{}} />;
  }

  render() {
    const { itemTotalCount } = this.props;
    return (
      <Layout>
        <Head>
          <title>리디북스 - 숨김목록</title>
        </Head>
        <h1>{`숨김 목록 - 총 ${itemTotalCount}권`}</h1>
        {this.renderBooks()}
        {this.renderPaginator()}
      </Layout>
    );
  }
}

const mapStateToProps = state => {
  const pageInfo = getPageInfo(state);
  const items = getItemsByPage(state);
  const books = getBooks(state, toFlatten(items, 'b_id'));
  const itemTotalCount = getItemTotalCount(state);
  return {
    pageInfo,
    items,
    books,
    itemTotalCount,
  };
};

export default connect(mapStateToProps)(Hidden);
