import { Responsive, MQ } from './responsive';
import ViewType from '../constants/viewType';
import { FULL_MAX_WIDTH } from './constants';
import config from '../config';

const responsiveDefaultPadding = 16;

const separatorBG = {
  ...Responsive.XSmall({
    background: `url(${config.STATIC_URL}/static/separator/book_w86.png) center top repeat-y`,
    backgroundSize: '100% 165px',
  }),
  ...Responsive.Small({
    background: `url(${config.STATIC_URL}/static/separator/book_w100.png) center top repeat-y`,
    backgroundSize: '100% 185px',
  }),
  ...MQ([Responsive.Medium, Responsive.Large, Responsive.XLarge], {
    background: `url(${config.STATIC_URL}/static/separator/book_w110.png) center top repeat-y`,
    backgroundSize: '100% 201px',
  }),
  ...MQ([Responsive.XXLarge, Responsive.Full], {
    background: `url(${config.STATIC_URL}/static/separator/book_w140.png) center top repeat-y`,
    backgroundSize: '100% 255px',
  }),
};

export const booksWrapper = (viewType, additionalPadding) => {
  const background = viewType === ViewType.PORTRAIT ? separatorBG : {};
  return {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'left',
    paddingBottom: 26,
    maxWidth: FULL_MAX_WIDTH,
    margin: '0 auto',
    boxSizing: 'border-box',
    paddingRight: viewType === ViewType.LANDSCAPE ? responsiveDefaultPadding : 0,
    paddingLeft: viewType === ViewType.LANDSCAPE ? responsiveDefaultPadding : additionalPadding,
    ...MQ([Responsive.XSmall, Responsive.Small, Responsive.Medium], {
      paddingRight: viewType === ViewType.LANDSCAPE && 0,
      paddingLeft: viewType === ViewType.LANDSCAPE && 0,
    }),
    ...background,
  };
};

export const portrait = {
  display: 'flex',
  alignItems: 'flex-end',

  '.PortraitBook': {
    width: '100%',
    maxWidth: 'inherit',
    display: 'flex',
    alignItems: 'flex-end',
    marginBottom: 2,
  },
  ...Responsive.XSmall({
    width: 86,
    height: 165,
    padding: '0 8px',
  }),
  ...Responsive.Small({
    width: 100,
    height: 185,
    padding: '0 8px',
  }),
  ...Responsive.Medium({
    width: 110,
    height: 201,
    padding: '0 8px',
  }),
  ...MQ([Responsive.Large, Responsive.XLarge], {
    width: 110,
    height: 201,
    padding: '0 15px',
  }),
  ...MQ([Responsive.XXLarge, Responsive.Full], {
    width: 140,
    height: 255,
    padding: '0 15px',
  }),
};

export const landscape = {
  width: '100%',
  marginTop: 20,
  display: 'flex',
  position: 'relative',

  '.LandscapeBook': {
    width: '100%',
    borderBottom: '1px solid #d1d5d9',
  },
  ...MQ([Responsive.XLarge, Responsive.XXLarge, Responsive.Full], {
    width: '50%',
  }),
};
