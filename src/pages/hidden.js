import Head from 'next/head';
import React from 'react';
import { connect } from 'react-redux';

import Layout from '../components/Layout';

class Hidden extends React.Component {
  static async getInitialProps({ store }) {}

  render() {
    return (
      <Layout>
        <Head>
          <title>리디북스 - 숨김목록</title>
        </Head>
        <p>숨김 페이지!</p>
      </Layout>
    );
  }
}

const mapStateToProps = state => {};
const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Hidden);
