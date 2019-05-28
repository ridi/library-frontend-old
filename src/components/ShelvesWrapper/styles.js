import { css } from '@emotion/core';
import { MQ, Responsive } from '../../styles/responsive';

const wrapperAndShelvesStyles = (shelfWidth, shelfMinHeight, countPerLine, shelfSpacing, wrapperSpacing) => `
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
  }
`;

export const responsiveWrapper = `
  ${MQ([Responsive.XSmall], wrapperAndShelvesStyles(136, 130, 2, 16, 16))}
  ${MQ([Responsive.Small], wrapperAndShelvesStyles(156, 140, 2, 16, 16))}
  ${MQ([Responsive.Medium], wrapperAndShelvesStyles(156, 140, 2, 24, 24))}
  ${MQ([Responsive.Large], wrapperAndShelvesStyles(156, 140, 3, 24, 24))}
  ${MQ([Responsive.XLarge], wrapperAndShelvesStyles(220, 197, 3, 24, 40))}
  ${MQ([Responsive.XXLarge], wrapperAndShelvesStyles(220, 197, 4, 24, 40))}
  ${MQ([Responsive.Full], wrapperAndShelvesStyles(220, 197, 4, 40, 40))}
`;

export const responsiveStyles = css`
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  ${responsiveWrapper}
`;
