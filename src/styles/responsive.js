import { Width } from './constants';

export const Responsive = {
  W360: styles => ({
    [`@media all and (min-width: ${Width.W360}px) and (max-width: ${Width.W600}px)`]: {
      ...styles,
    },
  }),
  W600: styles => ({
    [`@media (min-width: ${Width.W600}px) and (max-width: ${Width.W834}px)`]: {
      ...styles,
    },
  }),
  W834: styles => ({
    [`@media (min-width: ${Width.W834}px) and (max-width: ${Width.W1280}px)`]: {
      ...styles,
    },
  }),
  W1280: styles => ({
    [`@media all and (min-width: ${Width.W1280}px)`]: {
      ...styles,
    },
  }),
};
