/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import connect from 'react-redux/es/connect/connect';
import { OrderOptions } from '../constants/orderOptions';
import { UnitType } from '../constants/unitType';
import ViewType from '../constants/viewType';
import { ResponsiveBooks } from '../pages/base/Responsive';
import { getLocationHref } from '../services/router/selectors';
import BookOutline from '../svgs/BookOutline.svg';
import { makeRidiStoreUri, makeWebViewerURI } from '../utils/uri';
import { Books } from './Books';
import Editable from './Editable';
import EmptyBookList from './EmptyBookList';
import HorizontalRuler from './HorizontalRuler';
import ResponsivePaginator from './ResponsivePaginator';
import SeriesToolBar from './SeriesToolBar';
import SkeletonBooks from './Skeleton/SkeletonBooks';

const seriesViewStyle = {
  paddingBottom: 51, // 하단 툴바의 사이즈 만큼 준다.
};

class SeriesView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
    };
    this.seriesViewRef = React.createRef();
  }

  componentDidUpdate(prevProps) {
    this.scrollToHeadWhenChangeOrder(prevProps);
  }

  scrollToHeadWhenChangeOrder(prevProps) {
    const { currentOrder: order } = this.props;
    const { currentOrder: prevOrder } = prevProps;

    if (order !== prevOrder) {
      setTimeout(() => {
        window.scrollTo(0, this.seriesViewRef.current.offsetTop - 10);
      }, 300);
    }
  }

  toggleEditingMode = () => {
    const { isEditing } = this.state;
    this.setState({ isEditing: !isEditing });
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
      onClickSuccessButton: () => {
        onClickUnselectAllBooks();
        this.setState({ isEditing: false });
      },
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
    const {
      currentOrder,
      orderOptions,
      pageProps: { href, as },
    } = this.props;

    return (
      <SeriesToolBar
        toggleEditingMode={this.toggleEditingMode}
        currentOrder={currentOrder}
        orderOptions={orderOptions}
        href={href}
        as={as}
      />
    );
  }

  getEmptyBookListMessage(defaultMessage) {
    const { currentOrder } = this.props;

    if (!currentOrder) {
      return defaultMessage;
    }

    if (OrderOptions.EXPIRE_DATE.key === currentOrder) {
      return '대여 중인 도서가 없습니다.';
    }
    if (OrderOptions.EXPIRED_BOOKS_ONLY.key === currentOrder) {
      return '만료된 도서가 없습니다.';
    }
    return defaultMessage;
  }

  renderBooks() {
    const { isEditing } = this.state;
    const {
      items,
      books,
      selectedBooks,
      onSelectedChange,
      isFetching,
      unit,
      linkWebviewer,
      emptyProps: { message = '구매/대여하신 책이 없습니다.' } = {},
      locationHref,
    } = this.props;

    // Data 가져오는 상태면서 캐싱된 items가 없으면 Skeleton 노출
    if (isFetching && items.length === 0) {
      return <SkeletonBooks viewType={ViewType.LANDSCAPE} />;
    }

    // Data 가져오는 상태가 아니면서 Items가 비어있으면 0
    if (!isFetching && items.length === 0) {
      return <EmptyBookList IconComponent={BookOutline} message={this.getEmptyBookListMessage(message)} />;
    }

    const linkBuilder = _linkWebviewer => (libraryBookData, platformBookData) => {
      if (_linkWebviewer && platformBookData.support.web_viewer) {
        return (
          <a href={makeWebViewerURI(platformBookData.id, locationHref)} target="_blank" rel="noopener noreferrer">
            웹뷰어로 보기
          </a>
        );
      }

      if (UnitType.isShelf(unit.type)) {
        return (
          <a href={makeRidiStoreUri(platformBookData.id)} target="_blank" rel="noopener noreferrer">
            리디북스에서 보기
          </a>
        );
      }

      return null;
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

  renderPaginator() {
    const {
      pageProps: { currentPage, totalPages, href, as, query },
    } = this.props;
    return <ResponsivePaginator currentPage={currentPage} totalPages={totalPages} href={href} as={as} query={query} />;
  }

  render() {
    const { isEditing } = this.state;

    return (
      <div css={seriesViewStyle} ref={this.seriesViewRef}>
        <HorizontalRuler color="#d1d5d9" />
        <Editable
          allowFixed
          isEditing={isEditing}
          nonEditBar={this.renderSeriesToolBar()}
          editingBarProps={this.makeEditingBarProps()}
          actionBarProps={this.wrapActionBarProps()}
        >
          <ResponsiveBooks>{this.renderBooks()}</ResponsiveBooks>
          {this.renderPaginator()}
        </Editable>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  locationHref: getLocationHref(state),
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SeriesView);
