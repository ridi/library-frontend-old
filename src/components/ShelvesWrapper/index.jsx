/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { connect } from 'react-redux';
import { SkeletonShelves } from '../Skeleton/SkeletonShelves';
import { EmptyShelves } from '../Empty/EmptyShelves';
import { Shelf } from '../Shelf';

class ShelvesWrapper extends React.Component {
  render() {
    const { shelves } = this.props;
    if (shelves == null) return <SkeletonShelves />;
    return shelves.length > 0 ? shelves.map(shelf => <Shelf key={shelf.id} {...shelf} />) : <EmptyShelves />;
  }
}

const mapStateToProps = state => {
  console.log(state);
  // return null;
  return {
    shelves: [
      {
        id: '000000',
        name: 'NNyamm 기본 책장1',
        totalCount: 1782,
        thumbnails: [
          '//misc.ridibooks.com/cover/1811142372/xxlarge',
          '//misc.ridibooks.com/cover/425108841/xxlarge',
          // '//misc.ridibooks.com/cover/2057072518/xxlarge',
        ],
        selectMode: false,
      },
      {
        id: '111111',
        name: 'NNyamm 기본 책장',
        totalCount: 12,
        thumbnails: [
          '//misc.ridibooks.com/cover/1811142372/xxlarge',
          '//misc.ridibooks.com/cover/425108841/xxlarge',
          '//misc.ridibooks.com/cover/2057072518/xxlarge',
        ],
        selectMode: false,
      },
    ],
  };
};

const mapDispatchToProps = {
  // dispatchSelectAllBooks: selectAllBooks,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ShelvesWrapper);
