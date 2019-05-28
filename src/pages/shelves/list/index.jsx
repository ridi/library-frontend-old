/** @jsx jsx */
import { jsx } from '@emotion/core';
import Head from 'next/head';
import React from 'react';
import { connect } from 'react-redux';
import { EmptyShelves } from '../../../components/Empty/EmptyShelves';
import { Shelf } from '../../../components/Shelf';
import { SkeletonShelves } from '../../../components/Skeleton/SkeletonShelves';
import { ShelvesWrapper } from '../../../components/ShelvesWrapper';
import Footer from '../../base/Footer';
import { TabBar, TabMenuTypes } from '../../base/LNB';

class Shelves extends React.Component {
  renderMain() {
    const { shelves } = this.props;
    if (shelves == null) return <SkeletonShelves />;
    return shelves.length > 0 ? (
      <ShelvesWrapper>
        {shelves.map(shelf => (
          <Shelf key={shelf.id} {...shelf} />
        ))}
      </ShelvesWrapper>
    ) : (
      <EmptyShelves />
    );
  }

  render() {
    return (
      <>
        <Head>
          <title>책장 목록 - 내 서재</title>
        </Head>
        <TabBar activeMenu={TabMenuTypes.SHELVES} />
        <main>{this.renderMain()}</main>
        <Footer />
      </>
    );
  }
}

const mapStateToProps = state => {
  console.log(state);
  return {
    shelves: [
      {
        id: '000000',
        name: 'NNyamm 기본 책장1',
        totalCount: 1782,
        thumbnails: [
          '//misc.ridibooks.com/cover/1811142372/xxlarge',
          '//misc.ridibooks.com/cover/425108841/xxlarge',
          // '//misc.ridibooks.com/cover/2057072518/xxlarge',
        ],
        selectMode: false,
      },
      {
        id: '111111',
        name: 'NNyamm 기본 책장',
        totalCount: 12,
        thumbnails: [
          '//misc.ridibooks.com/cover/1811142372/xxlarge',
          '//misc.ridibooks.com/cover/425108841/xxlarge',
          '//misc.ridibooks.com/cover/2057072518/xxlarge',
        ],
        selectMode: false,
      },
    ],
  };
};

const mapDispatchToProps = {
  // dispatchSelectAllBooks: selectAllBooks,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Shelves);
