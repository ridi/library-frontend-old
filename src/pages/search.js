import React from 'react';
import { connect } from 'react-redux';

import { loadSearchPage } from '../services/search/actions';

import Layout from '../components/Layout';
import {
  getSearchPageInfo,
  getSearchItemsByPage,
} from '../services/search/selectors';
import { getBooks } from '../services/book/selectors';
import { toFlatten } from '../utils/array';

class Search extends React.Component {
  static async getInitialProps({ store }) {
    await store.dispatch(loadSearchPage());
  }

  render() {
    return <Layout>검색페이지</Layout>;
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
