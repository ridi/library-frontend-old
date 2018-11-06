import React from 'react';
import { connect } from 'react-redux';

import { loadSearchPage } from '../services/search/actions';

import Layout from '../components/Layout';
import Paginator from '../components/Paginator';
import BookList from '../components/BookList';
import LibraryBook from '../components/LibraryBook';

import {
  getSearchPageInfo,
  getSearchItemsByPage,
} from '../services/search/selectors';
import { getBooks } from '../services/book/selectors';
import { toFlatten } from '../utils/array';
import { PAGE_COUNT } from '../constants/page';

class Search extends React.Component {
  static async getInitialProps({ store }) {
    await store.dispatch(loadSearchPage());
  }

  renderPageOptions() {
    const {
      pageInfo: { keyword },
    } = this.props;

    return <>{keyword}</>;
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
      pageInfo: { currentPage, totalPages, keyword },
    } = this.props;

    return (
      <Paginator
        currentPage={currentPage}
        totalPages={totalPages}
        pageCount={PAGE_COUNT}
        pathname="/purchases/search"
        query={{ keyword }}
      />
    );
  }

  render() {
    return (
      <Layout>
        <h1>검색페이지</h1>
        {this.renderPageOptions()}
        {this.renderBooks()}
        {this.renderPaginator()}
      </Layout>
    );
  }
}

const mapStateToProps = state => {
  const pageInfo = getSearchPageInfo(state);
  const items = getSearchItemsByPage(state);
  const books = getBooks(state, toFlatten(items, 'b_id'));

  return {
    pageInfo,
    items,
    books,
  };
};
const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Search);
