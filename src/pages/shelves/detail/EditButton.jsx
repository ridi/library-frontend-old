/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import React from 'react';
import ThreeDotsVertical from '../../../svgs/ThreeDotsVertical.svg';
import IconButton from '../../../components/IconButton';

const wrapper = css`
  position: relative;
  line-height: 0;
`;

const button = css`
  width: 28px;
  height: 28px;
  border-radius: 2px;
  &:hover,
  .active & {
    background-color: #f2f4f5;
  }
`;

const icon = css`
  width: 4px;
  height: 16px;
  margin: 6px 12px;
  fill: #40474d;
`;

const modalCloseButton = css`
  display: none;
  cursor: default;
  .active & {
    display: block;
    position: fixed;
    z-index: 50;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
  }
`;

const modalWrapper = css`
  display: none;
  overflow: hidden;
  max-height: 100px;
  .active & {
    display: block;
    overflow: inherit;
    z-index: 100;
    position: absolute;
    right: -6px;
    top: 32px;
  }
`;

const modal = css`
  padding: 4px 0;
  width: 140px;
  border-radius: 4px;
  box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.28), 0 0 0 0.5px rgba(0, 0, 0, 0.05);
  background: rgba(255, 255, 255, 0.98);
`;

const modalButton = css`
  width: 100%;
  box-sizing: border-box;
  padding: 12px;
  font-size: 15px;
  line-height: 19px;
  color: #40474d;
  text-align: left;
  &:hover {
    background: #f3f4f5;
  }
`;

export default function EditButton({ onRemoveClick, onRenameClick }) {
  const [modalActive, setModalActive] = React.useState(false);
  const toggleModalActive = React.useCallback(() => setModalActive(prevActive => !prevActive), []);
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
    <div css={wrapper} className={modalActive ? 'active' : ''}>
      <IconButton css={button} onClick={toggleModalActive} a11y="편집">
        <ThreeDotsVertical css={icon} />
      </IconButton>
      <button type="button" onClick={toggleModalActive} css={modalCloseButton}>
        <span className="a11y">책장 편집 모달 닫기 버튼</span>
      </button>
      <div css={modalWrapper}>
        <ul css={modal}>
          <li>
            <button type="button" css={modalButton} onClick={handleRenameClick}>
              책장 이름 변경
            </button>
          </li>
          <li>
            <button type="button" css={modalButton} onClick={handleRemoveClick}>
              책장 삭제
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
