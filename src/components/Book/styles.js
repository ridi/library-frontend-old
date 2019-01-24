import { Responsive } from '../../styles/responsive';
import ViewType from '../../constants/viewType';

const responsiveDefaultPadding = 16;

export const books = (viewType, additionalPadding) => ({
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'row',
  justifyContent: 'left',
  paddingBottom: 26,
  margin: '0 auto',
  boxSizing: 'border-box',
  paddingRight: viewType === ViewType.LANDSCAPE ? responsiveDefaultPadding : 0,
  paddingLeft: viewType === ViewType.LANDSCAPE ? responsiveDefaultPadding : additionalPadding,

  ...Responsive.W360({
    paddingRight: viewType === ViewType.LANDSCAPE && 0,
    paddingLeft: viewType === ViewType.LANDSCAPE && 0,
  }),
  ...Responsive.W600({
    // width: 530,
  }),
  ...Responsive.W834({
    // width: 670,
  }),
  ...Responsive.W1280({
    width: 960,
  }),
});

export const portrait = {
  width: 110,
  padding: '0 15px',
  marginTop: 30,
  '.PortraitBook': {
    width: '100%',
  },
  ...Responsive.W360({
    width: '25vw',
    minWidth: 80,
    maxWidth: 100,
    height: 150,
    padding: '0 8px',
    display: 'flex',
    alignItems: 'flex-end',
  }),
  ...Responsive.W600({}),
  ...Responsive.W834({}),
  ...Responsive.W1280({
    padding: '0 30px',
  }),
};
export const landscape = {
  width: '100%',
  paddingTop: 20,
  display: 'flex',
  '.LandscapeBook': {
    width: '100%',
    borderBottom: '1px solid #d1d5d9',
  },
  ...Responsive.W834({
    width: '50%',
  }),
  ...Responsive.W1280({
    width: '50%',
  }),
};
