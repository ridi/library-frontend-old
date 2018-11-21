import { css } from 'emotion';

export const FilterModal = css({
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

export const SortModal = css({
  width: 200,
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
