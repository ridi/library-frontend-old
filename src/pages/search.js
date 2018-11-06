import React from 'react';
import { connect } from 'react-redux';

import { loadSearchPage } from '../services/search/actions';

import Layout from '../components/Layout';

class Search extends React.Component {
  static async getInitialProps({ store }) {
    await store.dispatch(loadSearchPage());
  }

  render() {
    return <Layout>검색페이지</Layout>;
  }
}

const mapStateToProps = state => ({});
const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Search);
