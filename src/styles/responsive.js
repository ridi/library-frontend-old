import { Width } from './constants';

export const Responsive = {
  W360: styles => ({
    [`@media all and (min-width: ${Width.W360}px) and (max-width: ${Width.W600 - 1}px)`]: {
      ...styles,
    },
  }),
  W600: styles => ({
    [`@media (min-width: ${Width.W600}px) and (max-width: ${Width.W834 - 1}px)`]: {
      ...styles,
    },
  }),
  W834: styles => ({
    [`@media (min-width: ${Width.W834}px) and (max-width: ${Width.W1280 - 1}px)`]: {
      ...styles,
    },
  }),
  W1280: styles => ({
    [`@media all and (min-width: ${Width.W1280}px)`]: {
      ...styles,
    },
  }),
  Mobile: styles => ({
    [`@media (max-width: ${Width.W834 - 1}px)`]: {
      ...styles,
    },
  }),
  Pc: styles => ({
    [`@media (min-width: ${Width.W834}px)`]: {
      ...styles,
    },
  }),
};
