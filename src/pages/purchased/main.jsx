import React from 'react';
import { connect } from 'react-redux';

import BookList from '../../components/BookList';
import LibraryBook from '../../components/LibraryBook';
import Paginator from '../../components/Paginator';
import ConnectedEditingBar from '../../components/EditingBar';
import ConnectedMainToolBar from '../base/MainToolBar';
import ConnectedSortModal from '../base/MainModal/SortModal';

import ConnectedLNBTabBar from '../base/LNB/LNBTabBar';

import { loadPurchaseItems, changePurchaseFilter, changePurchasePage } from '../../services/purchased/main/actions';

import { getBooks } from '../../services/book/selectors';
import { getItemsByPage, getPageInfo, getFilterOptions } from '../../services/purchased/main/selectors';

import { toFlatten } from '../../utils/array';
import { PAGE_COUNT } from '../../constants/page';

class Index extends React.Component {
  static async getInitialProps({ store }) {
    await store.dispatch(loadPurchaseItems());
  }

  renderBooks() {
    const { items, books } = this.props;
    return (
      <BookList>
        {items.map(item => (
          <LibraryBook key={item.b_id} item={item} book={books[item.b_id]} />
        ))}
      </BookList>
    );
  }

  renderPaginator() {
    const {
      pageInfo: { currentPage, totalPages },
      changePurchasePage: dispatchChangePurchasePage,
    } = this.props;

    return (
      <Paginator
        currentPage={currentPage}
        totalPages={totalPages}
        pageCount={PAGE_COUNT}
        onClickPageItem={page => dispatchChangePurchasePage(page)}
      />
    );
  }

  render() {
    return (
      <>
        <ConnectedLNBTabBar />
        <main>
          <ConnectedMainToolBar />
          {this.renderBooks()}
          {this.renderPaginator()}
        </main>
      </>
    );
  }
}

const mapStateToProps = state => {
  const pageInfo = getPageInfo(state);
  const filterOptions = getFilterOptions(state);
  const items = getItemsByPage(state);
  const books = getBooks(state, toFlatten(items, 'b_id'));
  return {
    pageInfo,
    filterOptions,
    items,
    books,
  };
};

const mapDispatchToProps = {
  changePurchaseFilter,
  changePurchasePage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Index);
