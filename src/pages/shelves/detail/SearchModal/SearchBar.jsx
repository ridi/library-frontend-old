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
  cancelButton: css`
    width: 55px;
    height: 30px;
    margin-left: 12px;
    border: 1px solid #d1d5d9;
    border-radius: 4px;
    line-height: 28px;
    font-size: 13px;
    font-weight: bold;
    text-align: center;
    color: #808991;
    background-color: white;
  `,
};

export default function SearchBar({ filter, isSearching, keyword, onClear, onConfirm, onFilterChange, onKeywordChange }) {
  const { allCategoryOption, categoryOptions } = useSelector(filterSelectors.getFilterOptions);
  const left = <SearchBox allowEmptySearch keyword={keyword} onClear={onClear} onSubmit={onConfirm} onKeywordChange={onKeywordChange} />;
  const right = (
    <>
      <Tools.Filter filter={filter} filterOptions={{ allCategoryOption, categoryOptions }} onFilterChange={onFilterChange} />
      {isSearching && (
        <button type="button" css={searchBarStyles.cancelButton} onClick={onClear}>
          취소
        </button>
      )}
    </>
  );
  return <FlexBar css={searchBarStyles.bar} flexLeft={left} flexRight={right} />;
}
