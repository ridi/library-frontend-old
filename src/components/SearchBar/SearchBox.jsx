/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import Close from '../../svgs/Close.svg';
import Search from '../../svgs/Search.svg';
import IconButton from '../IconButton';
import * as styles from './styles';

export default class SearchBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      keyword: props.keyword || '',
      isSearchBoxFocused: false,
    };

    this.input = null;
    this.searchBarForm = null;
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleOnClickOutOfSearchBar, true);
  }

  setActivation(isActive) {
    const { onFocus, onBlur } = this.props;
    document.removeEventListener('click', this.handleOnClickOutOfSearchBar, true);
    if (!isActive) {
      onBlur && onBlur();
      this.setState({ isSearchBoxFocused: false });
      return;
    }

    document.addEventListener('click', this.handleOnClickOutOfSearchBar, true);
    this.setState({ isSearchBoxFocused: true });
    onFocus && onFocus();
  }

  handleSubmit = e => {
    e.preventDefault();

    const { onSubmit } = this.props;
    const { keyword } = this.state;

    if (!keyword.replace(/\s/g, '')) {
      return;
    }

    onSubmit(keyword);
  };

  handleChange = e => {
    this.setState({
      keyword: e.target.value,
    });
  };

  handleOnClickCancel = () => {
    this.setState({ keyword: '' });
    this.input && this.input.focus();
  };

  handleOnClickOutOfSearchBar = e => {
    if (this.searchBarForm && this.searchBarForm.contains(e.target)) {
      return;
    }

    this.setActivation(false);
  };

  handleOnKeyUp = e => {
    const { onBlur } = this.props;
    var code = e.charCode || e.keyCode;
    if (code == 27) {
      this.input.blur();
      onBlur && onBlur();
      this.setState({ isSearchBoxFocused: false });
    }
  };

  render() {
    const { keyword, isSearchBoxFocused } = this.state;
    return (
      <form
        ref={ref => {
          this.searchBarForm = ref;
        }}
        css={[styles.searchBox, isSearchBoxFocused && styles.searchBoxFocused, keyword && styles.searchBoxKeywordAdded]}
        onSubmit={this.handleSubmit}
        action="."
      >
        <Search css={styles.searchBoxIcon} />
        <input
          ref={ref => {
            this.input = ref;
          }}
          type="search"
          name="search"
          placeholder="모든 책 검색"
          css={styles.searchBoxInput}
          value={keyword}
          onChange={this.handleChange}
          onFocus={() => this.setActivation(true)}
          onKeyUp={this.handleOnKeyUp}
        />
        <IconButton
          a11y="검색어 제거"
          css={[styles.searchBoxClearButton, keyword && styles.searchBoxClearButtonActive]}
          onClick={this.handleOnClickCancel}
        >
          <Close css={styles.searchBoxClearIcon} />
        </IconButton>
      </form>
    );
  }
}
