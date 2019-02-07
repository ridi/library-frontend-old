import { Responsive, MQ } from '../../styles/responsive';
import ViewType from '../../constants/viewType';

const responsiveDefaultPadding = 16;

export const books = (viewType, additionalPadding) => ({
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'row',
  justifyContent: 'left',
  paddingBottom: 26,
  maxWidth: 1200,
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
  '.LandscapeBook': {
    width: '100%',
    borderBottom: '1px solid #d1d5d9',
  },
  ...MQ([Responsive.XLarge, Responsive.XXLarge, Responsive.Full], {
    width: '50%',
  }),
};

export const landscapeFullButton = {
  display: 'block',
  position: 'absolute',
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
  'a, button': {
    display: 'block',
    width: '100%',
    height: '100%',
    fontSize: 0,
    lineHeight: 0,
    color: 'transparent',
  },
};
