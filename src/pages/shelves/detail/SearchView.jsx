/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import React from 'react';

import BottomActionBar from '../../../components/BottomActionBar';
import { ButtonType } from '../../../components/ActionBar/constants';
import FixedToolbarView from '../../../components/FixedToolbarView';
import FlexBar from '../../../components/FlexBar';
import SearchBox from '../../../components/SearchBox';
import ArrowLeft from '../../../svgs/ArrowLeft.svg';
import Responsive from '../../base/Responsive';

const navigationBarStyles = {
  wrapper: css`
    background-color: #0077d9;
    width: 100%;
  `,
  bar: css`
    height: 46px;
    display: flex;
    align-items: center;
  `,
  iconWrapper: css`
    display: block;
    padding: 13px 10px 13px 0;
  `,
  icon: css`
    width: 16px;
    height: 16px;
    fill: white;
  `,
  title: css`
    font-size: 16px;
    font-weight: bold;
    color: white;
    height: 30px;
    line-height: 30px;
  `,
};

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

function NavigationBar({ shelfTitle, onBackClick }) {
  return (
    <Responsive css={navigationBarStyles.wrapper}>
      <div css={navigationBarStyles.bar}>
        <button type="button" css={navigationBarStyles.iconWrapper} onClick={onBackClick}>
          <ArrowLeft css={navigationBarStyles.icon} />
          <span className="a11y">뒤로 가기</span>
        </button>
        <h2 css={navigationBarStyles.title}>‘{shelfTitle}’에 추가</h2>
      </div>
    </Responsive>
  );
}

function SearchBar({ isSearching, keyword, onClear, onConfirm, onKeywordChange }) {
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

export default function SearchView({ shelfTitle, onBackClick }) {
  const [keyword, setKeyword] = React.useState('');
  const [isSearching, setSearching] = React.useState(false);

  const handleSearchClear = React.useCallback(() => setSearching(false), []);
  const handleSearchConfirm = React.useCallback(
    () => {
      setSearching(keyword !== '');
      // TODO: 검색
    },
    [keyword],
  );

  function renderSearchBar() {
    return (
      <SearchBar
        isSearching={isSearching}
        keyword={keyword}
        onClear={handleSearchClear}
        onConfirm={handleSearchConfirm}
        onKeywordChange={setKeyword}
      />
    );
  }

  function renderActionBar() {
    const buttons = [{ type: ButtonType.SPACER }, { name: '추가', onClick() {}, disable: true }];
    return <BottomActionBar buttonProps={buttons} />;
  }

  return (
    <>
      <NavigationBar shelfTitle={shelfTitle} onBackClick={onBackClick} />
      <FixedToolbarView allowFixed toolbar={renderSearchBar()} actionBar={renderActionBar()}>
        <main>
          <Responsive />
        </main>
      </FixedToolbarView>
    </>
  );
}
