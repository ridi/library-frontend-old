import { css } from 'emotion';
import { screenSize, PAGE_MAX_WIDTH } from '../../../styles';

export const GNB = css([
  screenSize.isMobile({
    padding: '2px 0',
  }),
  { background: 'white' },
]);

export const FlexWrapper = css({
  background: 'white',
  display: 'flex',
  justifyContent: 'space-between',
  maxWidth: PAGE_MAX_WIDTH,
  margin: '0 auto',
});

export const Title = css({
  display: 'inline-block',
  padding: '12px 6px 12px 16px',
  fontSize: 20,
  fontWeight: 900,
  color: '#212529',
  height: 24,
  lineHeight: '22px',
  verticalAlign: 'top',
});

export const TitleLink = css({});

export const FamilyServiceList = css({
  display: 'inline-block',
  padding: '12px 0 14px 0',
  verticalAlign: 'top',
});

export const FamilyServiceItem = css({
  position: 'relative',
  display: 'inline-block',
  fontSize: 0,
  padding: '0 2px',
  '&:first-child': {
    padding: '0 3px 0 0',
  },
  '&::before': {
    content: `''`,
    display: 'block',
    width: 1,
    height: 7,
    background: '#d1d5d9',
    position: 'absolute',
    left: -1,
    top: '50%',
    transform: 'translate3d(0, -50%, 0)',
  },
  '&:first-child::before': {
    display: 'none',
  },
});

export const FamilyServiceLink = css({
  display: 'inline-block',
  padding: 6,
});

export const RidibooksIcon = css({
  width: 65,
  height: 10,
  fill: '#b8bfc4',
});

export const RidiSelectIcon = css({
  width: 62,
  height: 10,
  fill: '#b8bfc4',
});

export const MyMenuWrapper = css({
  padding: '7px 10px 7px 0',
  position: 'relative',
});

export const MyMenuToggleButton = css({
  padding: '6px 10px',
});

export const MyMenuIcon = css({
  width: 20,
  height: 20,
  fill: '#808991',
});
