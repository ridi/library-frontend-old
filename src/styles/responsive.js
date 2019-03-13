import { BookSize, Width } from './constants';

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

export const getResponsiveBookSizeForBookList = screenWidth => {
  const bookSize = {
    width: BookSize.Medium.width,
    height: BookSize.Medium.height,
  };
  if (screenWidth >= Width.W1280) {
    bookSize.width = BookSize.Large.width;
    bookSize.height = BookSize.Large.height;
  } else if (screenWidth >= Width.W414) {
    bookSize.width = BookSize.Medium.width;
    bookSize.height = BookSize.Medium.height;
  } else if (screenWidth >= Width.W360) {
    bookSize.width = BookSize.Small.width;
    bookSize.height = BookSize.Small.height;
  } else {
    bookSize.width = BookSize.XSmall.width;
    bookSize.height = BookSize.XSmall.height;
  }
  return bookSize;
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

export const Hoverable = styles => ({
  '@media (hover: hover)': {
    ':hover': {
      ...styles,
    },
  },
  '@media (hover: none)': {
    ':active, :focus': {
      ...styles,
    },
  },
});
