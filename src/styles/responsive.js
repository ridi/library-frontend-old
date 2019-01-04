import { ResponsiveWidth } from './constants';

export const Layout = {
  W360: styles => ({
    [`@media all and (min-width: ${ResponsiveWidth.W360}px) and (max-width: ${ResponsiveWidth.W600}px)`]: {
      ...styles,
    },
  }),
  W600: styles => ({
    [`@media (min-width: ${ResponsiveWidth.W600}px) and (max-width: ${ResponsiveWidth.W834}px)`]: {
      ...styles,
    },
  }),
  W834: styles => ({
    [`@media (min-width: ${ResponsiveWidth.W834}px) and (max-width: ${ResponsiveWidth.W1280}px)`]: {
      ...styles,
    },
  }),
  W1280: styles => ({
    [`@media all and (min-width: ${ResponsiveWidth.W1280}px)`]: {
      ...styles,
    },
  }),
};
