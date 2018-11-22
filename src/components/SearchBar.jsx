import React from 'react';
import classname from 'classnames';
import { css } from 'emotion';
import { Icon } from '@ridi/rsg';

import IconButton from './IconButton';

const styles = {
  SearchBarForm: css({
    position: 'relative',
    width: '100%',
    height: 30,
    paddingLeft: 28,
    paddingRight: 16,
    borderRadius: 3,
    backgroundColor: '#ffffff',
    border: '1px solid #d1d5d9',
    boxSizing: 'border-box',
  }),
  SearchBarIcon: css({
    position: 'absolute',
    left: 0,
    top: 0,
    width: 12,
    height: 12,
    padding: 9,
    '.RSGIcon': {
      width: 12,
      height: 12,
    },
  }),
  SearchBarInput: css({
    width: '100%',
    height: '100%',
    fontSize: 13,
    letterSpacing: -0.7,
    color: '#9ea7ad',
  }),
  SearchBarClearButton: css({
    display: 'none',
    position: 'absolute',
    top: 0,
    right: 0,
    width: 30,
    height: 30,
    padding: 8,
    '.RSGIcon': {
      width: 14,
      height: 14,
    },
  }),

  SearchBarFormActive: css({
    paddingRight: 38,
  }),
  SearchBarClearButtonActive: css({
    display: 'block',
  }),
};

export default class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      keyword: '',
    };

    this.input = null;
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOnClickCancel = this.handleOnClickCancel.bind(this);
    this.handleOnFocusInput = this.handleOnFocusInput.bind(this);
    this.handleOnBlurInput = this.handleOnBlurInput.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.keyword && nextProps.keyword !== prevState.keyword) {
      return { keyword: nextProps.keyword };
    }

    return null;
  }

  handleChange(e) {
    this.setState({
      keyword: e.target.value,
    });
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

  handleOnClickCancel() {
    this.setState({ keyword: '' });
    this.input && this.input.blur();
  }

  handleOnFocusInput() {
    const { onFocus } = this.props;
    if (onFocus) {
      onFocus();
    }
  }

  handleOnBlurInput() {
    const { onBlur } = this.props;
    if (onBlur) {
      onBlur();
    }
  }

  render() {
    const { keyword } = this.state;
    return (
      <form className={classname(styles.SearchBarForm, keyword && styles.SearchBarFormActive)} onSubmit={this.handleSubmit}>
        <Icon name="search" className={styles.SearchBarIcon} />
        <input
          ref={ref => {
            this.input = ref;
          }}
          placeholder="모든 책 검색"
          type="text"
          className={styles.SearchBarInput}
          value={keyword}
          onChange={this.handleChange}
          onFocus={this.handleOnFocusInput}
          onBlur={this.handleOnBlurInput}
        />
        <IconButton
          icon="check_4"
          a11y="검색어 제거"
          className={classname(styles.SearchBarClearButton, keyword && styles.SearchBarClearButtonActive)}
          onClick={this.handleOnClickCancel}
        />
      </form>
    );
  }
}
