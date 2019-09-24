import { css } from '@emotion/core';
import colors from '@ridi/colors';

export const global = css`
  body::after {
    background: white;
  }
`;

export const header = css`
  height: 50px;
  line-height: 50px;
  text-align: center;
  border-bottom: 1px solid rgb(214, 222, 235);
`;

export const logo = css`
  fill: rgb(31, 140, 230);
  width: 44px;
  height: 18px;
  vertical-align: middle;
`;

export const maintenance = css`
  max-width: 630px;
  margin: 0 auto;
  padding: 40px 0;
  font-size: 14px;
  line-height: 1.3em;
  color: ${colors.slateGray90};

  @media (max-width: 670px) {
    margin: 0 16px;
  }

  header {
    h1 {
      font-size: 24px;
      line-height: 1em;
      margin-bottom: 20px;
    }

    p {
      margin-bottom: 10px;
    }
  }

  section {
    margin: 20px 0 12px;
    padding: 12px 40px;
    border-radius: 4px;
    background-color: ${colors.slateGray5};
    color: ${colors.slateGray70};
    font-size: 13px;
    line-height: 1.5em;
    position: relative;

    svg {
      width: 18px;
      height: 18px;
      fill: ${colors.slateGray40};
      position: absolute;
      top: 12px;
      left: 16px;
    }

    dl {
      dt {
        font-weight: bold;
        margin: 14px 0 5px;

        &:first-of-type {
          margin-top: 0;
        }
      }

      dd {
        & > ul {
          & > li {
            margin-top: 8px;

            &:first-child {
              margin-top: 0;
            }

            & > ul > li {
              margin-top: 3px;
            }
          }
        }
      }
    }
  }

  ul li {
    list-style: none;
    padding-left: 15px;
    position: relative;
    &::before {
      content: '';
      width: 3px;
      height: 3px;
      border-radius: 50%;
      background: ${colors.slateGray50};
      display: inline-block;
      vertical-align: middle;
      position: absolute;
      top: 6px;
      left: 6px;
    }
  }

  footer {
    margin-top: 15px;
    line-height: 2em;
  }
`;
