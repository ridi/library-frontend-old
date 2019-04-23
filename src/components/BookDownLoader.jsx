/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import connect from 'react-redux/es/connect/connect';
import { getBookDownloadSrc } from '../services/bookDownload/selectors';

class BookDownLoader extends React.Component {
  render() {
    const { src } = this.props;
    if (!src) {
      return null;
    }

    return <iframe id="iframe_book_download" width="0" height="0" frameBorder="no" scrolling="no" title="내용없음" src={src} />;
  }
}

const mapStateToProps = state => ({
  src: getBookDownloadSrc(state),
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BookDownLoader);
