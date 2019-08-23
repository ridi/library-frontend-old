/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import ThreeDotsVertical from '../../svgs/ThreeDotsVertical.svg';
import IconButton from '../IconButton';
import { Modal, ModalButtonItem, ModalItemGroup, ModalSyncButtonItem } from '../Modal';
import * as styles from './styles';

function OrderOptionItem(props) {
  const { isSelected, option, onClick } = props;
  const handleClick = React.useCallback(() => onClick(option), [option, onClick]);
  return (
    <li>
      <ModalButtonItem title={option.title} isSelected={isSelected} onClick={handleClick} />
    </li>
  );
}

export default function ShelfOrder(props) {
  const { order, orderOptions, onOrderOptionClick, onSyncClick } = props;
  const [isModalActive, setModalActive] = React.useState(false);
  const toggleModalActive = React.useCallback(() => setModalActive(prevActive => !prevActive), []);

  return (
    <div css={styles.buttonWrapper}>
      <IconButton
        a11y="더 보기"
        css={styles.iconButton(isModalActive)}
        onClick={() => {
          setModalActive(true);
        }}
      >
        <div css={styles.iconWrapper}>
          <ThreeDotsVertical css={styles.threeDotsIcon} />
        </div>
      </IconButton>
      {isModalActive && (
        <Modal isActive={isModalActive} a11y="옵션" onClickModalBackground={toggleModalActive}>
          <ModalItemGroup groupTitle="정렬 순서">
            <ul>
              {orderOptions.map(option => (
                <OrderOptionItem key={option.key} isSelected={option.key === order} option={option} onClick={onOrderOptionClick} />
              ))}
            </ul>
          </ModalItemGroup>
          <ModalItemGroup groupTitle="책장 관리">
            <ul>
              <li>
                <ModalSyncButtonItem title="책장 동기화" onClick={onSyncClick} />
              </li>
            </ul>
          </ModalItemGroup>
        </Modal>
      )}
    </div>
  );
}
