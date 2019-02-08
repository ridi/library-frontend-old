import { Responsive, MQ } from './responsive';
import ViewType from '../constants/viewType';
import { FULL_MAX_WIDTH } from './constants';

const responsiveDefaultPadding = 16;

export const booksWrapper = (viewType, additionalPadding) => ({
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
});

export const portrait = {
  display: 'flex',
  alignItems: 'flex-end',

  '.PortraitBook': {
    width: '100%',
    maxWidth: 'inherit',
    display: 'flex',
    alignItems: 'flex-end',
  },
  ...Responsive.XSmall({
    width: 86,
    height: 164,
    padding: '0 8px',
  }),
  ...Responsive.Small({
    width: 100,
    height: 184,
    padding: '0 8px',
  }),
  ...Responsive.Medium({
    width: 110,
    height: 200,
    padding: '0 8px',
  }),
  ...MQ([Responsive.Large, Responsive.XLarge], {
    width: 110,
    height: 200,
    padding: '0 15px',
  }),
  ...MQ([Responsive.XXLarge, Responsive.Full], {
    width: 140,
    height: 254,
    padding: '0 15px',
  }),
};

export const landscape = {
  width: '100%',
  marginTop: 20,
  display: 'flex',
  position: 'relative',
  borderBottom: '1px solid #d1d5d9',

  '.LandscapeBook': {
    width: '100%',
  },
  ...MQ([Responsive.XLarge, Responsive.XXLarge, Responsive.Full], {
    width: '50%',
  }),
};
