/** @jsx jsx */
import { css, jsx } from '@emotion/core';
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
  const handlePortraitClick = React.useCallback(
    () => {
      setModalActive(false);
      onViewTypeChange && onViewTypeChange(ViewType.PORTRAIT);
    },
    [onViewTypeChange],
  );
  const handleLandscapeClick = React.useCallback(
    () => {
      setModalActive(false);
      onViewTypeChange && onViewTypeChange(ViewType.LANDSCAPE);
    },
    [onViewTypeChange],
  );
  const handleRemoveClick = React.useCallback(
    () => {
      setModalActive(false);
      onRemoveClick && onRemoveClick();
    },
    [onRemoveClick],
  );
  const handleRenameClick = React.useCallback(
    () => {
      setModalActive(false);
      onRenameClick && onRenameClick();
    },
    [onRenameClick],
  );

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
                <ModalButtonItem title="표지만 보기" isSelected={viewType === ViewType.PORTRAIT} onClick={handlePortraitClick} />
              </li>
              <li>
                <ModalButtonItem title="목록 보기" isSelected={viewType === ViewType.LANDSCAPE} onClick={handleLandscapeClick} />
              </li>
            </ul>
          </ModalItemGroup>
          <ModalItemGroup groupTitle="책장 편집">
            <ul>
              <li>
                <ModalButtonItem title="책장 이름 변경" onClick={handleRenameClick} />
              </li>
              <li>
                <ModalButtonItem title="책장 삭제" onClick={handleRemoveClick} />
              </li>
            </ul>
          </ModalItemGroup>
        </Modal>
      )}
    </div>
  );
}
