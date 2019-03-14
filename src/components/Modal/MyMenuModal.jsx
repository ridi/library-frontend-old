/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Modal, ModalAnchorItem, ModalButtonItem, ModalItemGroup } from '.';
import config from '../../config';
import Download from '../../svgs/Download.svg';
import Logout from '../../svgs/Logout.svg';
import Note from '../../svgs/Note.svg';
import Review from '../../svgs/Review.svg';
import ReturnIcon from '../../svgs/ReturnIcon.svg';
import FeedbackIcon from '../../svgs/FeedbackIcon.svg';

const BEFORE_LIBRARY_URL = 'https://ridibooks.com/library/';
const FEEDBACK_URL = 'https://help.ridibooks.com/hc/ko/requests/new?ticket_form_id=573127';

const userIdStyle = {
  padding: '11px 14px 10px 14px',
  fontSize: 15,
  color: '#40474d',
};

const MyMenuModal = ({ userId, isActive, isExcelDownloading, dispatchStartExcelDownload, onClickModalBackground }) => (
  <Modal
    isActive={isActive}
    a11y="마이메뉴"
    style={{
      top: 47,
    }}
    onClickModalBackground={onClickModalBackground}
  >
    <ModalItemGroup>
      <p css={userIdStyle}>
        <strong>{userId}</strong> 님
      </p>
    </ModalItemGroup>
    <ModalItemGroup>
      <ul>
        <li>
          <ModalAnchorItem title="구매 목록으로 가기" IconComponent={ReturnIcon} href={BEFORE_LIBRARY_URL} />
        </li>
        <li>
          <ModalAnchorItem title="내 서재 의견 보내기" IconComponent={FeedbackIcon} href={FEEDBACK_URL} />
        </li>
      </ul>
    </ModalItemGroup>
    <ModalItemGroup>
      <ul>
        <li>
          <ModalAnchorItem title="독서노트" IconComponent={Note} href={config.READING_NOTE_URL} />
        </li>
        <li>
          <ModalAnchorItem title="내 리뷰 관리" IconComponent={Review} href={config.REVIEW_URL} />
        </li>
      </ul>
    </ModalItemGroup>
    <ModalItemGroup>
      <ul>
        <li>
          <ModalButtonItem
            title={isExcelDownloading ? '파일 생성중' : '모든 책 목록 다운로드'}
            IconComponent={Download}
            onClick={() => dispatchStartExcelDownload()}
            showSpinner={isExcelDownloading}
          />
        </li>
      </ul>
    </ModalItemGroup>
    <ModalItemGroup>
      <ModalAnchorItem title="로그아웃" IconComponent={Logout} href={config.LOGOUT_URL} />
    </ModalItemGroup>
  </Modal>
);

export default MyMenuModal;
