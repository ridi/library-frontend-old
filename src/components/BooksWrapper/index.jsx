/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import * as styles from '../../styles/books';

export default class BooksWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      additionalPadding: 0, // additional padding for horizontal align center
    };
    this.booksWrapperClassName = 'BooksWrapper';
    this.bookClassName = 'Book';
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.viewType !== this.props.viewType) {
      this.setBooksAdditionalPadding();
    }
  }

  componentDidMount() {
    this.setBooksAdditionalPadding();
    window.addEventListener('resize', this.setBooksAdditionalPadding);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setBooksAdditionalPadding);
  }

  setBooksAdditionalPadding = () => {
    const books = document.querySelector(`.${this.booksWrapperClassName}`);
    const book = document.querySelector(`.${this.bookClassName}`);
    const additionalPadding = Math.floor((books.offsetWidth % book.offsetWidth) / 2);
    this.setState({ additionalPadding });
  };

  render() {
    const { viewType } = this.props;
    const { additionalPadding } = this.state;

    return (
      <div className={this.booksWrapperClassName} css={styles.booksWrapper(viewType, additionalPadding)}>
        {this.props.renderBooks({ className: this.bookClassName })}
      </div>
    );
  }
}
