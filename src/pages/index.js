import React from 'react';
import Link from 'next/link';
import { connect } from 'react-redux';

import Layout from '../components/Layout';
import BookList from '../components/BookList';
import LibraryBook from '../components/LibraryBook';
import Paginator from '../components/Paginator';
import SelectBox from '../components/SelectBox';

import { loadShows } from '../services/shows/actions';
import {
  loadPurchaseItems,
  changePurchaseOrder,
} from '../services/purchase/actions';

import { getBooks } from '../services/book/selectors';
import { getItemsByPage, getPageInfo } from '../services/purchase/selectors';

import { toFlatten } from '../utils/array';
import { PAGE_COUNT } from '../constants/page';
import { MainOrderOptions } from '../constants/orderOptions';

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

  renderPageOptions() {
    const {
      pageInfo: { order },
      changePurchaseOrder: dispatchChangePurchaseOrder,
    } = this.props;

    return (
      <>
        <SelectBox
          selected={order}
          options={MainOrderOptions.toList()}
          onChange={value => dispatchChangePurchaseOrder(value)}
        />
      </>
    );
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
      pageInfo: { currentPage, totalPages, order },
    } = this.props;

    return (
      <Paginator
        currentPage={currentPage}
        totalPages={totalPages}
        pageCount={PAGE_COUNT}
        pathname="/"
        query={{ order }}
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
        {this.renderPageOptions()}
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

const mapDispatchToProps = {
  changePurchaseOrder,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Index);
