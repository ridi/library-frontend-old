/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import ArrowLeft from '../../../../svgs/ArrowLeft.svg';
import Responsive from '../../../base/Responsive';

const navigationBarStyles = {
  wrapper: css`
    background-color: #0077d9;
    width: 100%;
  `,
  bar: css`
    height: 46px;
    display: flex;
    align-items: center;
  `,
  iconWrapper: css`
    display: block;
    padding: 13px 10px 13px 0;
  `,
  icon: css`
    width: 16px;
    height: 16px;
    fill: white;
  `,
  title: css`
    font-size: 16px;
    font-weight: bold;
    color: white;
    height: 30px;
    line-height: 30px;
  `,
};

export default function NavigationBar({ shelfTitle, onBackClick }) {
  return (
    <Responsive css={navigationBarStyles.wrapper}>
      <div css={navigationBarStyles.bar}>
        <button type="button" css={navigationBarStyles.iconWrapper} onClick={onBackClick}>
          <ArrowLeft css={navigationBarStyles.icon} />
          <span className="a11y">뒤로 가기</span>
        </button>
        <h2 css={navigationBarStyles.title}>‘{shelfTitle}’에 추가</h2>
      </div>
    </Responsive>
  );
}
