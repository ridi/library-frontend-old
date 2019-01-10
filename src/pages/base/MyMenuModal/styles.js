import { css } from '@emotion/core';
import { modal } from '../../../styles';

export const myMenuModal = isActive =>
  css([
    modal,
    {
      top: 47,
    },
    isActive && {
      opacity: 1,
      transform: 'translate3d(0, 0, 0)',
      pointerEvents: 'auto',
    },
  ]);

export const menuList = {
  borderTop: `1px solid #e6e8eb`,
  padding: '4px 0',
};

export const menuItem = {
  minWidth: 200,
};

export const userId = {
  padding: '11px 14px 10px 14px',
  fontSize: 15,
  color: '#40474d',
};

export const menuButton = {
  display: 'block',
  position: 'relative',
  minWidth: 200,
  boxSizing: 'border-box',
  padding: '11px 11px 10px 42px',
  fontSize: 15,
  color: '#40474d',
  textAlign: 'left',
};

export const menuIcon = {
  position: 'absolute',
  width: 18,
  height: 18,
  left: 14,
  top: '50%',
  transform: 'translate3d(0, -50%, 0)',
  fill: '#9ea7ad',
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
