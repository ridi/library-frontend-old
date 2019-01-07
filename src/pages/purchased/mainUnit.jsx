import Head from 'next/head';

/** @jsx jsx */
import React from 'react';
import { connect } from 'react-redux';
import { css, jsx } from '@emotion/core';

import BookList from '../../components/BookList';
import EmptyBookList from '../../components/EmptyBookList';
import LibraryBook from '../../components/LibraryBook/index';
import ResponsivePaginator from '../../components/ResponsivePaginator';

import { getBooks } from '../../services/book/selectors';

import { toFlatten } from '../../utils/array';
import LNBTitleBar from '../base/LNB/LNBTitleBar';
import Responsive from '../base/Responsive';
import { URLMap } from '../../constants/urls';
import LNBTabBar, { TabMenuTypes } from '../base/LNB/LNBTabBar';
import { BottomActionBar, BottomActionButton } from '../../components/BottomActionBar';
import EditingBar from '../../components/EditingBar';
import IconButton from '../../components/IconButton';
import SortModal from '../base/MainModal/SortModal';
import { MainOrderOptions } from '../../constants/orderOptions';
import ModalBackground from '../../components/ModalBackground';
import { getItemsByPage, getPageInfo, getSelectedBooks, getTotalCount, getUnit } from '../../services/purchased/mainUnit/selectors';
import {
  loadItems,
  setUnitId,
  clearSelectedBooks,
  downloadSelectedBooks,
  hideSelectedBooks,
  selectAllBooks,
  toggleSelectBook,
} from '../../services/purchased/mainUnit/actions';

const styles = {
  MainToolBarWrapper: css({
    height: 46,
    backgroundColor: '#f3f4f5',
    boxShadow: '0 2px 10px 0 rgba(0, 0, 0, 0.04)',
    boxSizing: 'border-box',
    borderBottom: '1px solid #d1d5d9',
  }),
  MainToolBar: css({
    display: 'flex',
  }),
  MainToolBarSearchBarWrapper: css({
    padding: '8px 0',
    height: 30,
    flex: 1,
    maxWidth: 600,
  }),
  MainToolBarSearchBarWrapperActive: css({
    maxWidth: 'initial',
  }),
  MainToolBarToolsWrapper: css({
    height: 30,
    padding: '8px 0 8px 16px',
    marginLeft: 'auto',
  }),
  MainToolBarIcon: css({
    margin: '3px 0',
    width: 24,
    height: 24,
    marginRight: 16,
    '&:last-of-type': {
      marginRight: 0,
    },
    '.RSGIcon': {
      width: 24,
      height: 24,
    },
  }),
  MainButtonActionLeft: css({
    float: 'left',
  }),
  MainButtonActionRight: css({
    float: 'right',
  }),
};

class MainUnit extends React.Component {
  static async getInitialProps({ store, query }) {
    await store.dispatch(setUnitId(query.unitId));
    await store.dispatch(loadItems());
  }

  constructor(props) {
    super(props);

    this.state = {
      isEditing: false,
      showMoreModal: false,
    };
  }

  toggleEditingMode = () => {
    const { isEditing } = this.state;
    const { dispatchClearSelectedBooks } = this.props;

    if (isEditing === true) {
      dispatchClearSelectedBooks();
    }

    this.setState({ isEditing: !isEditing, showMoreModal: false });
  };

  toggleMoreModal = () => {
    const { showMoreModal } = this.state;
    this.setState({ showMoreModal: !showMoreModal });
  };

  handleOnClickOutOfModal = () => {
    this.setState({ showMoreModal: false });
  };

  handleOnClickHide = () => {
    const { dispatchHideSelectedBooks, dispatchClearSelectedBooks } = this.props;

    dispatchHideSelectedBooks();
    dispatchClearSelectedBooks();
    this.setState({ isEditing: false });
  };

  handleOnClickDownload = () => {
    const { dispatchDownloadSelectedBooks, dispatchClearSelectedBooks } = this.props;

    dispatchDownloadSelectedBooks();
    dispatchClearSelectedBooks();
    this.setState({ isEditing: false });
  };

