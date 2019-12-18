import { css } from '@emotion/core';
import React from 'react';

const filler = css`
  height: 300vh;
`;

export default function Filler() {
  return <div css={filler} />;
}
