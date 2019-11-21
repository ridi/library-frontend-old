import { connect } from 'react-redux';

import { getBookDownloadSrc } from '../services/bookDownload/selectors';

const BookDownLoader = ({ src }) => {
  if (!src) {
    return null;
  }

  return <iframe id="iframe_book_download" width="0" height="0" frameBorder="no" scrolling="no" title="내용없음" src={src} />;
};

const mapStateToProps = state => ({
  src: getBookDownloadSrc(state),
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(BookDownLoader);
