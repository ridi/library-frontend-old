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

export default class SearchBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      keyword: props.keyword || '',
      isSearchBoxFocused: false,
    };

    this.input = React.createRef();
    this.searchBarForm = React.createRef();
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

  handleOnKeyUp = e => {
    const code = e.charCode || e.keyCode;
    if (code === 27) {
      this.input.blur();
    }
  };

  handleOnFocus = () => {
    const { onFocus } = this.props;
    onFocus && onFocus();
    this.setState({ isSearchBoxFocused: true });
  };

  handleOnBlur = () => {
    const { onBlur } = this.props;
    onBlur && onBlur();
    this.setState({ isSearchBoxFocused: false });
  };

  handleOnClickCancel = () => {
    this.setState({ keyword: '' });
  };

  renderCancelButton() {
    const { keyword, isSearchBoxFocused } = this.state;
    const { isSearchPage } = this.props;

    if (isSearchPage) {
      return (
        <Link prefetch {...makeLinkProps(URLMap.main.href, URLMap.main.as)}>
          <a css={[styles.searchBoxClearButton, (isSearchBoxFocused || keyword) && styles.searchBoxClearButtonActive]}>
            <Close css={styles.searchBoxClearIcon} />
          </a>
        </Link>
      );
    }

    return (
      <IconButton
        a11y="검색어 제거"
        css={[styles.searchBoxClearButton, (isSearchBoxFocused || keyword) && styles.searchBoxClearButtonActive]}
        onClick={this.handleOnClickCancel}
      >
        <Close css={styles.searchBoxClearIcon} />
      </IconButton>
    );
  }

  render() {
    const { keyword, isSearchBoxFocused } = this.state;
    return (
      <form
        ref={this.searchBarForm}
        css={[styles.searchBox, isSearchBoxFocused && styles.searchBoxFocused, keyword && styles.searchBoxKeywordAdded]}
        onSubmit={this.handleSubmit}
        action="."
      >
        <Search css={styles.searchBoxIcon} />
        <input
          ref={this.input}
          type="search"
          name="search"
          placeholder="모든 책 검색"
          css={styles.searchBoxInput}
          value={keyword}
          onChange={this.handleChange}
          onFocus={this.handleOnFocus}
          onBlur={this.handleOnBlur}
          onKeyUp={this.handleOnKeyUp}
          autoComplete="off"
        />
        {this.renderCancelButton()}
      </form>
    );
  }
}
