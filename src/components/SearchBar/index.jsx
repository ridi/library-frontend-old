/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/core';
import { Icon } from '@ridi/rsg';
import IconButton from '../IconButton';
import * as styles from './styles';

export default class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      keyword: props.keyword || '',
    };

    this.input = null;
    this.searchBarForm = null;

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOnClickCancel = this.handleOnClickCancel.bind(this);
    this.handleOnClickOutOfSearchBar = this.handleOnClickOutOfSearchBar.bind(this);
  }

  setActivation(isActive) {
    const { onFocus, onBlur } = this.props;
    document.removeEventListener('click', this.handleOnClickOutOfSearchBar, true);
    if (!isActive) {
      onBlur && onBlur();
      return;
    }

    document.addEventListener('click', this.handleOnClickOutOfSearchBar, true);
    onFocus && onFocus();
  }

  handleSubmit(e) {
    e.preventDefault();
    const { onSubmit } = this.props;
    const { keyword } = this.state;

    if (!keyword.replace(/\s/g, '')) {
      return;
    }

    onSubmit(keyword);
  }

  handleChange(e) {
    this.setState({
      keyword: e.target.value,
    });
  }

  handleOnClickCancel() {
    this.setState({ keyword: '' });
    this.input && this.input.focus();
  }

  handleOnClickOutOfSearchBar(e) {
    if (this.searchBarForm && this.searchBarForm.contains(e.target)) {
      return;
    }

    this.setActivation(false);
  }

  render() {
    const { keyword } = this.state;
    return (
      <form
        ref={ref => {
          this.searchBarForm = ref;
        }}
        css={[styles.searchBarForm, keyword && styles.searchBarFormActive]}
        onSubmit={this.handleSubmit}
      >
        <Icon name="search" css={styles.searchBarIcon} />
        <input
          ref={ref => {
            this.input = ref;
          }}
          placeholder="모든 책 검색"
          type="text"
          css={styles.searchBarInput}
          value={keyword}
          onChange={this.handleChange}
          onFocus={() => this.setActivation(true)}
        />
        <IconButton
          icon="check_4"
          a11y="검색어 제거"
          css={[styles.searchBarClearButton, keyword && styles.searchBarClearButtonActive]}
          onClick={this.handleOnClickCancel}
        />
      </form>
    );
  }
}