  renderToolBar() {
    const { isEditing } = this.state;
    const { items, selectedBooks, dispatchSelectAllBooks, dispatchClearSelectedBooks } = this.props;

    if (isEditing) {
      const selectedCount = Object.keys(selectedBooks).length;
      const isSelectedAllBooks = selectedCount === items.length;
      return (
        <EditingBar
          totalSelectedCount={selectedCount}
          isSelectedAllBooks={isSelectedAllBooks}
          onClickSelectAllBooks={dispatchSelectAllBooks}
          onClickUnselectAllBooks={dispatchClearSelectedBooks}
          onClickSuccessButton={this.toggleEditingMode}
        />
      );
    }

    return (
      <div css={styles.MainToolBarWrapper}>
        <Responsive css={styles.MainToolBar}>
          <div css={styles.MainToolBarToolsWrapper}>
            <IconButton icon="check_3" a11y="편집" css={styles.MainToolBarIcon} onClick={this.toggleEditingMode} />
            <IconButton icon="check_1" a11y="정렬" css={styles.MainToolBarIcon} onClick={this.toggleMoreModal} />
          </div>
        </Responsive>
      </div>
    );
  }

  renderModal() {
    const { showMoreModal } = this.state;
    const {
      pageInfo: { order },
    } = this.props;

    return <SortModal order={order} orderOptions={MainOrderOptions.toList()} isActive={showMoreModal} />;
  }

  renderModalBackground() {
    const { showMoreModal } = this.state;
    return <ModalBackground isActive={showMoreModal} onClickModalBackground={this.handleOnClickOutOfModal} />;
  }

  renderBooks() {
    const { isEditing } = this.state;
    const { items, books, selectedBooks, dispatchToggleSelectBook } = this.props;

    if (items.length === 0) {
      return <EmptyBookList message="구매/대여하신 책이 없습니다." />;
    }

    return (
      <BookList>
        {items.map(item => (
          <LibraryBook
            key={item.b_id}
            item={item}
            book={books[item.b_id]}
            isEditing={isEditing}
            checked={!!selectedBooks[item.b_id]}
            onChangeCheckbox={() => dispatchToggleSelectBook(item.b_id)}
          />
        ))}
      </BookList>
    );
  }

  renderPaginator() {
    const {
      pageInfo: { orderType, orderBy, currentPage, totalPages, unitId },
    } = this.props;

    return (
      <ResponsivePaginator
        currentPage={currentPage}
        totalPages={totalPages}
        href={{ pathname: URLMap.mainUnit.href, query: { unitId } }}
        as={URLMap.mainUnit.as(unitId)}
        query={{ orderType, orderBy }}
      />
    );
  }

  renderBottomActionBar() {
    const { isEditing } = this.state;
    const { selectedBooks } = this.props;
    if (!isEditing) {
      return null;
    }

    const disable = Object.keys(selectedBooks).length === 0;
    return (
      <BottomActionBar>
        <BottomActionButton name="선택 숨기기" css={styles.MainButtonActionLeft} onClick={this.handleOnClickHide} disable={disable} />
        <BottomActionButton
          name="선택 다운로드"
          css={styles.MainButtonActionRight}
          onClick={this.handleOnClickDownload}
          disable={disable}
        />
      </BottomActionBar>
    );
  }

  render() {
    const { isEditing } = this.state;
    const { unit, totalCount } = this.props;

    return (
      <>
        <Head>
          <title>{unit.title} - 내 서재</title>
        </Head>
        <LNBTabBar activeMenu={TabMenuTypes.ALL_BOOKS} />
        {isEditing ? (
          this.renderToolBar()
        ) : (
          <LNBTitleBar
            title={unit.title}
            totalCount={totalCount.itemTotalCount}
            onClickEditingMode={this.toggleEditingMode}
            href={URLMap.main.href}
            as={URLMap.main.as}
          />
        )}
        <main>
          <Responsive>
            {this.renderBooks()}
            {this.renderPaginator()}
            {this.renderModal()}
          </Responsive>
        </main>
        {this.renderBottomActionBar()}
        {this.renderModalBackground()}
      </>
    );
  }
}

const mapStateToProps = state => {
  const pageInfo = getPageInfo(state);
  const items = getItemsByPage(state);
  const unit = getUnit(state);
  const books = getBooks(state, toFlatten(items, 'b_id'));
  const totalCount = getTotalCount(state);
  const selectedBooks = getSelectedBooks(state);

  return {
    pageInfo,
    items,
    unit,
    books,
    totalCount,
    selectedBooks,
  };
};

const mapDispatchToProps = {
  dispatchSelectAllBooks: selectAllBooks,
  dispatchClearSelectedBooks: clearSelectedBooks,
  dispatchToggleSelectBook: toggleSelectBook,
  dispatchHideSelectedBooks: hideSelectedBooks,
  dispatchDownloadSelectedBooks: downloadSelectedBooks,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MainUnit);
