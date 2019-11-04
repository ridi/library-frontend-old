import Download from 'svgs/Download.svg';
import FeedbackIcon from 'svgs/FeedbackIcon.svg';
import Logout from 'svgs/Logout.svg';
import Note from 'svgs/Note.svg';
import Review from 'svgs/Review.svg';
import { Modal, ModalAnchorItem, ModalButtonItem, ModalItemGroup } from '.';
import config from '../../config';

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
          <ModalAnchorItem IconComponent={FeedbackIcon} href={`${config.HELP_BASE_URL}/requests/new?ticket_form_id=664048`}>
            내 서재 의견 보내기
          </ModalAnchorItem>
        </li>
      </ul>
    </ModalItemGroup>
    <ModalItemGroup>
      <ul>
        <li>
          <ModalAnchorItem IconComponent={Note} href={config.RIDI_READING_NOTE_URL}>
            독서노트
          </ModalAnchorItem>
        </li>
        <li>
          <ModalAnchorItem IconComponent={Review} href={config.RIDI_REVIEW_URL}>
            내 리뷰 관리
          </ModalAnchorItem>
        </li>
      </ul>
    </ModalItemGroup>
    <ModalItemGroup>
      <ul>
        <li>
          <ModalButtonItem IconComponent={Download} onClick={dispatchStartExcelDownload} showSpinner={isExcelDownloading}>
            {isExcelDownloading ? '파일 생성 중' : '모든 책 목록 다운로드'}
          </ModalButtonItem>
        </li>
      </ul>
    </ModalItemGroup>
    <ModalItemGroup>
      <ModalAnchorItem IconComponent={Logout} href={config.RIDI_LOGOUT_URL}>
        로그아웃
      </ModalAnchorItem>
    </ModalItemGroup>
  </Modal>
);

export default MyMenuModal;
