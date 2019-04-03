import { css } from '@emotion/core';

export const global = css`
  body::after {
    background: white;
  }
`;

export const maintenance = css`
  text-align: center;
  padding: 82px 0;
`;
export const title = css`
  font-size: 26px;
  font-weight: 700;
  color: black;
  line-height: 1em;
`;
export const description = css`
  padding: 30px 20px;
  background: #eee;
  max-width: 560px;
  margin: 24px auto 0 auto;
`;
const descriptionTitle = `
  font-size: 20px;
  font-weight: 700;
  color: #333;
  line-height: 1em;
`;
export const termsTitle = css`
  ${descriptionTitle}
`;
export const serviceListTitle = css`
  ${descriptionTitle}
  margin-top: 30px;
`;
export const terms = css`
  margin-top: 10px;
  font-size: 14px;
  color: #666;
  line-height: 1.8em;
`;
export const unavailableServiceList = css`
  margin-top: 10px;
`;
export const service = css`
  font-size: 14px;
  color: #666;
  line-height: 1.8em;
`;
export const footer = css`
  margin-top: 16px;
  padding: 0 22px;
  font-size: 15px;
  color: #000;
  line-height: 1.8em;
`;
