import React from 'react';
import { connect } from 'react-redux';
import { css } from 'emotion';

import BookList from '../../components/BookList';
import LibraryBook from '../../components/LibraryBook';
import Paginator from '../../components/Paginator';
import IconButton from '../../components/IconButton';
import Responsive from '../base/Responsive';
import ConnectedLNBTabBar from '../base/LNB/LNBTabBar';
import EditingBar from '../../components/EditingBar';
import FilterModal from '../base/MainModal/FilterModal';
import SortModal from '../base/MainModal/SortModal';

import { loadPurchaseItems, changePurchaseFilter, changePurchaseOrder, changePurchasePage } from '../../services/purchased/main/actions';

import { getBooks } from '../../services/book/selectors';
import { getItemsByPage, getPageInfo, getFilterOptions } from '../../services/purchased/main/selectors';

import { toFlatten } from '../../utils/array';
import { PAGE_COUNT } from '../../constants/page';
import { MainOrderOptions } from '../../constants/orderOptions';

const styles = {
  MainToolBarWrapper: css({
    height: 46,
    backgroundColor: '#f3f4f5',
    boxShadow: '0 2px 10px 0 rgba(0, 0, 0, 0.04)',
    boxSizing: 'border-box',
    borderBottom: '1px solid #d1d5d9',
  }),
  MainToolBar: css({
    padding: '8px 14px',
  }),
  MainToolBarSearchBarWrapper: css({
    float: 'left',
    padding: '8px 0',
    height: 30,
  }),
  MainToolBarToolsWrapper: css({
    float: 'right',
    height: 30,
    padding: '8px 2px 8px 18px',
  }),
  MainToolBarIcon: css({
    margin: '3px 0',
    marginRight: 16,
    width: 24,
    height: 24,

    '.RSGIcon': {
      width: 24,
      height: 24,
    },
  }),
};

class Index extends React.Component {
  static async getInitialProps({ store }) {
    await store.dispatch(loadPurchaseItems());
  }

  constructor(props) {
    super(props);

    this.state = {
      isEditing: false,
      showMoreModal: false,
      showFilterModal: false,
    };

    this.toggleEditingMode = this.toggleEditingMode.bind(this);
    this.toggleFilterModal = this.toggleFilterModal.bind(this);
    this.toggleMoreModal = this.toggleMoreModal.bind(this);
  }

  toggleEditingMode() {
    const { isEditing } = this.state;

    if (isEditing === true) {
      // 현재 Editing 모드면 나가면서 선택해둔 것들 클리어
    }

    this.setState({ isEditing: !isEditing, showFilterModal: false, showMoreModal: false });
  }

  toggleFilterModal() {
    const { showFilterModal } = this.state;
    this.setState({ showFilterModal: !showFilterModal, showMoreModal: false });
  }

  toggleMoreModal() {
    const { showMoreModal } = this.state;
    this.setState({ showMoreModal: !showMoreModal, showFilterModal: false });
  }

  handleChangeFilter(filter) {
    const { changePurchaseFilter: dispatchChangePurchaseFilter } = this.props;
    this.setState({ showFilterModal: false });
    dispatchChangePurchaseFilter(filter);
  }

  handleChangeOrder(order) {
    const { changePurchaseOrder: dispatchChangePurchaseOrder } = this.props;
    this.setState({ showMoreModal: false });
    dispatchChangePurchaseOrder(order);
  }

  renderToolBar() {
    const { isEditing } = this.state;

    if (isEditing) return <EditingBar totalSelectedCount={0} onClickSuccessButton={this.toggleEditingMode} />;

    return (
      <div className={styles.MainToolBarWrapper}>
        <Responsive>
          <div className={styles.MainToolBarSearchBarWrapper} />
          <div className={styles.MainToolBarToolsWrapper}>
            <IconButton icon="check_2" a11y="필터" className={styles.MainToolBarIcon} onClick={this.toggleFilterModal} />
            <IconButton icon="setting" a11y="편집" className={styles.MainToolBarIcon} onClick={this.toggleEditingMode} />
            <IconButton icon="check_1" a11y="정렬" className={styles.MainToolBarIcon} onClick={this.toggleMoreModal} />
          </div>
        </Responsive>
      </div>
    );
  }

  renderModal() {
    const { showFilterModal, showMoreModal } = this.state;
    const {
      pageInfo: { order, filter },
      filterOptions,
    } = this.props;

    return (
      <>
        <FilterModal filter={filter} filterOptions={filterOptions} onClick={this.handleChangeFilter} isActive={showFilterModal} />
        <SortModal order={order} orderOptions={MainOrderOptions.toList()} onClick={this.handleChangeOrder} isActive={showMoreModal} />
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
        {this.renderToolBar()}
        <main>
          <Responsive>
            {this.renderBooks()}
            {this.renderPaginator()}
          </Responsive>
        </main>
        {this.renderModal()}
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
  changePurchaseOrder,
  changePurchasePage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Index);
