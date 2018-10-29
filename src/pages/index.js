import React from 'react';
import Link from 'next/link';
import { connect } from 'react-redux';

import Layout from '../components/Layout';
import { loadShows } from '../services/shows/actions';
import { loadPurchaseItems } from '../services/purchase/actions';

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
    const { purchaseItems, books } = this.props;
    return purchaseItems.map(purchaseItem => (
      <div>
        {books[purchaseItem.b_id].title.main}
        {purchaseItem.service_type}
        {purchaseItem.b_id}
        {purchaseItem.expire_date}
        {purchaseItem.purchase_date}
      </div>
    ));
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
        <div>{this.renderBooks()}</div>
      </Layout>
    );
  }
}

const mapStateToProps = state => {
  const purchaseItems = state.purchase.items;
  const bookIds = purchaseItems.map(item => item.b_id);
  const books = bookIds.reduce((previous, bookId) => {
    previous[bookId] = state.books.books.get(bookId);
    return previous;
  }, {});

  return {
    shows: state.shows.shows,
    purchaseItems,
    books,
  };
};

export default connect(mapStateToProps)(Index);
