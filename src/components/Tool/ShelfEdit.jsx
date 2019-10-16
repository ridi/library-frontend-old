import { css } from '@emotion/core';
import React from 'react';
import ViewType from '../../constants/viewType';
import ThreeDotsVertical from '../../svgs/ThreeDotsVertical.svg';
import IconButton from '../IconButton';
import { Modal, ModalButtonItem, ModalItemGroup } from '../Modal';
import * as styles from './styles';

const modalStyle = css`
  margin-top: 4px;
`;

export default function ShelfEdit(props) {
  const { onRemoveClick, onRenameClick, onViewTypeChange, viewType } = props;
  const [isModalActive, setModalActive] = React.useState(false);
  const toggleModalActive = React.useCallback(() => setModalActive(prevActive => !prevActive), []);
  const handlePortraitClick = React.useCallback(() => {
    setModalActive(false);
    onViewTypeChange && onViewTypeChange(ViewType.PORTRAIT);
  }, [onViewTypeChange]);
  const handleLandscapeClick = React.useCallback(() => {
    setModalActive(false);
    onViewTypeChange && onViewTypeChange(ViewType.LANDSCAPE);
  }, [onViewTypeChange]);
  const handleRemoveClick = React.useCallback(() => {
    setModalActive(false);
    onRemoveClick && onRemoveClick();
  }, [onRemoveClick]);
  const handleRenameClick = React.useCallback(() => {
    setModalActive(false);
    onRenameClick && onRenameClick();
  }, [onRenameClick]);

  return (
    <div css={styles.buttonWrapper}>
      <IconButton a11y="책장 보기 방식 변경 및 편집" css={styles.iconButton(isModalActive)} onClick={toggleModalActive}>
        <div css={styles.iconWrapper}>
          <ThreeDotsVertical css={styles.threeDotsIcon} />
        </div>
      </IconButton>
      {isModalActive && (
        <Modal isActive={isModalActive} a11y="옵션" style={modalStyle} onClickModalBackground={toggleModalActive}>
          <ModalItemGroup groupTitle="보기 방식">
            <ul>
              <li>
                <ModalButtonItem isSelected={viewType === ViewType.PORTRAIT} onClick={handlePortraitClick}>
                  표지만 보기
                </ModalButtonItem>
              </li>
              <li>
                <ModalButtonItem isSelected={viewType === ViewType.LANDSCAPE} onClick={handleLandscapeClick}>
                  목록 보기
                </ModalButtonItem>
              </li>
            </ul>
          </ModalItemGroup>
          <ModalItemGroup groupTitle="책장 편집">
            <ul>
              <li>
                <ModalButtonItem onClick={handleRenameClick}>책장 이름 변경</ModalButtonItem>
              </li>
              <li>
                <ModalButtonItem onClick={handleRemoveClick}>책장 삭제</ModalButtonItem>
              </li>
            </ul>
          </ModalItemGroup>
        </Modal>
      )}
    </div>
  );
}
