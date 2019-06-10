/** @jsx jsx */
import { jsx } from '@emotion/core';
import Head from 'next/head';
import React from 'react';
import { connect } from 'react-redux';
import BookDownLoader from '../../components/BookDownLoader';
import UnitDetailView from '../../components/UnitDetailView';
import * as featureIds from '../../constants/featureIds';
import { UnitType } from '../../constants/unitType';
import Responsive from './Responsive';
import { ButtonType } from '../../components/ActionBar/constants';
import SelectShelfModal from '../../components/SelectShelfModal';
import TitleBar from '../../components/TitleBar';
import { OrderOptions } from '../../constants/orderOptions';
import SeriesList from '../../components/SeriesList';
import { BookError } from '../../components/Error';

import * as featureSelectors from '../../services/feature/selectors';
import { getTotalSelectedCount } from '../../services/selection/selectors';
import * as shelfActions from '../../services/shelf/actions';

class UnitPageTemplate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isEditing: false,
      showShelves: false,
    };
  }

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

  handleAddToShelf = () => {
    this.setState({ showShelves: true });
  };

  handleShelfBackClick = () => {
    this.setState({ showShelves: false });
  };

  handleEditingChange = isEditing => this.setState({ isEditing });

  handleShelfSelect = uuid => {
    this.setState({ isEditing: false, showShelves: false });
    this.props.dispatchAddSelectedToShelf(uuid);
    this.props.dispatchClearSelectedBooks();
  };

  makeActionBarProps() {
    const { unit, isSelected, isSyncShelfEnabled } = this.props;
    const disable = !isSelected;

    let buttonProps;
    if (isSyncShelfEnabled) {
      if (UnitType.isCollection(unit.type)) {
        buttonProps = [
          {
            name: '숨기기',
            onClick: this.handleOnClickHide,
            disable,
          },
          {
            name: '책장에 추가',
            onClick: this.handleAddToShelf,
            disable,
          },
          {
            type: ButtonType.SPACER,
          },
          {
            name: '다운로드',
            onClick: this.handleOnClickDownload,
            disable,
          },
        ];
      } else {
        buttonProps = [
          {
            name: '숨기기',
            onClick: this.handleOnClickHide,
            disable,
          },
          {
            type: ButtonType.SPACER,
          },
          {
            name: '다운로드',
            onClick: this.handleOnClickDownload,
            disable,
          },
        ];
      }
    } else {
      buttonProps = [
        {
          name: '선택 숨기기',
          onClick: this.handleOnClickHide,
          disable,
        },
        {
          type: ButtonType.SPACER,
        },
        {
          name: '선택 다운로드',
          onClick: this.handleOnClickDownload,
          disable,
        },
      ];
    }

    return { buttonProps };
  }

  renderTitleBar() {
    const {
      unit,
      totalCount,
      pageInfo: { order },
      backPageProps,
    } = this.props;

    const usePurchasedTotalCount = [OrderOptions.UNIT_ORDER_DESC.key, OrderOptions.UNIT_ORDER_ASC.key].includes(order);

    const extraTitleBarProps = unit
      ? {
          title: unit.title,
          showCount:
            !UnitType.isBook(unit.type) && (usePurchasedTotalCount ? totalCount.purchasedTotalCount > 0 : totalCount.itemTotalCount > 0),
          totalCount: usePurchasedTotalCount ? totalCount.purchasedTotalCount : totalCount.itemTotalCount,
        }
      : {};

    return <TitleBar {...backPageProps} {...extraTitleBarProps} />;
  }

  renderDetailView() {
    const { unit, primaryBookId, primaryItem, items, books, bookDescription, bookStarRating } = this.props;

    return (
      <UnitDetailView
        unit={unit}
        primaryBookId={primaryBookId}
        primaryItem={primaryItem}
        items={items}
        books={books}
        bookDescription={bookDescription}
        bookStarRating={bookStarRating}
        downloadable
        readableLatest
      />
    );
  }

  renderSeriesList() {
    const {
      unit,
      primaryBookId,
      pageInfo: { order },
      pageProps,
      isFetchingBook,
      primaryItem,
      items,
      books,
      dispatchSelectAllBooks,
      dispatchClearSelectedBooks,
    } = this.props;
    const { isEditing } = this.state;
    if (!books[primaryBookId]) {
      return null;
    }

    const bookUnitOfCount = books[primaryBookId].series ? books[primaryBookId].series.property.unit : null;
    const orderOptions = UnitType.isSeries(unit.type)
      ? OrderOptions.toSeriesList(bookUnitOfCount)
      : OrderOptions.toShelfList(bookUnitOfCount);

    return (
      <SeriesList
        pageProps={pageProps}
        actionBarProps={this.makeActionBarProps()}
        currentOrder={order}
        orderOptions={orderOptions}
        isFetching={isFetchingBook}
        isEditing={isEditing}
        onEditingChange={this.handleEditingChange}
        primaryItem={primaryItem}
        items={items}
        books={books}
        unit={unit}
        linkWebviewer
        onClickSelectAllBooks={dispatchSelectAllBooks}
        onClickUnselectAllBooks={dispatchClearSelectedBooks}
      />
    );
  }

  renderMain() {
    const { unit } = this.props;
    return (
      <>
        <Responsive>{this.renderDetailView()}</Responsive>
        {unit && UnitType.isBook(unit.type) ? null : this.renderSeriesList()}
      </>
    );
  }

  render() {
    const { unit, isError, dispatchLoadItems } = this.props;
    const { showShelves } = this.state;

    if (showShelves) {
      return (
        <>
          <Head>
            <title>{unit.title ? `${unit.title} - ` : ''}내 서재</title>
          </Head>
          <SelectShelfModal onBackClick={this.handleShelfBackClick} onShelfSelect={this.handleShelfSelect} />
        </>
      );
    }

    return (
      <>
        <Head>
          <title>{unit.title ? `${unit.title} - ` : ''}내 서재</title>
        </Head>
        {this.renderTitleBar()}
        <main>{isError ? <BookError onClickRefreshButton={() => dispatchLoadItems()} /> : this.renderMain()}</main>
        <BookDownLoader />
      </>
    );
  }
}

const mapStateToProps = state => ({
  isSelected: getTotalSelectedCount(state) !== 0,
  isSyncShelfEnabled: featureSelectors.getIsFeatureEnabled(state, featureIds.SYNC_SHELF),
});

const mapDispatchToProps = {
  dispatchAddSelectedToShelf: shelfActions.addSelectedToShelf,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UnitPageTemplate);
