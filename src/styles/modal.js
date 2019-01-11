export const modal = {
  display: 'block',
  position: 'absolute',
  width: 200,
  right: 8,
  top: -6,
  zIndex: 9999,
  background: 'rgba(255, 255, 255, .98)',
  borderRadius: 4,
  boxShadow: '0 4px 10px 0 rgba(0, 0, 0, 0.28), 0 0 0 0.5px rgba(0, 0, 0, 0.05)',
  opacity: 0,
  transform: 'translate3d(0, 20px, 0)',
  transition: 'opacity .3s, transform .3s',
  pointerEvents: 'none',
  overflow: 'hidden',
};

export const modalMenuList = {
  padding: '4px 0',
  borderTop: `1px solid #e6e8eb`,
  '&:first-of-type': {
    borderTop: 0,
  },
};

export const modalMenuItem = {
  display: 'block',
  position: 'relative',
  minWidth: 200,
  boxSizing: 'border-box',
  padding: '11px 11px 10px 42px',
  fontSize: 15,
  color: '#40474d',
  textAlign: 'left',
};

export const modalMenuIcon = {
  position: 'absolute',
  width: 18,
  height: 18,
  left: 14,
  top: '50%',
  transform: 'translate3d(0, -50%, 0)',
  fill: '#9ea7ad',
};
