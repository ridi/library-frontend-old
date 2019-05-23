/** @jsx jsx */
import { jsx } from '@emotion/core';
import Head from 'next/head';
import React from 'react';
import { connect } from 'react-redux';
import { TabBar, TabMenuTypes } from '../../base/LNB';
import ShelvesWrapper from '../../../components/ShelvesWrapper';

class Shelves extends React.Component {
  render() {
    return (
      <>
        <Head>
          <title>책장 목록 - 내 서재</title>
        </Head>
        <TabBar activeMenu={TabMenuTypes.SHELVES} />
        <ShelvesWrapper />
      </>
    );
  }
}

const mapStateToProps = state => {
  console.log(state);
  return {};
};

const mapDispatchToProps = {
  // dispatchSelectAllBooks: selectAllBooks,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Shelves);
