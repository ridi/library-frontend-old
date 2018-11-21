import { css } from 'emotion';

export const TabBar = css`
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 40px;

  background-color: #ffffff;
`;
export const TabItemWrapper = css`
  float: left;
  margin: 0 5px;
  padding: 0 5px;

  height: 100%;
`;

export const TabItem = css`
  margin: 0px 16px;
  padding: 8px;
  height: 100%;

  color: #808991;
  font-size: 16px;
  letter-spacing: -0.3px;
  text-align: center;

  box-sizing: border-box;
  border: 0;
`;

export const TabItemActive = css`
  color: #40474d;
  font-weight: bolder;
  border-bottom: 3px solid #9ea7ad;
`;
