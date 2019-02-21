import { Responsive, MQ } from './responsive';
import ViewType from '../constants/viewType';
import { BookSize, FULL_MAX_WIDTH } from './constants';
import config from '../config';

const responsiveDefaultPadding = 16;
const separatorHeight = 1;

const separatorBG = {
  ...Responsive.XSmall({
    background: `url(${config.STATIC_URL}/static/separator/book_w86.png) center top repeat-y`,
    backgroundSize: `100% ${BookSize.XSmall.height}px`,
  }),
  ...Responsive.Small({
    background: `url(${config.STATIC_URL}/static/separator/book_w100.png) center top repeat-y`,
    backgroundSize: `100% ${BookSize.Small.height}px`,
  }),
  ...MQ([Responsive.Medium, Responsive.Large, Responsive.XLarge], {
    background: `url(${config.STATIC_URL}/static/separator/book_w110.png) center top repeat-y`,
    backgroundSize: `100% ${BookSize.Medium.height}px`,
  }),
  ...MQ([Responsive.XXLarge, Responsive.Full], {
    background: `url(${config.STATIC_URL}/static/separator/book_w140.png) center top repeat-y`,
    backgroundSize: `100% ${BookSize.Large.height}px`,
  }),
};

export const booksWrapper = (viewType, additionalPadding) => {
  const background = viewType === ViewType.PORTRAIT ? separatorBG : {};
  return {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'left',
    alignItems: 'flex-end',
    paddingBottom: 25,
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
    height: '100%',
    maxWidth: 'inherit',
    display: 'flex',
    alignItems: 'flex-end',
  },
  ...Responsive.XSmall({
    width: BookSize.XSmall.width,
    height: BookSize.XSmall.height - separatorHeight,
    padding: '0 8px',
    marginBottom: separatorHeight,
  }),
  ...Responsive.Small({
    width: BookSize.Small.width,
    height: BookSize.Small.height - separatorHeight,
    padding: '0 8px',
    marginBottom: separatorHeight,
  }),
  ...Responsive.Medium({
    width: BookSize.Medium.width,
    height: BookSize.Medium.height - separatorHeight,
    padding: '0 8px',
    marginBottom: separatorHeight,
  }),
  ...Responsive.Large({
    width: BookSize.Medium.width,
    height: BookSize.Medium.height - separatorHeight,
    padding: '0 8px',
    marginBottom: separatorHeight,
  }),
  ...Responsive.XLarge({
    width: BookSize.Medium.width,
    height: BookSize.Medium.height - separatorHeight,
    padding: '0 10px',
    marginBottom: separatorHeight,
  }),
  ...Responsive.XXLarge({
    width: BookSize.Large.width,
    height: BookSize.Large.height - separatorHeight,
    padding: '0 12px',
    marginBottom: separatorHeight,
  }),
  ...Responsive.Full({
    width: BookSize.Large.width,
    height: BookSize.Large.height - separatorHeight,
    padding: '0 10px',
    marginBottom: separatorHeight,
  }),
};

export const landscape = {
  width: '100%',
  display: 'flex',
  position: 'relative',

  '.LandscapeBook': {
    width: '100%',
    borderBottom: '1px solid #d1d5d9',
  },
  '.LandscapeBook_Thumbnail': {
    paddingTop: 20,
  },
  '.LandscapeBook_Metadata': {
    paddingTop: 30,
  },
  ...MQ([Responsive.XLarge, Responsive.XXLarge, Responsive.Full], {
    width: '50%',
  }),
};
