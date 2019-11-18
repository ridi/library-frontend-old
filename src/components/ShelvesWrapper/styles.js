import { css } from '@emotion/core';

import { MQ, Responsive } from '../../styles/responsive';

const wrapperAndShelvesStyles = (shelfSize, countPerLine, shelfSpacing, wrapperSpacing) => {
  const { shelfWidth, shelfMinHeight, thumbnailHeight } = shelfSize;
  let shelfRowSpacing;
  let shelfColumnSpacing;
  let wrapperSpacingTop;
  let wrapperSpacingBottom;
  if (typeof shelfSpacing === 'number') {
    shelfRowSpacing = shelfSpacing;
    shelfColumnSpacing = shelfSpacing;
  } else {
    shelfRowSpacing = shelfSpacing.row;
    shelfColumnSpacing = shelfSpacing.column;
  }
  if (typeof wrapperSpacing === 'number') {
    wrapperSpacingTop = wrapperSpacing;
    wrapperSpacingBottom = wrapperSpacing;
  } else {
    wrapperSpacingTop = wrapperSpacing.top;
    wrapperSpacingBottom = wrapperSpacing.bottom;
  }
  const width = `max-width: ${shelfWidth * countPerLine + shelfColumnSpacing * (countPerLine - 1)}px;`;
  const padding = `
    padding: ${wrapperSpacingTop}px 0 ${wrapperSpacingBottom - shelfRowSpacing}px 0;
    .shelf {
      width: ${shelfWidth}px;
      min-height: ${shelfMinHeight}px;
      padding-left: ${shelfColumnSpacing}px;
      padding-bottom: ${shelfRowSpacing}px;
      &:nth-of-type(${countPerLine}n + 1) {
        padding-left: 0;
      }
      .thumbnailImage {
        height: ${thumbnailHeight}px;
      }
    }
  `;
  return { width, padding };
};

const SmallShelfSize = {
  shelfWidth: 136,
  shelfMinHeight: 130,
  thumbnailHeight: 60,
};
const MediumShelfSize = {
  shelfWidth: 156,
  shelfMinHeight: 148,
  thumbnailHeight: 69,
};
const LargeShelfSize = {
  shelfWidth: 170,
  shelfMinHeight: 160,
  thumbnailHeight: 78,
};
const XLargeShelfSize = {
  shelfWidth: 220,
  shelfMinHeight: 197,
  thumbnailHeight: 99,
};

const wrapperSpecs = [
  {
    width: [Responsive.XSmall],
    shelfSize: SmallShelfSize,
    countPerLine: 2,
    shelfSpacing: 16,
    wrapperSpacing: 16,
  },
  {
    width: [Responsive.Small],
    shelfSize: MediumShelfSize,
    countPerLine: 2,
    shelfSpacing: 16,
    wrapperSpacing: 16,
  },
  {
    width: [Responsive.Medium],
    shelfSize: LargeShelfSize,
    countPerLine: 2,
    shelfSpacing: 20,
    wrapperSpacing: { top: 20, bottom: 24 },
  },
  {
    width: [Responsive.Large],
    shelfSize: LargeShelfSize,
    countPerLine: 3,
    shelfSpacing: 20,
    wrapperSpacing: { top: 20, bottom: 24 },
  },
  {
    width: [Responsive.XLarge],
    shelfSize: XLargeShelfSize,
    countPerLine: 3,
    shelfSpacing: 24,
    wrapperSpacing: { top: 20, bottom: 40 },
  },
  {
    width: [Responsive.XXLarge],
    shelfSize: XLargeShelfSize,
    countPerLine: 4,
    shelfSpacing: 24,
    wrapperSpacing: { top: 20, bottom: 40 },
  },
  {
    width: [Responsive.Full],
    shelfSize: LargeShelfSize,
    countPerLine: 6,
    shelfSpacing: 32,
    wrapperSpacing: { top: 20, bottom: 40 },
  },
];

const responsiveWrapperWidth = wrapperSpecs
  .map(spec => MQ(spec.width, wrapperAndShelvesStyles(spec.shelfSize, spec.countPerLine, spec.shelfSpacing, spec.wrapperSpacing).width))
  .join('');
const responsiveWrapperPadding = wrapperSpecs
  .map(spec => MQ(spec.width, wrapperAndShelvesStyles(spec.shelfSize, spec.countPerLine, spec.shelfSpacing, spec.wrapperSpacing).padding))
  .join('');
export const responsiveWrapper = responsiveWrapperWidth + responsiveWrapperPadding;

export const responsiveStyles = css`
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  ${responsiveWrapperWidth}
  ${responsiveWrapperPadding}
`;

export const responsiveStylesWidth = css`
  margin: 0 auto;
  ${responsiveWrapperWidth}
`;
