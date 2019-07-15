import { css } from '@emotion/core';
import { MQ, Responsive } from '../../styles/responsive';

const wrapperAndShelvesStyles = (shelfSize, countPerLine, shelfSpacing, wrapperSpacing) => {
  const { shelfWidth, shelfMinHeight, thumbnailHeight } = shelfSize;
  let shelfRowSpacing;
  let shelfColumnSpacing;
  if (typeof shelfSpacing === 'number') {
    shelfRowSpacing = shelfSpacing;
    shelfColumnSpacing = shelfSpacing;
  } else {
    shelfRowSpacing = shelfSpacing.row;
    shelfColumnSpacing = shelfSpacing.column;
  }
  return `
    padding: ${wrapperSpacing}px 0 ${wrapperSpacing - shelfRowSpacing}px 0;
    max-width: ${shelfWidth * countPerLine + shelfColumnSpacing * (countPerLine - 1)}px;
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

export const responsiveWrapper = `
  ${MQ([Responsive.XSmall], wrapperAndShelvesStyles(SmallShelfSize, 2, 16, 16))}
  ${MQ([Responsive.Small], wrapperAndShelvesStyles(MediumShelfSize, 2, 16, 16))}
  ${MQ([Responsive.Medium], wrapperAndShelvesStyles(LargeShelfSize, 2, 20, 24))}
  ${MQ([Responsive.Large], wrapperAndShelvesStyles(LargeShelfSize, 3, 20, 24))}
  ${MQ([Responsive.XLarge], wrapperAndShelvesStyles(XLargeShelfSize, 3, 24, 40))}
  ${MQ([Responsive.XXLarge], wrapperAndShelvesStyles(XLargeShelfSize, 4, 24, 40))}
  ${MQ([Responsive.Full], wrapperAndShelvesStyles(XLargeShelfSize, 5, { row: 40, column: 24 }, 40))}
`;

export const responsiveStyles = css`
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  ${responsiveWrapper}
`;
