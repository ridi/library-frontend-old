import { useSelector } from 'react-redux';

import { getBookDownloadSrc } from 'services/bookDownload/selectors';

const BookDownLoader: React.FC = () => {
  const src: string = useSelector(getBookDownloadSrc);
  return src ? <iframe id="iframe_book_download" width="0" height="0" frameBorder="no" scrolling="no" title="내용없음" src={src} /> : null;
};

export default BookDownLoader;
