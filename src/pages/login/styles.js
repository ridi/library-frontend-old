import { css } from '@emotion/core';

export const fixedStyle = css`
  border-top: 1px solid #d1d5d9;
  width: 100%;
  min-height: 350px;
  padding-top: 46px;
`;

export const mainStyle = css`
  position: absolute;
  left: 50%;
  top: 50%;
  width: 360px;
  margin-top: -200px;
  margin-left: -180px;
  text-align: center;
`;

export const messageStyle = css`
  width: 100%;
  line-height: 1.5em;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  color: #40474d;
  margin-bottom: 16px;
`;

export const defaultButtonStyle = `
  margin-top: 8px;
  width: 300px;
  display: inline-block;
  line-height: 50px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  box-sizing: border-box;
`;

const buttonStyles = styles => {
  const { boxShadowColor, backgroundColor, borderColor, borderWeight, fontColor } = styles;
  return css`
    margin-top: 8px;
    width: 300px;
    display: inline-block;
    line-height: 50px;
    border-radius: 4px;
    font-size: 16px;
    font-weight: bold;
    box-sizing: border-box;
    box-shadow: 1px 1px 1px 0 ${boxShadowColor};
    background-color: ${backgroundColor};
    border: ${borderWeight} solid ${borderColor};
    color: ${fontColor};
  `;
};

export const loginButtonStyle = buttonStyles({
  boxShadowColor: 'rgba(31, 140, 230, 0.3)',
  backgroundColor: '#1f8ce6',
  borderColor: '#0077d9',
  borderWeight: '1px',
  fontColor: 'white',
});

export const signupButtonStyle = buttonStyles({
  boxShadowColor: 'rgba(209, 213, 217, 0.3)',
  backgroundColor: 'white',
  borderColor: '#d1d5d9',
  borderWeight: '2px',
  fontColor: '#808991',
});
