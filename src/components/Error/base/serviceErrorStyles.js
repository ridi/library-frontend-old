import { css } from '@emotion/core';

const styles = {
  pageError: css`
    text-align: center;
    padding: 60px 0;
  `,

  errorTitle: css`
    margin: 8px 0;
    font-size: 60px;
    color: #303538;
  `,

  errorDescription: css`
    margin: 20px 0;
    font-size: 18px;
    line-height: 1.6em;
    color: #525a61;
  `,

  errorButtonWrapper: css`
    display: inline-block;
    margin-top: 36px;
  `,

  errorButton: css`
    display: inline-block;
    width: 140px;
    padding: 14px 0;
    margin: 0 2px;
    font-size: 16px;
    font-weight: 700;
    text-align: center;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
    outline: none;
    box-sizing: border-box;
    border-radius: 4px;
    appearance: none;
  `,

  whiteButton: css`
    color: #808991;
    background: #fff;
    border: 1px solid #d1d5d9;
    box-shadow: 0 1px 1px 0 rgba(209, 213, 217, 0.3);
  `,

  grayButton: css`
    color: #fff;
    background: #808991;
    border: 1px solid #798086;
    box-shadow: 0 1px 1px 0 rgba(209, 213, 217, 0.3);
  `,

  icon: css`
    width: 94px;
    height: 79px;
    fill: #d1d5d9;
  `,
};
export default styles;
