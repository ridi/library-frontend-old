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
import * as actions from '../../../services/shelf/actions';
import * as selectors from '../../../services/shelf/selectors';

const toolBar = css`
  border-bottom: 1px solid #d1d5d9;
  box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.04);
  background-color: #f3f4f5;
`;

class ShelvesList extends React.Component {
  static async getInitialProps({ query, store }) {
    const page = parseInt(query.page, 10) || 1;
    const orderBy = '';
    const orderDirection = '';
    store.dispatch(actions.loadShelves({ orderBy, orderDirection, page }));
    return {
      page,
      orderBy,
      orderDirection,
    };
  }

  renderToolBar = () => <FlexBar css={toolBar} flexLeft={<div />} flexRight={<Editing />} />;

  renderMain() {
    const { loading: isLoading, items: shelfIds } = this.props.shelves;
    if (shelfIds == null || (shelfIds.length === 0 && isLoading)) return <SkeletonShelves />;
    return shelfIds.length > 0 ? <Shelves shelfIds={shelfIds} /> : <EmptyShelves />;
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

const mapStateToProps = (state, props) => {
  const { orderBy, orderDirection, page } = props;
  const pageOptions = { orderBy, orderDirection, page };
  const shelves = selectors.getShelves(state, pageOptions);
  return { shelves };
};

const mapDispatchToProps = {
  // dispatchSelectAllBooks: selectAllBooks,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ShelvesList);
