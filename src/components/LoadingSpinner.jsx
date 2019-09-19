/** @jsx jsx */
import { css, jsx, keyframes } from '@emotion/core';
import Loading from '../svgs/Loading.svg';

const spinAnimation = keyframes`
  from {
    transform: rotate(0turn);
  }
  to {
    transform: rotate(-1turn);
  }
`;

const loading = css`
  fill: #808991;
  animation: ${spinAnimation} 1s steps(12, end) infinite;
`;

export default function LoadingSpinner(props) {
  const { className } = props;
  return <Loading css={loading} className={className} />;
}
