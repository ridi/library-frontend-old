import React from 'react';
import Link from 'next/link';
import { connect } from 'react-redux';

import Layout from '../components/Layout';
import { loadShows } from '../services/shows/actions';
import { loadPurchaseItems } from '../services/purchase/actions';

import { getBooks } from '../services/book/selectors';
import { getItemsByPage, getPageInfo } from '../services/purchase/selectors';
import { toFlatten } from '../utils/array';

import BookList from '../components/BookList';
import LibraryBook from '../components/LibraryBook';
import Paginator from '../components/Paginator';
import { PAGE_COUNT } from '../constants';

const PostLink = ({ id, name }) => (
  <li>
    <Link as={`/p/${id}`} href={`/post?id=${id}`}>
      <a>{name}</a>
    </Link>
  </li>
);

class Index extends React.Component {
  static async getInitialProps({ store }) {
    await store.dispatch(loadShows());
    await store.dispatch(loadPurchaseItems());
  }

  renderBooks() {
    const { items, books } = this.props;
    return (
      <BookList>
        {items.map(item => (
          <LibraryBook item={item} book={books[item.b_id]} />
        ))}
      </BookList>
    );
  }

  renderPaginator() {
    const {
      pageInfo: { currentPage, totalPages },
    } = this.props;

    return (
      <Paginator
        currentPage={currentPage}
        totalPages={totalPages}
        pageCount={PAGE_COUNT}
        pathname="/"
      />
    );
  }

  render() {
    const { shows } = this.props;
    return (
      <Layout>
        <h1>Batman TV Shows</h1>
        <ul>
          {shows.map(({ show }) => (
            <PostLink id={show.id} name={show.name} />
          ))}
        </ul>
        <br />
        <hr />
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
  return {
    shows: state.shows.shows,
    pageInfo,
    items,
    books,
  };
};

export default connect(mapStateToProps)(Index);
