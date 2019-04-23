/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { connect } from 'react-redux';
import { OrderOptions } from '../constants/orderOptions';
import { UnitType } from '../constants/unitType';
import ViewType from '../constants/viewType';
import { ResponsiveBooks } from '../pages/base/Responsive';
import { getLocationHref } from '../services/router/selectors';
import BookOutline from '../svgs/BookOutline.svg';
import { makeRidiSelectUri, makeRidiStoreUri, makeWebViewerURI } from '../utils/uri';
import { Books } from './Books';
import Editable from './Editable';
import EmptyBookList from './EmptyBookList';
import HorizontalRuler from './HorizontalRuler';
import ResponsivePaginator from './ResponsivePaginator';
import SeriesToolBar from './SeriesToolBar';
import SkeletonBooks from './Skeleton/SkeletonBooks';

const seriesListStyle = {
  paddingBottom: 51, // 하단 툴바의 사이즈 만큼 준다.
};

class SeriesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
    };
    this.seriesListRef = React.createRef();
  }

  componentDidUpdate(prevProps) {
    this.scrollToHeadWhenChangeOrder(prevProps);
  }

  scrollToHeadWhenChangeOrder(prevProps) {
    const { currentOrder: order } = this.props;
    const { currentOrder: prevOrder } = prevProps;

    if (order !== prevOrder) {
      setTimeout(() => {
        if (!this.seriesListRef.current) {
          return;
        }

        window.scrollTo(0, this.seriesListRef.current.offsetTop - 10);
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
      primaryItem,
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
      // 웹뷰어 지원도서면 웹뷰어로 이동
      if (_linkWebviewer && platformBookData.support.web_viewer) {
        return <a href={makeWebViewerURI(platformBookData.id, locationHref)}>웹뷰어로 보기</a>;
      }

      // 구매한 책이면 책의 서비스에 따라 이동
      if (libraryBookData.purchased) {
        if (libraryBookData.is_ridiselect) {
          return <a href={makeRidiSelectUri(platformBookData.id)}>리디셀렉트에서 보기</a>;
        }
        return <a href={makeRidiStoreUri(platformBookData.id)}>서점에서 보기</a>;
      }

      // 구매하지 않은 책인데 primaryItem 이 있다면 primaryItem 서비스를 따라간다.
      if (primaryItem && primaryItem.is_ridiselect) {
        return <a href={makeRidiSelectUri(platformBookData.id)}>리디셀렉트에서 보기</a>;
      }
      return <a href={makeRidiStoreUri(platformBookData.id)}>서점에서 보기</a>;
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
        isSeriesView={UnitType.isSeries(unit.type)}
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
      <div css={seriesListStyle} ref={this.seriesListRef}>
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
)(SeriesList);
``;
