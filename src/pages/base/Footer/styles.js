import { css } from '@emotion/core';
import { maxWidthWrapper } from '../../../styles';

export const FOOTER_HEIGHT = 254;

export const Footer = css({
  height: FOOTER_HEIGHT,
  boxSizing: 'border-box',
  padding: '40px 0 0 0',
  textAlign: 'center',
  background: 'white',
});

export const ContentsWrapper = css({
  ...maxWidthWrapper,
});

export const HeadlineItem = css({
  position: 'relative',
  display: 'inline-block',
  padding: '0 7px 0 8px',
  '&::before': {
    content: `''`,
    display: 'block',
    position: 'absolute',
    left: -1,
    top: '50%',
    transform: 'translate3d(0, -50%, 0)',
    width: 3,
    height: 3,
    borderRadius: 3,
    background: '#b8bfc4',
  },
  '&:first-child::before': {
    display: 'none',
  },
});

export const HeadlineLink = css({
  fontSize: 15,
  fontWeight: 900,
  color: '#40474d',
});

export const RidibooksLogoIcon = css({
  width: 16,
  height: 16,
  fill: '#1f8ce6',
  margin: '1px 6px 0 0',
  verticalAlign: 'top',
});

export const BizInfoList = css({
  marginTop: 16,
});

export const InfoItem = css({
  fontSize: 11,
  lineHeight: '17px',
  color: '#9ea7ad',
  '.CompanyInfoList & ': {
    display: 'inline-block',
  },
});

export const TermsList = css({
  marginTop: 20,
  fontSize: 0,
});

export const TermsItem = css({
  position: 'relative',
  display: 'inline-block',
  padding: '0 4px 0 5px',
  fontSize: 0,
  '&::before': {
    content: `''`,
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translate3d(0, -50%, 0)',
    width: 1,
    height: 10,
    background: '#e6e8eb',
  },
  '&:first-child::before': {
    display: 'none',
  },
});

export const TermLink = css({
  display: 'block',
  fontSize: 11,
  height: 12,
  lineHeight: '12px',
  color: '#808991',
});

export const Copyright = css({
  marginTop: 20,
  color: '#9ea7ad',
  fontSize: 14,
  height: 17,
  lineHeight: '17px',
});
