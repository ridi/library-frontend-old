import { Width } from './constants';

const under = maxWidth => `@media all and (max-width: ${maxWidth - 1}px)`;
const between = (minWidth, maxWidth) => `@media all and (min-width: ${minWidth}px) and (max-width: ${maxWidth - 1}px)`;
const moreThan = minWidth => `@media all and (min-width: ${minWidth}px)`;

export const BP = {
  XSmall: under(Width.W360),
  Small: between(Width.W360, Width.W414),
  Medium: between(Width.W414, Width.W600),
  Large: between(Width.W600, Width.W834),
  XLarge: between(Width.W834, Width.W1280),
  XXLarge: between(Width.W1280, Width.W1440),
  Full: moreThan(Width.W1440),
};

export const MQ = (breakPoints, styles) => breakPoints.reduce((acc, breakPoint) => Object.assign(breakPoint(styles), acc), {});

export const Responsive = {
  XSmall: styles => ({
    [BP.XSmall]: {
      ...styles,
    },
  }),
  Small: styles => ({
    [BP.Small]: {
      ...styles,
    },
  }),
  Medium: styles => ({
    [BP.Medium]: {
      ...styles,
    },
  }),
  Large: styles => ({
    [BP.Large]: {
      ...styles,
    },
  }),
  XXLarge: styles => ({
    [BP.XXLarge]: {
      ...styles,
    },
  }),
  XLarge: styles => ({
    [BP.XLarge]: {
      ...styles,
    },
  }),
  Full: styles => ({
    [BP.Full]: {
      ...styles,
    },
  }),
  W360: styles => ({
    [`@media all and (max-width: ${Width.W600 - 1}px)`]: {
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
