/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import React from 'react';
import FlexBar from '../../../../components/FlexBar';
import SearchBox from '../../../../components/SearchBox';

const searchBarStyles = {
  bar: css`
    border-bottom: 1px solid #d1d5d9;
    box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.04);
    background-color: #f3f4f5;
  `,
  cancelButton: css`
    display: block;
    margin-left: 14px;
    border-radius: 4px;
    box-shadow: 1px 1px 1px 0 rgba(0, 0, 0, 0.05);
    background-color: white;
    border: 1px solid #d1d5d9;
    width: 50px;
    height: 28px;
    line-height: 28px;
    font-size: 13px;
    font-weight: bold;
    text-align: center;
    color: #808991;
  `,
};

export default function SearchBar({ isSearching, keyword, onClear, onConfirm, onKeywordChange }) {
  const [isFocused, setFocused] = React.useState(false);
  const handleFocus = React.useCallback(() => setFocused(true), []);
  const handleBlur = React.useCallback(() => setFocused(false), []);
  const handleCancelButtonClick = React.useCallback(
    () => {
      onKeywordChange && onKeywordChange('');
      onClear && onClear();
    },
    [onClear, onKeywordChange],
  );
  const left = (
    <SearchBox
      keyword={keyword}
      onBlur={handleBlur}
      onClear={onClear}
      onFocus={handleFocus}
      onSubmit={onConfirm}
      onKeywordChange={onKeywordChange}
    />
  );
  const right =
    isSearching && !isFocused ? (
      <button type="button" css={searchBarStyles.cancelButton} onClick={handleCancelButtonClick}>
        취소
      </button>
    ) : null;
  return <FlexBar css={searchBarStyles.bar} flexLeft={left} flexRight={right} />;
}
