import { css } from '@emotion/core';
import { MQ, Responsive } from '../../styles/responsive';

const wrapperAndShelvesStyles = (shelfSize, countPerLine, shelfSpacing, wrapperSpacing) => {
  const { shelfWidth, shelfMinHeight, thumbnailHeight } = shelfSize;
  return `
    padding: ${wrapperSpacing}px 0 ${wrapperSpacing - shelfSpacing}px 0;
    max-width: ${shelfWidth * countPerLine + shelfSpacing * (countPerLine - 1)}px;
    .shelf {
      width: ${shelfWidth}px;
      min-height: ${shelfMinHeight}px;
      padding-left: ${shelfSpacing}px;
      padding-bottom: ${shelfSpacing}px;
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
  shelfMinHeight: 140,
  thumbnailHeight: 69,
};
const LargeShelfSize = {
  shelfWidth: 220,
  shelfMinHeight: 197,
  thumbnailHeight: 99,
};

export const responsiveWrapper = `
  ${MQ([Responsive.XSmall], wrapperAndShelvesStyles(SmallShelfSize, 2, 16, 16))}
  ${MQ([Responsive.Small], wrapperAndShelvesStyles(MediumShelfSize, 2, 16, 16))}
  ${MQ([Responsive.Medium], wrapperAndShelvesStyles(MediumShelfSize, 2, 24, 24))}
  ${MQ([Responsive.Large], wrapperAndShelvesStyles(MediumShelfSize, 3, 24, 24))}
  ${MQ([Responsive.XLarge], wrapperAndShelvesStyles(LargeShelfSize, 3, 24, 40))}
  ${MQ([Responsive.XXLarge], wrapperAndShelvesStyles(LargeShelfSize, 4, 24, 40))}
  ${MQ([Responsive.Full], wrapperAndShelvesStyles(LargeShelfSize, 4, 40, 40))}
`;

export const responsiveStyles = css`
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  ${responsiveWrapper}
`;
