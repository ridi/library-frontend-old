/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import React from 'react';
import { connect } from 'react-redux';

import Responsive from '../../pages/base/Responsive';
import * as shelfActions from '../../services/shelf/actions';
import * as shelfSelectors from '../../services/shelf/selectors';
import Editable from '../Editable';
import { EmptyShelves } from '../Empty/EmptyShelves';
import FlexBar from '../FlexBar';
import { Shelves } from '../Shelves';
import { SkeletonShelves } from '../Skeleton/SkeletonShelves';
import NavigationBar from './NavigationBar';

const toolBar = css`
  border-bottom: 1px solid #d1d5d9;
  box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.04);
  background-color: #f3f4f5;
`;

function SelectShelfModalInner(props) {
  const { loadShelves, orderBy, orderDirection, page } = props;
  React.useEffect(
    () => {
      loadShelves({ orderBy, orderDirection, page });
    },
    [orderBy, orderDirection, page],
  );

  function renderToolBar() {
    const { onBackClick } = props;
    return (
      <>
        <NavigationBar onBackClick={onBackClick} />
        <FlexBar css={toolBar} />
      </>
    );
  }

  function renderMain() {
    const {
      shelves: { loading: isLoading, items: shelfIds },
    } = props;
    if (shelfIds == null || (shelfIds.length === 0 && isLoading)) return <SkeletonShelves />;
    return shelfIds.length > 0 ? <Shelves shelfIds={shelfIds} /> : <EmptyShelves />;
  }

  return (
    <>
      <Editable allowFixed doubleEditBar isEditing={false} nonEditBar={renderToolBar()} editingBarProps={{}} actionBarProps={{}}>
        <main>
          <Responsive>{renderMain()}</Responsive>
        </main>
      </Editable>
    </>
  );
}

function mapStateToProps(state, props) {
  const { orderBy, orderDirection, page } = props;
  const pageOptions = { orderBy, orderDirection, page };
  const shelves = shelfSelectors.getShelves(state, pageOptions);
  return { shelves };
}

const mapDispatchToProps = {
  loadShelves: shelfActions.loadShelves,
};

const SelectShelfModal = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SelectShelfModalInner);

export default function SelectShelfModalContainer({ onBackClick }) {
  const [orderBy, setOrderBy] = React.useState('');
  const [orderDirection, setOrderDirection] = React.useState('');
  const [page, setPage] = React.useState(1);

  const handlePageOptionsChange = React.useCallback(options => {
    options.orderBy && setOrderBy(options.orderBy);
    options.orderDirection && setOrderDirection(options.orderDirection);
    options.page && setPage(options.page);
  }, []);

  const innerProps = {
    onBackClick,
    onPageOptionsChange: handlePageOptionsChange,
    orderBy,
    orderDirection,
    page,
  };

  return <SelectShelfModal {...innerProps} />;
}
