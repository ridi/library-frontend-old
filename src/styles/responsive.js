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

export const MQ = (breakPoints, styles) =>
  typeof styles === 'string'
    ? breakPoints.reduce((acc, breakPoint) => acc + breakPoint(styles), '')
    : breakPoints.reduce((acc, breakPoint) => Object.assign(breakPoint(styles), acc), {});

const stylesFactory = (_BP, styles) => (typeof styles === 'string' ? `${_BP} {${styles}}` : { [_BP]: { ...styles } });

export const Responsive = {
  XSmall: styles => stylesFactory(BP.XSmall, styles),
  Small: styles => stylesFactory(BP.Small, styles),
  Medium: styles => stylesFactory(BP.Medium, styles),
  Large: styles => stylesFactory(BP.Large, styles),
  XLarge: styles => stylesFactory(BP.XLarge, styles),
  XXLarge: styles => stylesFactory(BP.XXLarge, styles),
  Full: styles => stylesFactory(BP.Full, styles),
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
