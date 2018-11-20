import { css } from 'emotion';

export const MyMenuModal = css({
  position: 'absolute',
  right: 8,
  top: 47,
  zIndex: 9999,
  background: 'rgba(255, 255, 255, .98)',
  borderRadius: 4,
  boxShadow: '0 4px 10px 0 rgba(0, 0, 0, 0.28), 0 0 0 0.5px rgba(0, 0, 0, 0.05)',
  opacity: 0,
  transform: 'translate3d(0, 20px, 0)',
  transition: 'opacity .3s, transform .3s',
});

export const ModalActive = css({
  opacity: 1,
  transform: 'translate3d(0, 0, 0)',
});

export const MenuList = css({
  borderTop: `1px solid #e6e8eb`,
  '&:last-of-type': {
    borderBottom: `1px solid #e6e8eb`,
  },
});

export const MenuItem = css({
  minWidth: 200,
  margin: '8px 0',
});

export const UserId = css({
  padding: '11px 14px 10px 14px',
  fontSize: 15,
  color: '#40474d',
});

export const MenuButton = css({
  position: 'relative',
  minWidth: 200,
  boxSizng: 'border-box',
  padding: '11px 11px 10px 42px',
  fontSize: 15,
  color: '#40474d',
  textAlign: 'left',
});

export const MenuIcon = css({
  position: 'absolute',
  width: 18,
  height: 18,
  left: 14,
  top: '50%',
  transform: 'translate3d(0, -50%, 0)',
  fill: '#9ea7ad',
});
