/** @jsx jsx */
import React from 'react';
import Link from 'next/link';
import { jsx } from '@emotion/core';
import Close from '../../svgs/Close.svg';
import Search from '../../svgs/Search.svg';
import IconButton from '../IconButton';
import * as styles from './styles';
import { makeLinkProps } from '../../utils/uri';
import { URLMap } from '../../constants/urls';

export default function SearchBox({ isSearchPage, keyword, onBlur, onFocus, onKeywordChange, onSubmit }) {
  const [isSearchBoxFocused, setSearchBoxFocused] = React.useState(false);
  const inputRef = React.useRef();
  const handleChange = React.useCallback(e => onKeywordChange(e.target.value), [onKeywordChange]);
  const handleClear = React.useCallback(() => onKeywordChange(''), [onKeywordChange]);
  const handleSubmit = React.useCallback(
    e => {
      e.preventDefault();

      if (keyword.trim() === '') {
        return;
      }

      onSubmit && onSubmit();
    },
    [keyword, onSubmit],
  );
  const handleFocus = React.useCallback(
    e => {
      onFocus && onFocus(e);
      setSearchBoxFocused(true);
    },
    [onFocus],
  );
  const handleBlur = React.useCallback(
    e => {
      onBlur && onBlur(e);
      setSearchBoxFocused(false);
    },
    [onFocus],
  );
  const handleKeyUp = React.useCallback(e => {
    if (e.key === 'Esc' || e.key === 'Escape') {
      inputRef.current.blur();
    }
  }, []);

  function renderCancelButton() {
    const handleCancel = isSearchPage ? undefined : handleClear;
    const button = (
      <IconButton
        a11y="검색어 제거"
        css={[styles.searchBoxClearButton, (isSearchBoxFocused || keyword) && styles.searchBoxClearButtonActive]}
        onClick={handleCancel}
      >
        <Close css={styles.searchBoxClearIcon} />
      </IconButton>
    );

    if (isSearchPage) {
      return (
        <Link prefetch {...makeLinkProps(URLMap.main.href, URLMap.main.as)}>
          {button}
        </Link>
      );
    }
    return button;
  }

  return (
    <form
      css={[styles.searchBox, isSearchBoxFocused && styles.searchBoxFocused, keyword && styles.searchBoxKeywordAdded]}
      onSubmit={handleSubmit}
      action="."
    >
      <Search css={styles.searchBoxIcon} />
      <input
        ref={inputRef}
        type="search"
        name="search"
        placeholder="모든 책 검색"
        css={styles.searchBoxInput}
        value={keyword}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyUp={handleKeyUp}
        autoComplete="off"
      />
      {renderCancelButton()}
    </form>
  );
}
