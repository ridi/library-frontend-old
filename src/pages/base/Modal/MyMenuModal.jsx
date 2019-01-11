/** @jsx jsx */
import { jsx } from '@emotion/core';
import config from '../../../config';
import Download from '../../../svgs/Download.svg';
import Logout from '../../../svgs/Logout.svg';
import Note from '../../../svgs/Note.svg';
import Review from '../../../svgs/Review.svg';
import { Modal, ModalItemGroup, ModalButtonItem, ModalAnchorItem } from '../../../components/Modal';

const userIdStyle = {
  padding: '11px 14px 10px 14px',
  fontSize: 15,
  color: '#40474d',
};

const MyMenuModal = ({ userId, isActive, isExcelDownloading, dispatchStartExcelDownload }) => (
  <Modal
    isActive={isActive}
    a11y="마이메뉴"
    style={{
      top: 47,
    }}
  >
    <ModalItemGroup>
      <p css={userIdStyle}>
        <strong>{userId}</strong> 님
      </p>
    </ModalItemGroup>
    <ModalItemGroup>
      <ul>
        <li>
          <ModalAnchorItem title="독서노트" IconComponent={Note} href={config.READING_NOTE_URL} isOuterLink />
        </li>
        <li>
          <ModalAnchorItem title="내 리뷰 관리" IconComponent={Review} href={config.REVIEW_URL} isOuterLink />
        </li>
      </ul>
    </ModalItemGroup>
    <ModalItemGroup>
      <ul>
        <li>
          <ModalButtonItem
            title="구매 목록 엑셀 다운로드"
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
