import { css } from '@emotion/core';
import IconButton from 'components/IconButton';
import { Modal, ModalButtonItem, ModalItemGroup, ModalLinkItem } from 'components/Modal';
import { OrderOptions } from 'constants/orderOptions';
import { URLMap } from 'constants/urls';
import ViewType from 'constants/viewType';
import React from 'react';
import { withRouter } from 'react-router-dom';
import ThreeDotsVertical from 'svgs/ThreeDotsVertical.svg';
import { makeLinkProps } from 'utils/uri';
import * as styles from './styles';

const modalStyle = css`
  margin-top: 4px;
`;

const ShelfEdit = ({ onRemoveClick, onRenameClick, onViewTypeChange, viewType, location, uuid }) => {
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

  const urlParams = new URLSearchParams(location.search);
  const orderType = urlParams.get('order_type') || OrderOptions.SHELF_BOOK_DEFAULT.orderType;
  const orderOptions = OrderOptions.toShelfList();
  const pathName = URLMap.shelfDetail.as({ uuid });
  const handleOrderClick = () => {
    setModalActive(false);
  };

  return (
    <div css={styles.buttonWrapper}>
      <IconButton a11y="책장 보기 방식 변경 및 편집, 정렬" css={styles.iconButton(isModalActive)} onClick={toggleModalActive}>
        <div css={styles.iconWrapper}>
          <ThreeDotsVertical css={styles.threeDotsIcon} />
        </div>
      </IconButton>
      {isModalActive && (
        <Modal isActive={isModalActive} a11y="옵션" style={modalStyle} onClickModalBackground={toggleModalActive}>
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
          <ModalItemGroup groupTitle="정렬 순서">
            <ul>
              {orderOptions.map(option => {
                const newPageOptions = {
                  page: 1,
                  orderType: option.orderType,
                };
                const { to } = makeLinkProps({}, pathName, newPageOptions);
                return (
                  <li key={option.key}>
                    <ModalLinkItem isSelected={option.orderType === orderType} to={to} onClick={handleOrderClick} replace>
                      {option.title}
                    </ModalLinkItem>
                  </li>
                );
              })}
            </ul>
          </ModalItemGroup>
        </Modal>
      )}
    </div>
  );
};

export default withRouter(ShelfEdit);
