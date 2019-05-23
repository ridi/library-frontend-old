import { css } from '@emotion/core';
import { MQ, Responsive } from '../../../styles/responsive';

const responsiveWrapper = `
  ${MQ(
    [Responsive.XSmall],
    `
      width: 136px;
    `,
  )}
  ${MQ(
    [Responsive.Small, Responsive.Medium],
    `
      width: 156px;
    `,
  )}
  ${MQ(
    [Responsive.Large, Responsive.XLarge, Responsive.XXLarge, Responsive.Full],
    `
      width: 220px;
    `,
  )}
`;

const responsiveNameWrapper = `
  ${MQ(
    [Responsive.XSmall, Responsive.Small, Responsive.Medium, Responsive.Large],
    `
      padding: 8px 7px;
      font-size: 15px;
    `,
  )}
  ${MQ(
    [Responsive.XLarge, Responsive.XXLarge, Responsive.Full],
    `
      padding: 14px 11px;
      font-size: 17px;
    `,
  )}
`;

const ResponsiveCountWrapper = `
  ${MQ(
    [Responsive.XSmall, Responsive.Small, Responsive.Medium, Responsive.Large],
    `
      padding: 1px 7px 11px 7px;
      font-size: 15px;
    `,
  )}
  ${MQ(
    [Responsive.XLarge, Responsive.XXLarge, Responsive.Full],
    `
      padding: 10px 11px 15px 11px;
      font-size: 17px;
    `,
  )}
`;

const ResponsiveEditWrapper = `
  ${MQ(
    [Responsive.XSmall, Responsive.Small, Responsive.Medium, Responsive.Large],
    `
      right: 5px;
      bottom: 9px;
    `,
  )}
  ${MQ(
    [Responsive.XLarge, Responsive.XXLarge, Responsive.Full],
    `
      right: 9px;
      bottom: 13px;
    `,
  )}
`;

export const shelfStyles = {
  wrapper: css`
    border: 1px solid #d1d5d9;
    border-radius: 4px;
    background: white;
    position: relative;
    ${responsiveWrapper}
  `,
  thumbnails: css`
    display: flex;
    flex-flow: row nowrap;
    border-bottom: 1px solid #d1d5d9;
  `,
  thumbnail: css`
    background: #e6e8eb;
    border-left: 1px solid #d1d5d9;
    flex: 1;
    &:first-child {
      border-left: 0;
    }
    img {
      width: 100%;
      height: 100%;
    }
  `,
  infoWrapper: css`
    background: white;
  `,
  nameWrapper: css`
    ${responsiveNameWrapper}
  `,
  name: css`
    font-weight: bold;
    color: #40474d;
    line-height: 1.2em;
    font-size: inherit;

    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  `,
  countWrapper: css`
    ${ResponsiveCountWrapper}
  `,
  count: css`
    position: relative;
    display: inline-block;
    padding: 0 14px 0 10px;
    border: solid 1px #808991;
    border-radius: 30px;
    height: 20px;
    line-height: 20px;
    font-size: 12px;
    font-weight: 600;
    color: #808991;
  `,
  countArrowIcon: css`
    display: block;
    position: absolute;
    right: 6px;
    top: 50%;
    margin-top: -3px;
    width: 3px;
    height: 6px;
    fill: #808991;
  `,
  link: css`
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  `,
  editWrapper: css`
    position: absolute;
    right: -2px;
    bottom: -2px;
    ${ResponsiveEditWrapper}
  `,
  editButton: css`
    width: 22px;
    height: 22px;
    border-radius: 2px;
    .active & {
      background-color: #f2f4f5;
    }
  `,
  editButtonIcon: css`
    width: 3px;
    height: 13px;
    fill: #9ea7ad;
  `,
  editModalWrapper: css`
    position: absolute;
    right: -8px;
    top: 26px;
    overflow: hidden;
    max-height: 0;
    .active & {
      max-height: 100px;
      overflow: inherit;
    }
  `,
  editModal: css`
    padding: 4px 0;
    width: 140px;
    border-radius: 4px;
    box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.28), 0 0 0 0.5px rgba(0, 0, 0, 0.05);
    background: rgba(255, 255, 255, 0.98);
  `,
  editModalButton: css`
    width: 100%;
    box-sizing: border-box;
    padding: 12px;
    font-size: 15px;
    line-height: 19px;
    color: #40474d;
    text-align: left;
    &:hover {
      background: #f3f4f5;
    }
  `,
};
