import React from 'react';
import ViewType from '../constants/viewType';
import Responsive from '../pages/base/Responsive';
import { Books } from './Books';
import Editable from './Editable';
import EmptyBookList from './EmptyBookList';
import HorizontalRuler from './HorizontalRuler';
import UnitSortModal from './Modal/UnitSortModal';
import ResponsivePaginator from './ResponsivePaginator';
import SeriesToolBar from './SeriesToolBar';
import SkeletonBooks from './Skeleton/SkeletonBooks';

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
      linkWebviewer,
      emptyProps: { icon = 'book_5', message = '구매/대여하신 책이 없습니다.' } = {},
    } = this.props;

    // Data 가져오는 상태면서 캐싱된 items가 없으면 Skeleton 노출
    if (isFetching && items.length === 0) {
      return <SkeletonBooks viewType={ViewType.LANDSCAPE} />;
    }

    // Data 가져오는 상태가 아니면서 Items가 비어있으면 0
    if (!isFetching && items.length === 0) {
      return <EmptyBookList icon={icon} message={message} />;
    }

    const linkBuilder = _linkWebviewer => (libraryBookData, platformBookData) => {
      if (!_linkWebviewer || !platformBookData.support.web_viewer) {
        return null;
      }

      // 개발용 웹뷰어가 없기 때문에 도메인을 고정한다.
      return (
        <a href={`https://view.ridibooks.com/books/${platformBookData.id}`} target="_blank" rel="noopener noreferrer">
          웹뷰어로 보기
        </a>
      );
    };

    return (
      <Books
        libraryBookDTO={items}
        platformBookDTO={books}
        selectedBooks={selectedBooks}
        isSelectMode={isEditing}
        viewType={ViewType.LANDSCAPE}
        onSelectedChange={onSelectedChange}
        linkBuilder={linkBuilder(linkWebviewer)}
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
      <>
        <HorizontalRuler color="#d1d5d9" />
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
      </>
    );
  }
}
