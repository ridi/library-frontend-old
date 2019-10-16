import { css } from '@emotion/core';
import React from 'react';
import { useSelector } from 'react-redux';

import FlexBar from 'components/FlexBar';
import SearchBox from 'components/SearchBox';
import * as Tools from 'components/Tool';

import * as filterSelectors from 'services/purchased/filter/selectors';

const searchBarStyles = {
  bar: css`
    border-bottom: 1px solid #d1d5d9;
    box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.04);
    background-color: #f3f4f5;
  `,
};

export default function SearchBar({ filter, keyword, onClear, onConfirm, onFilterChange, onKeywordChange }) {
  const filterOptions = useSelector(filterSelectors.getFilterOptions);
  const left = <SearchBox keyword={keyword} onClear={onClear} onSubmit={onConfirm} onKeywordChange={onKeywordChange} />;
  const right = <Tools.Filter filter={filter} filterOptions={filterOptions} onFilterChange={onFilterChange} />;
  return <FlexBar css={searchBarStyles.bar} flexLeft={left} flexRight={right} />;
}
