/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { connect } from 'react-redux';
import { OrderOptions } from '../constants/orderOptions';
import { UnitType } from '../constants/unitType';
import ViewType from '../constants/viewType';
import { ResponsiveBooks } from '../pages/base/Responsive';
import { getLocationHref } from '../services/router/selectors';
import { getTotalSelectedCount } from '../services/selection/selectors';
import BookOutline from '../svgs/BookOutline.svg';
import { makeRidiSelectUri, makeRidiStoreUri, makeWebViewerURI } from '../utils/uri';
import { Books } from './Books';
import Editable from './Editable';
import Empty from './Empty';
import HorizontalRuler from './HorizontalRuler';
import ResponsivePaginator from './ResponsivePaginator';
import SeriesToolBar from './SeriesToolBar';
import SkeletonBooks from './Skeleton/SkeletonBooks';
import { ACTION_BAR_HEIGHT } from './ActionBar/styles';

const seriesListStyle = {
  paddingBottom: ACTION_BAR_HEIGHT,
};

class SeriesList extends React.Component {
  constructor(props) {
    super(props);
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
    const { isEditing, onEditingChange } = this.props;
    onEditingChange && onEditingChange(!isEditing);
  };

  makeEditingBarProps() {
    const { items, totalSelectedCount, onClickSelectAllBooks, onClickUnselectAllBooks, onEditingChange } = this.props;
    const isSelectedAllBooks = totalSelectedCount === items.filter(item => item.purchased).length;

    return {
      totalSelectedCount,
      isSelectedAllItem: isSelectedAllBooks,
      onClickSelectAllItem: onClickSelectAllBooks,
      onClickUnselectAllItem: onClickUnselectAllBooks,
      onClickSuccessButton: () => {
        onClickUnselectAllBooks();
        onEditingChange(false);
      },
    };
  }

  renderSeriesToolBar() {
    const { currentOrder, orderOptions } = this.props;

    return <SeriesToolBar toggleEditingMode={this.toggleEditingMode} currentOrder={currentOrder} orderOptions={orderOptions} />;
  }

  getEmptyMessage(defaultMessage) {
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
    const {
      primaryItem,
      items,
      isEditing,
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
      return <Empty IconComponent={BookOutline} message={this.getEmptyMessage(message)} />;
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
        isSelectMode={isEditing}
        viewType={ViewType.LANDSCAPE}
        linkBuilder={linkBuilder(linkWebviewer)}
        isSeriesView={UnitType.isSeries(unit.type)}
      />
    );
  }

  renderPaginator() {
    const { currentPage, totalPages } = this.props;
    return <ResponsivePaginator currentPage={currentPage} totalPages={totalPages} />;
  }

  render() {
    const { actionBarProps, isEditing } = this.props;

    return (
      <div css={seriesListStyle} ref={this.seriesListRef}>
        <HorizontalRuler color="#d1d5d9" />
        <Editable
          allowFixed
          isEditing={isEditing}
          nonEditBar={this.renderSeriesToolBar()}
          editingBarProps={this.makeEditingBarProps()}
          actionBarProps={actionBarProps}
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
  totalSelectedCount: getTotalSelectedCount(state),
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SeriesList);
