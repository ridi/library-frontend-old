import { css } from '@emotion/core';
import { MQ, Responsive } from '../../styles/responsive';

export const responsiveMetaStyles = (smallSizeStyles, mediumSizeStyles, largeSizeStyles) => `
  ${MQ([Responsive.XSmall, Responsive.Small], smallSizeStyles)}
  ${MQ([Responsive.Medium, Responsive.Large, Responsive.Full], mediumSizeStyles)}
  ${MQ([Responsive.XLarge, Responsive.XXLarge], largeSizeStyles)}
`;

const responsiveNamePadding = responsiveMetaStyles(
  `
    padding: 8px 7px;
    font-size: 15px;
  `,
  `
    padding: 7px;
    font-size: 15px;
  `,
  `
    padding: 14px 11px;
    font-size: 17px;
  `,
);

const ResponsiveCountWrapper = responsiveMetaStyles(
  `
    padding: 8px 7px 11px 7px;
    font-size: 15px;
  `,
  `
    padding: 14px 7px 11px 7px;
    font-size: 15px;
  `,
  `
    padding: 10px 11px 15px 11px;
    font-size: 17px;
  `,
);

const WrapperBorderRadius = 4;
const WrapperBorderWidth = 1;
const InnerBorderRadius = WrapperBorderRadius - WrapperBorderWidth;

export const shelfStyles = {
  wrapper: css`
    border: ${WrapperBorderWidth}px solid #d1d5d9;
    border-radius: ${WrapperBorderRadius}px;
    background: white;
    position: relative;
    box-sizing: border-box;
    width: inherit;
    min-height: inherit;
    transition: transform ease 0.3s, box-shadow ease 0.3s;
    transform: translate3d(0, 0, 0);
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);

    &:hover {
      transform: translate3d(0, -4px, 0);
      box-shadow: 0 3px 8px 0 rgba(0, 0, 0, 0.05);
    }

    @media (hover: none) {
      &:hover {
        transform: translate3d(0, 0, 0);
        box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
      }
    }
  `,
  thumbnails: css`
    display: flex;
    flex-flow: row nowrap;
    background: #e6e8eb;
    border-bottom: 1px solid #d1d5d9;
    border-radius: ${InnerBorderRadius}px ${InnerBorderRadius}px 0 0;
    overflow: hidden;
  `,
  thumbnail: css`
    background: #e6e8eb;
    border-left: 1px solid #d1d5d9;
    flex: 1;
    line-height: 0;

    &:first-of-type {
      border-left: 0;
    }
  `,
  thumbnailImage: css`
    position: relative;
    width: 100%;
  `,
  image: css`
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
  `,
  infoWrapper: css`
    background: white;
    border-radius: 0 0 ${InnerBorderRadius}px ${InnerBorderRadius}px;
  `,
  namePadding: css`
    ${responsiveNamePadding}
  `,
  name: css`
    font-weight: bold;
    color: #40474d;
    line-height: 1.2em;
    font-size: inherit;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,
  countWrapper: css`
    ${ResponsiveCountWrapper}
  `,
  count: css`
    min-width: 14px;
    text-align: center;
    position: relative;
    display: inline-block;
    padding: 0 7px;
    border: solid 1px #d1d5d9;
    border-radius: 30px;
    height: 20px;
    line-height: 20px;
    font-size: 12px;
    font-weight: 600;
    color: #b8bfc4;
  `,
  link: css`
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  `,
  selectWrapper: css`
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border-radius: 3px;
    background-color: rgba(0, 0, 0, 0.4);
  `,
  selectLabel: css`
    display: block;
    width: 100%;
    height: 100%;
    cursor: pointer;

    input {
      width: 0;
      height: 0;
    }
  `,
  selectIconWrapper: css`
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    width: 40px;
    height: 40px;
    border: 2px solid rgba(0, 0, 0, 0.3);
    border-radius: 40px;
    overflow: hidden;
  `,
  selectIcon: css`
    fill: white;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);

    &.active {
      background: rgb(31, 140, 230);
    }
  `,
};
