import { css } from '@emotion/core';
import { modal, modalMenuList, modalMenuItem, modalMenuIcon } from '../../../styles';

export const myMenuModal = isActive =>
  css([
    {
      ...modal,
      top: 47,
    },
    isActive && {
      opacity: 1,
      transform: 'translate3d(0, 0, 0)',
      pointerEvents: 'auto',
    },
  ]);

export const menuList = { ...modalMenuList };

export const menuButton = { ...modalMenuItem };

export const menuIcon = { ...modalMenuIcon };

export const userId = {
  padding: '11px 14px 10px 14px',
  fontSize: 15,
  color: '#40474d',
};

export const excelDownloading = {
  position: 'absolute',
  width: 18,
  height: 18,
  left: 100,
  top: '50%',
  transform: 'translate3d(0, -50%, 0)',
  fill: '#9ea7ad',
};
