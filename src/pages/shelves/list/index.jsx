/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import Head from 'next/head';
import React from 'react';
import { connect } from 'react-redux';
import { EmptyShelves } from '../../../components/Empty/EmptyShelves';
import { Shelves } from '../../../components/Shelves';
import { SkeletonShelves } from '../../../components/Skeleton/SkeletonShelves';
import Footer from '../../base/Footer';
import { TabBar, TabMenuTypes } from '../../base/LNB';
import FlexBar from '../../../components/FlexBar';
import { Editing } from '../../../components/Tool';
import Editable from '../../../components/Editable';
import Responsive from '../../base/Responsive';

const toolBar = css`
  border-bottom: 1px solid #d1d5d9;
  box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.04);
  background-color: #f3f4f5;
`;

class ShelvesList extends React.Component {
  renderToolBar = () => <FlexBar css={toolBar} flexLeft={<div />} flexRight={<Editing />} />;

  renderMain() {
    const { shelves } = this.props;
    if (shelves == null) return <SkeletonShelves />;
    return shelves.length > 0 ? <Shelves shelves={shelves} /> : <EmptyShelves />;
  }

  render() {
    return (
      <>
        <Head>
          <title>책장 - 내 서재</title>
        </Head>
        <TabBar activeMenu={TabMenuTypes.SHELVES} />
        <Editable allowFixed isEditing={false} nonEditBar={this.renderToolBar()} editingBarProps={{}} actionBarProps={{}}>
          <main>
            <Responsive>{this.renderMain()}</Responsive>
          </main>
        </Editable>
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
      {
        id: '000002',
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
        id: '111113',
        name: 'NNyamm 기본 책장',
        totalCount: 12,
        thumbnails: [
          '//misc.ridibooks.com/cover/1811142372/xxlarge',
          '//misc.ridibooks.com/cover/425108841/xxlarge',
          '//misc.ridibooks.com/cover/2057072518/xxlarge',
        ],
        selectMode: false,
      },
      {
        id: '111114',
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
)(ShelvesList);
