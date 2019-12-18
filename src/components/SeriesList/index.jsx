import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Books } from 'components/Books';
import Editable from 'components/Editable';
import Empty from 'components/Empty';
import HorizontalRuler from 'components/HorizontalRuler';
import ResponsivePaginator from 'components/ResponsivePaginator';
import SeriesToolBar from 'components/SeriesToolBar';
import SkeletonBooks from 'components/Skeleton/SkeletonBooks';
import { OrderOptions } from 'constants/orderOptions';
import { ServiceType } from 'constants/serviceType';
import { UnitType } from 'constants/unitType';
import ViewType from 'constants/viewType';
import { ResponsiveBooks } from 'pages/base/Responsive';
import { getOpenInfo } from 'services/book/selectors';
import { getTotalSelectedCount } from 'services/selection/selectors';
import BookOutline from 'svgs/BookOutline.svg';
import { makeLocationHref, makeRidiSelectUri, makeRidiStoreUri, makeWebViewerUri } from 'utils/uri';

import * as styles from './styles';

class SeriesList extends React.Component {
  constructor(props) {
    super(props);
    this.seriesListRef = React.createRef();
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

  toggleEditingMode = () => {
    const { isEditing, onEditingChange } = this.props;
    onEditingChange && onEditingChange(!isEditing);
  };

  calculateScroll = () => {
    const seriesList = this.seriesListRef.current;
    return seriesList ? { x: 0, y: seriesList.offsetTop - 10 } : null;
  };

  makeEditingBarProps() {
    const { items, totalSelectedCount, onClickSelectAllBooks, onClickDeselectAllBooks, onEditingChange } = this.props;
    const isSelectedAllBooks = totalSelectedCount === (items || []).filter(item => item.purchased).length;

    return {
      totalSelectedCount,
      isSelectedAllItem: isSelectedAllBooks,
      onClickSelectAllItem: onClickSelectAllBooks,
      onClickDeselectAllItem: onClickDeselectAllBooks,
      onClickSuccessButton: () => {
        onClickDeselectAllBooks();
        onEditingChange(false);
      },
    };
  }

  renderSeriesToolBar() {
    const { currentOrder, orderOptions } = this.props;

    return (
      <SeriesToolBar
        toggleEditingMode={this.toggleEditingMode}
        currentOrder={currentOrder}
        orderOptions={orderOptions}
        scroll={this.calculateScroll}
      />
    );
  }

  renderBooks() {
    const {
      primaryItem,
      items,
      isEditing,
      isFetching,
      unit,
      linkWebviewer,
      location,
      openInfo,
      emptyProps: { message = '구매/대여하신 책이 없습니다.' } = {},
    } = this.props;
    const locationHref = makeLocationHref(location);

    // Data 가져오는 중이거나 items가 한번도 설정된 적이 없으면 Skeleton 노출
    if (isFetching || items == null) {
      return <SkeletonBooks viewType={ViewType.LANDSCAPE} />;
    }

    // Items가 비어있으면
    if (items.length === 0) {
      return <Empty IconComponent={BookOutline} message={this.getEmptyMessage(message)} />;
    }

    const linkBuilder = (_linkWebviewer, _openInfo) => (libraryBookData, platformBookData) => {
      const {
        id: bookId,
        support: { web_viewer: isWebViewerContents },
      } = platformBookData;
      const { isSelectOpen } = _openInfo[bookId];

      // 웹뷰어 지원도서면 웹뷰어로 이동
      if (_linkWebviewer && isWebViewerContents) {
        return (
          <a href={makeWebViewerUri(bookId, locationHref)} rel="noopener noreferrer">
            웹뷰어로 보기
          </a>
        );
      }

      let openService = ServiceType.STORE;
      if (libraryBookData.purchased && libraryBookData.is_ridiselect && isSelectOpen) {
        // 구매한 책이면 책의 서비스 및 각 서비스별 오픈 여부에 따라 이동
        openService = ServiceType.SELECT;
      } else if (primaryItem && primaryItem.is_ridiselect && isSelectOpen) {
        // 구매하지 않은 책인데 primaryItem 이 있다면 primaryItem의 서비스 및 서비스별 오픈 여부에 따라 이동
        openService = ServiceType.SELECT;
      }

      const href = openService === ServiceType.STORE ? makeRidiStoreUri(bookId) : makeRidiSelectUri(bookId);
      const title = openService === ServiceType.STORE ? '서점에서 보기' : '리디셀렉트에서 보기';

      return (
        <a href={href} rel="noopener noreferrer">
          {title}
        </a>
      );
    };

    return (
      <Books
        libraryBookDTO={items}
        isSelectMode={isEditing}
        viewType={ViewType.LANDSCAPE}
        linkBuilder={linkBuilder(linkWebviewer, openInfo)}
        isSeriesView={UnitType.isSeries(unit.type)}
      />
    );
  }

  renderPaginator() {
    const { currentPage, totalPages } = this.props;
    return <ResponsivePaginator currentPage={currentPage} totalPages={totalPages} scroll={this.calculateScroll} />;
  }

  render() {
    const { actionBarProps, isEditing } = this.props;

    return (
      <div css={styles.wrapper} ref={this.seriesListRef}>
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

const mapStateToProps = (state, props) => {
  const bookIds = props.items && props.items.map(item => item.b_id);

  return {
    totalSelectedCount: getTotalSelectedCount(state),
    openInfo: props.items && getOpenInfo(state, bookIds),
  };
};

export default withRouter(connect(mapStateToProps)(SeriesList));
