import React from 'react';
import { Link } from 'react-router-dom';

import { URLMap } from '../constants/urls';
import Close from '../svgs/Close.svg';
import Search from '../svgs/Search.svg';
import { makeLinkProps } from '../utils/uri';
import IconButton from './IconButton';

const styles = {
  searchBox: {
    position: 'relative',
    width: '100%',
    height: 30,
    paddingLeft: 28,
    paddingRight: 16,
    borderRadius: 3,
    backgroundColor: '#ffffff',
    border: '1px solid #d1d5d9',
    boxSizing: 'border-box',
  },
  focused: {
    borderColor: '#339cf2',
  },
  keywordAdded: {
    paddingRight: 38,
  },
  icon: {
    fill: '#9ea7ad',
    position: 'absolute',
    left: 0,
    top: 0,
    width: 12,
    height: 12,
    padding: 8,
    '.RSGIcon': {
      width: 12,
      height: 12,
    },
  },
  input: {
    width: '100%',
    height: '100%',
    fontSize: 13,
    letterSpacing: -0.7,
    color: '#40474d',
    '::placeholder': {
      color: '#9EA7AD',
    },
  },
  clearButton: {
    display: 'none',
    position: 'absolute',
    top: '50%',
    right: 0,
    width: 30,
    height: 30,
    transform: 'translate3d(0, -50%, 0)',
    '&::after': {
      content: `''`,
      borderRadius: '50%',
      display: 'block',
      width: 14,
      height: 14,
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate3d(-50%, -50%, 0)',
      background: '#D1D5D9',
    },
  },
  clearIcon: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate3d(-50%, -50%, 0)',
    width: 6,
    height: 6,
    fill: 'white',
    zIndex: 100,
  },
  clearButtonActive: {
    display: 'block',
  },
};

export default function SearchBox({ allowEmptySearch, isSearchPage, keyword, onBlur, onClear, onFocus, onKeywordChange, onSubmit }) {
  const [isSearchBoxFocused, setSearchBoxFocused] = React.useState(false);
  const inputRef = React.useRef();
  const handleChange = React.useCallback(e => onKeywordChange(e.target.value), [onKeywordChange]);
  const handleReset = React.useCallback(() => {
    onKeywordChange('');
    onClear && onClear();
  }, [onClear, onKeywordChange]);
  const handleSubmit = React.useCallback(
    e => {
      e.preventDefault();

      if (!allowEmptySearch && keyword.trim() === '') {
        return;
      }

      onSubmit && onSubmit();
    },
    [allowEmptySearch, keyword, onSubmit],
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
    const button = (
      <IconButton a11y="검색어 제거" css={[styles.clearButton, (isSearchBoxFocused || keyword) && styles.clearButtonActive]} type="reset">
        <Close css={styles.clearIcon} />
      </IconButton>
    );

    if (isSearchPage) {
      return <Link {...makeLinkProps({}, URLMap.main.as)}>{button}</Link>;
    }
    return button;
  }

  return (
    <form
      css={[styles.searchBox, isSearchBoxFocused && styles.focused, keyword && styles.keywordAdded]}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onSubmit={handleSubmit}
      onReset={handleReset}
    >
      <Search css={styles.icon} />
      <input
        ref={inputRef}
        type="search"
        name="search"
        placeholder="모든 책 검색"
        css={styles.input}
        value={keyword}
        onChange={handleChange}
        onKeyUp={handleKeyUp}
        autoComplete="off"
      />
      {renderCancelButton()}
    </form>
  );
}
