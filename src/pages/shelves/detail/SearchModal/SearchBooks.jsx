import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { Books } from '../../../../components/Books';
import ViewType from '../../../../constants/viewType';
import * as bookActions from '../../../../services/book/actions';
import * as bookSelectors from '../../../../services/book/selectors';

function emptyLinkBuilder() {
  return null;
}

function SearchBooks({ items, loadBookData, loadUnitData, platformBooks, units }) {
  React.useEffect(() => {
    loadBookData(items.map(item => item.b_id));
    loadUnitData(items.map(item => item.unit_id));
  }, [items]);
  return (
    <Books
      libraryBookDTO={items}
      platformBookDTO={platformBooks}
      units={units}
      isSelectMode
      viewType={ViewType.LANDSCAPE}
      linkBuilder={emptyLinkBuilder}
    />
  );
}

function mapStateToPropsFactory() {
  const selectBookIds = createSelector(
    props => props.items,
    items => items.map(item => item.b_id),
  );
  const selectUnitIds = createSelector(
    props => props.items,
    items => items.map(item => item.unit_id),
  );
  return (state, props) => {
    const bookIds = selectBookIds(props);
    const unitIds = selectUnitIds(props);
    return {
      platformBooks: bookSelectors.getBooks(state, bookIds),
      units: bookSelectors.getUnits(state, unitIds),
    };
  };
}

const mapDispatchToProps = {
  loadBookData: bookActions.loadBookData,
  loadUnitData: bookActions.loadUnitData,
};

export default connect(
  mapStateToPropsFactory,
  mapDispatchToProps,
)(SearchBooks);
