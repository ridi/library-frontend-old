import React from 'react';
import { connect } from 'react-redux';

import Layout from '../../components/Layout';
import BookList from '../../components/BookList';
import LibraryBook from '../../components/LibraryBook/index';
import Paginator from '../../components/Paginator';
import SelectBox from '../../components/SelectBox/index';

import {
  loadPurchasedUnitItems,
  changePurchasedUnitOrder,
  changePurchasedUnitFilter,
  setPurchasedUnitId,
} from '../../services/purchased/mainUnit/actions';

import { getBooks } from '../../services/book/selectors';
import { getItemsByPage, getPageInfo, getFilterOptions } from '../../services/purchased/mainUnit/selectors';

import { toFlatten } from '../../utils/array';
import { PAGE_COUNT } from '../../constants/page';
import { MainOrderOptions } from '../../constants/orderOptions';

class PurchasedMainUnit extends React.Component {
  static async getInitialProps({ store, query }) {
    await store.dispatch(setPurchasedUnitId(query.unitId));
    await store.dispatch(loadPurchasedUnitItems());
  }

  renderPageOptions() {
    const {
      pageInfo: { order, filter },
      filterOptions,
      changePurchaseOrder: dispatchChangePurchaseOrder,
      changePurchaseFilter: dispatchChangePurchaseFilter,
    } = this.props;

    return (
      <>
        <SelectBox
          selected={order}
          options={MainOrderOptions.toList()}
          onChange={value => dispatchChangePurchaseOrder(value)}
        />
        <SelectBox selected={filter} options={filterOptions} onChange={value => dispatchChangePurchaseFilter(value)} />
      </>
    );
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
      pageInfo: { currentPage, totalPages, orderType, orderBy, filter, unitId },
    } = this.props;

    return (
      <Paginator
        currentPage={currentPage}
        totalPages={totalPages}
        pageCount={PAGE_COUNT}
        pathname={`/purchased/${unitId}`}
        query={{ orderType, orderBy, filter }}
      />
    );
  }

  render() {
    return (
      <Layout>
        <div>Unit id: {this.props.pageInfo.unitId}</div>
        {this.renderPageOptions()}
        {this.renderBooks()}
        {this.renderPaginator()}
      </Layout>
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
  changePurchaseOrder: changePurchasedUnitOrder,
  changePurchaseFilter: changePurchasedUnitFilter,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PurchasedMainUnit);
