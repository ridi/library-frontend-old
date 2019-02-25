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
  XLarge: styles => ({
    [BP.XLarge]: {
      ...styles,
    },
  }),
  XXLarge: styles => ({
    [BP.XXLarge]: {
      ...styles,
    },
  }),
  Full: styles => ({
    [BP.Full]: {
      ...styles,
    },
  }),
};
