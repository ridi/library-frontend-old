/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { ButtonType } from '../../../components/ActionBar/constants';
import Editable from '../../../components/Editable';
import { EmptyShelves } from '../../../components/Empty/EmptyShelves';
import FlexBar from '../../../components/FlexBar';
import PageRedirect from '../../../components/PageRedirect';
import ResponsivePaginator from '../../../components/ResponsivePaginator';
import { Shelves } from '../../../components/Shelves';
import { SkeletonShelves } from '../../../components/Skeleton/SkeletonShelves';
import { Editing, ShelfOrder } from '../../../components/Tool';
import { Add } from '../../../components/Tool/Add';
import { Tooltip } from '../../../components/Tooltip';
import { OrderOptions } from '../../../constants/orderOptions';
import { SHELVES_LIMIT_PER_PAGE } from '../../../constants/page';
import { SHELF_NAME_LIMIT, SHELVES_LIMIT } from '../../../constants/shelves';
import { URLMap } from '../../../constants/urls';
import * as confirmActions from '../../../services/confirm/actions';
import * as promptActions from '../../../services/prompt/actions';
import * as selectionActions from '../../../services/selection/actions';
import * as selectionSelectors from '../../../services/selection/selectors';
import * as shelfActions from '../../../services/shelf/actions';
import * as shelfSelectors from '../../../services/shelf/selectors';
import * as toastActions from '../../../services/toast/actions';
import { ToastStyle } from '../../../services/toast/constants';
import * as paginationUtils from '../../../utils/pagination';
import { makeLinkProps } from '../../../utils/uri';
import Footer from '../../base/Footer';
import { TabBar, TabMenuTypes } from '../../base/LNB';
import Responsive from '../../base/Responsive';
import { BetaAlert } from './BetaAlert';
import * as styles from './styles';

