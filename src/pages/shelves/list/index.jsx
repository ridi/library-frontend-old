/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import Head from 'next/head';
import React from 'react';
import { connect } from 'react-redux';
import Editable from '../../../components/Editable';
import { EmptyShelves } from '../../../components/Empty/EmptyShelves';
import FlexBar from '../../../components/FlexBar';
import { Shelves } from '../../../components/Shelves';
import { SkeletonShelves } from '../../../components/Skeleton/SkeletonShelves';
import { Editing } from '../../../components/Tool';
import * as confirmActions from '../../../services/confirm/actions';
import * as selectionActions from '../../../services/selection/actions';
import * as selectionSelectors from '../../../services/selection/selectors';
import * as actions from '../../../services/shelf/actions';
import * as selectors from '../../../services/shelf/selectors';
import Footer from '../../base/Footer';
import { TabBar, TabMenuTypes } from '../../base/LNB';
import Responsive from '../../base/Responsive';
import { Add } from '../../../components/Tool/Add';
import * as promptActions from '../../../services/prompt/actions';

const toolBar = css`
  border-bottom: 1px solid #d1d5d9;
  box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.04);
  background-color: #f3f4f5;
`;

const toolsWrapper = css`
  display: flex;
`;

const ShelvesList = props => {
  const { shelves, totalSelectedCount, selectShelf, clearSelectedShelves, selectedShelves, showConfirm, showPrompt } = props;
  const [selectMode, setSelectMode] = React.useState(false);
  const toggleSelectMode = React.useCallback(() => {
    clearSelectedShelves();
    setSelectMode(isSelectMode => !isSelectMode);
  }, []);

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

  const handleAddShelfButton = () => {
    showPrompt({
      title: '새 책장 추가',
      message: '새 책장의 이름을 입력해주세요.',
      emptyInputAlertMessage: '책장의 이름을 입력해주세요.',
      onClickConfirmButton: shelfName => {
        console.log(shelfName);
      },
    });
  };

  const showRemoveConfirm = () => {
    showConfirm('책장을 삭제하겠습니까?', '삭제한 책장의 책은 ‘모든 책’에서 볼 수 있습니다.', '삭제', () => {
      console.log(selectedShelves);
    });
  };

  const actionBarProps = {
    buttonProps: [
      {
        name: '삭제',
        onClick: showRemoveConfirm,
        disable: totalSelectedCount === 0,
      },
    ],
  };

  const renderTools = () => (
    <div css={toolsWrapper}>
      <Add onClickAddButton={handleAddShelfButton} />
      <Editing toggleEditingMode={toggleSelectMode} />
    </div>
  );

  const renderToolBar = () => <FlexBar css={toolBar} flexLeft={<div />} flexRight={renderTools()} />;

  const renderMain = () => {
    const { loading: isLoading, items: shelfIds } = shelves;
    if (shelfIds == null || (shelfIds.length === 0 && isLoading)) return <SkeletonShelves />;
    return shelfIds.length > 0 ? <Shelves shelfIds={shelfIds} selectMode={selectMode} editable /> : <EmptyShelves />;
  };

  return (
    <>
      <Head>
        <title>책장 - 내 서재</title>
      </Head>
      <TabBar activeMenu={TabMenuTypes.SHELVES} />
      <Editable
        allowFixed
        isEditing={selectMode}
        nonEditBar={renderToolBar()}
        editingBarProps={editingBarProps}
        actionBarProps={actionBarProps}
      >
        <main>
          <Responsive>{renderMain()}</Responsive>
        </main>
      </Editable>
      <Footer />
    </>
  );
};

ShelvesList.getInitialProps = async ({ query, store }) => {
  const page = parseInt(query.page, 10) || 1;
  const orderBy = '';
  const orderDirection = '';
  store.dispatch(actions.loadShelves({ orderBy, orderDirection, page }));
  return {
    page,
    orderBy,
    orderDirection,
  };
};

const mapStateToProps = (state, props) => {
  const { orderBy, orderDirection, page } = props;
  const pageOptions = { orderBy, orderDirection, page };
  const shelves = selectors.getShelves(state, pageOptions);
  const totalSelectedCount = selectionSelectors.getTotalSelectedCount(state);
  const selectedShelves = selectionSelectors.getSelectedItems(state);
  return { shelves, totalSelectedCount, selectedShelves };
};

const mapDispatchToProps = {
  clearSelectedShelves: selectionActions.clearSelectedItems,
  selectShelf: selectionActions.selectItems,
  showConfirm: confirmActions.showConfirm,
  showPrompt: promptActions.showPrompt,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ShelvesList);
