import React from 'react';
import Editable from './Editable';
import Responsive from '../pages/base/Responsive';
import SkeletonBookList from './Skeleton/SkeletonBookList';
import ViewType from '../constants/viewType';
import EmptyBookList from './EmptyBookList';
import ResponsivePaginator from './ResponsivePaginator';
import SeriesToolBar from './SeriesToolBar';
import UnitSortModal from '../pages/base/Modal/UnitSortModal';
import { LibraryBooks } from './LibraryBooks';

export default class SeriesView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      showSortModal: false,
    };
  }

  toggleEditingMode = () => {
    const { isEditing } = this.state;
    this.setState({ isEditing: !isEditing, showSortModal: false });
  };

  toggleSortModal = () => {
    const { showSortModal } = this.state;
    this.setState({ showSortModal: !showSortModal });
  };

  makeEditingBarProps() {
    const { items, selectedBooks, onClickSelectAllBooks, onClickUnselectAllBooks } = this.props;
    const totalSelectedCount = Object.keys(selectedBooks).length;
    const isSelectedAllBooks = totalSelectedCount === items.length;

    return {
      totalSelectedCount,
      isSelectedAllBooks,
      onClickSelectAllBooks,
      onClickUnselectAllBooks,
      onClickSuccessButton: this.toggleEditingMode,
    };
  }

  wrapActionBarProps() {
    const { actionBarProps } = this.props;

    const _wrapOnClick = onClick => () => {
      onClick();
      this.setState({ isEditing: false });
    };

    return {
      buttonProps: actionBarProps.buttonProps.map(buttonProp => ({
        ...buttonProp,
        onClick: _wrapOnClick(buttonProp.onClick),
      })),
    };
  }

  renderSeriesToolBar() {
    const { currentOrder, orderOptions } = this.props;
    let orderTitle = null;
    if (orderOptions && orderOptions[currentOrder]) {
      orderTitle = orderOptions[currentOrder].title;
    }
    return <SeriesToolBar orderTitle={orderTitle} toggleSortModal={this.toggleSortModal} toggleEditingMode={this.toggleEditingMode} />;
  }

  renderBooks() {
    const { isEditing } = this.state;
    const {
      items,
      books,
      selectedBooks,
      onSelectedChange,
      isFetching,
      emptyProps: { icon = 'book_5', message = '구매/대여하신 책이 없습니다.' } = {},
    } = this.props;

    // Data 가져오는 상태면서 캐싱된 items가 없으면 Skeleton 노출
    if (isFetching && items.length === 0) {
      return <SkeletonBookList viewType={ViewType.LANDSCAPE} />;
    }

    // Data 가져오는 상태가 아니면서 Items가 비어있으면 0
    if (!isFetching && items.length === 0) {
      return <EmptyBookList icon={icon} message={message} />;
    }

    return (
      <LibraryBooks
        libraryBookDTO={items}
        platformBookDTO={books}
        selectedBooks={selectedBooks}
        isSelectMode={isEditing}
        viewType={ViewType.LANDSCAPE}
        onSelectedChange={onSelectedChange}
      />
    );
  }

  renderModal() {
    const { showSortModal } = this.state;
    const {
      currentOrder,
      orderOptions,
      pageProps: { href, as },
    } = this.props;

    if (currentOrder === undefined || orderOptions === undefined) {
      return null;
    }

    return (
      <UnitSortModal
        order={currentOrder}
        orderOptions={orderOptions}
        isActive={showSortModal}
        onClickModalBackground={this.toggleSortModal}
        href={href}
        as={as}
      />
    );
  }

  renderPaginator() {
    const {
      pageProps: { currentPage, totalPages, href, as, query },
    } = this.props;
    return <ResponsivePaginator currentPage={currentPage} totalPages={totalPages} href={href} as={as} query={query} />;
  }

  render() {
    const { isEditing } = this.state;

    return (
      <Editable
        allowFixed
        isEditing={isEditing}
        nonEditBar={this.renderSeriesToolBar()}
        editingBarProps={this.makeEditingBarProps()}
        actionBarProps={this.wrapActionBarProps()}
      >
        <Responsive hasPadding={false}>
          {this.renderBooks()}
          {this.renderModal()}
        </Responsive>
        {this.renderPaginator()}
      </Editable>
    );
  }
}
