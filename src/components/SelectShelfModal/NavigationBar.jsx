/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import Responsive from '../../pages/base/Responsive';
import ArrowLeft from '../../svgs/ArrowLeft.svg';

const wrapper = css`
  background-color: #0077d9;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.04);
  width: 100%;
`;

const bar = css`
  height: 46px;
  display: flex;
  align-items: center;
`;

const iconWrapper = css`
  display: block;
  padding: 13px 10px 13px 0;
`;

const icon = css`
  width: 16px;
  height: 16px;
  fill: white;
`;

const title = css`
  font-size: 16px;
  font-weight: bold;
  color: white;
  height: 30px;
  line-height: 30px;
`;

export default function NavigationBar({ onBackClick }) {
  return (
    <Responsive css={wrapper}>
      <div css={bar}>
        <button type="button" css={iconWrapper} onClick={onBackClick}>
          <ArrowLeft css={icon} />
          <span className="a11y">뒤로 가기</span>
        </button>
        <h2 css={title}>책장 선택</h2>
      </div>
    </Responsive>
  );
}