const ShelvesList = props => {
  const {
    addShelf,
    removeShelves,
    shelves,
    totalShelfCount,
    totalSelectedCount,
    selectShelf,
    clearSelectedShelves,
    selectedShelves,
    showConfirm,
    showPrompt,
    showToast,
    pageOptions,
    loadShelfCount,
    loadShelves,
    validateShelvesLimit,
  } = props;
  const [selectMode, setSelectMode] = React.useState(false);
  const toggleSelectMode = React.useCallback(() => {
    clearSelectedShelves();
    setSelectMode(isSelectMode => !isSelectMode);
  }, []);
  const totalPages = totalShelfCount == null ? null : paginationUtils.calcPage(totalShelfCount, SHELVES_LIMIT_PER_PAGE);

  const visibleShelvesCount = shelves?.items?.length;
  const selectAllShelf = React.useCallback(() => selectShelf(shelves.items), [shelves.items]);
  const editingBarProps = {
    totalSelectedCount,
    isSelectedAllItem: totalSelectedCount === visibleShelvesCount,
    onClickSelectAllItem: selectAllShelf,
    onClickUnselectAllItem: clearSelectedShelves,
    onClickSuccessButton: toggleSelectMode,
    countUnit: '개',
  };

  const validateAddShelf = onValid => {
    validateShelvesLimit({
      onValid,
      onInvalid: () => {
        loadShelves(pageOptions);
        showToast({
          message: `최대 ${SHELVES_LIMIT}개까지 추가할 수 있습니다.`,
          toastStyle: ToastStyle.RED,
        });
      },
    });
  };

  const handleAddshelfConfirm = name => {
    validateAddShelf(() => {
      addShelf({ name, pageOptions });
    });
  };

  const handleAddShelf = () => {
    validateAddShelf(() => {
      showPrompt({
        title: '새 책장 추가',
        message: '새 책장의 이름을 입력해주세요.',
        placeHolder: '책장 이름',
        emptyInputAlertMessage: '책장의 이름을 입력해주세요.',
        onClickConfirmButton: handleAddshelfConfirm,
        limit: SHELF_NAME_LIMIT,
      });
    });
  };

  const handleRemoveShelves = () => {
    showConfirm({
      title: '책장 삭제',
      message: '모든 기기에서 선택한 책장이 삭제됩니다. 삭제한 책장의 책은 ‘모든 책’에서 볼 수 있습니다.',
      confirmLabel: '삭제',
      onClickConfirmButton: () => {
        removeShelves({ uuids: Object.keys(selectedShelves), pageOptions });
        setSelectMode(false);
      },
    });
  };

  const actionBarProps = {
    buttonProps: [
      {
        type: ButtonType.SPACER,
      },
      {
        name: '삭제',
        type: ButtonType.DANGER,
        onClick: handleRemoveShelves,
        disable: totalSelectedCount === 0,
      },
    ],
  };

  const handleOrderOptionClick = option => {
    const { href, as } = URLMap.shelves;
    const { orderType, orderBy } = option;
    const newPageOptions = {
      page: 1,
      orderBy: orderType,
      orderDirection: orderBy,
    };
    const { to } = makeLinkProps(href, as, newPageOptions);
    props.history.push(to);
  };

  const handleSyncClick = () => {
    loadShelves(pageOptions);
    loadShelfCount();
  };

  const renderTools = () => {
    const orderOptions = OrderOptions.toShelves();
    const { orderBy, orderDirection } = pageOptions;
    const order = OrderOptions.toKey(orderBy, orderDirection);
    return (
      <div css={styles.toolsWrapper}>
        <Add onClickAddButton={handleAddShelf}>
          <Tooltip name="SHELVES_TOOLTIP" expires={new Date(2019, 8, 20)}>
            책장을 만들어 원하는 책을 담아보세요!
          </Tooltip>
        </Add>
        <Editing toggleEditingMode={toggleSelectMode} />
        <ShelfOrder
          order={order}
          orderOptions={orderOptions}
          onOrderOptionClick={handleOrderOptionClick}
          onSyncClick={handleSyncClick}
          syncing={shelves.loading}
        />
      </div>
    );
  };

  const renderToolBar = () => <FlexBar css={styles.toolBar} flexLeft={<div />} flexRight={renderTools()} />;
  const renderPaginator = () => <ResponsivePaginator currentPage={pageOptions.page} totalPages={totalPages} />;
  const renderMain = () => {
    const { loading: isLoading, items: shelfIds } = shelves;
    if (shelfIds == null || (shelfIds.length === 0 && isLoading)) return <SkeletonShelves />;
    return shelfIds.length > 0 ? (
      <>
        <Shelves shelfIds={shelfIds} selectMode={selectMode} />
        {renderPaginator()}
      </>
    ) : (
      <EmptyShelves />
    );
  };

  return (
    <>
      <Helmet>
        <title>책장 - 내 서재</title>
      </Helmet>
      <PageRedirect currentPage={pageOptions.page} totalPages={totalPages} />
      <TabBar activeMenu={TabMenuTypes.SHELVES} />
      <Editable
        allowFixed
        isEditing={selectMode}
        nonEditBar={renderToolBar()}
        editingBarProps={editingBarProps}
        actionBarProps={actionBarProps}
      >
        <main>
          <Responsive>
            <BetaAlert />
            {renderMain()}
          </Responsive>
        </main>
        <Footer />
      </Editable>
    </>
  );
};

const extractPageOptions = locationSearch => {
  const urlParams = new URLSearchParams(locationSearch);
  const page = parseInt(urlParams.get('page'), 10) || 1;
  const orderBy = urlParams.get('order_by') || OrderOptions.SHELF_CREATED.orderType;
  const orderDirection = urlParams.get('order_direction') || OrderOptions.SHELF_CREATED.orderBy;
  return {
    page,
    orderBy,
    orderDirection,
  };
};

ShelvesList.prepare = async ({ dispatch, location }) => {
  const pageOptions = extractPageOptions(location.search);
  await dispatch(shelfActions.loadShelves(pageOptions));
  await dispatch(shelfActions.loadShelfCount());
};

const mapStateToProps = (state, props) => {
  const pageOptions = extractPageOptions(props.location.search);
  const shelves = shelfSelectors.getShelves(state, pageOptions);
  const totalShelfCount = shelfSelectors.getShelfCount(state);
  const totalSelectedCount = selectionSelectors.getTotalSelectedCount(state);
  const selectedShelves = selectionSelectors.getSelectedItems(state);
  return { shelves, totalShelfCount, totalSelectedCount, selectedShelves, pageOptions };
};

const mapDispatchToProps = {
  clearSelectedShelves: selectionActions.clearSelectedItems,
  selectShelf: selectionActions.selectItems,
  showConfirm: confirmActions.showConfirm,
  showPrompt: promptActions.showPrompt,
  showToast: toastActions.showToast,
  addShelf: shelfActions.addShelf,
  loadShelfCount: shelfActions.loadShelfCount,
  removeShelves: shelfActions.deleteShelves,
  loadShelves: shelfActions.loadShelves,
  validateShelvesLimit: shelfActions.validateShelvesLimit,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ShelvesList);
