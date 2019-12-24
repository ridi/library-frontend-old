import React from 'react';
import { css } from '@emotion/core';

const shelfStyle = css`
  width: 100%;
  height: 82px;
  background-image: linear-gradient(to top, #e6e8eb, #edeff2, #e6e8eb);
`;

const SkeletonSimpleShelf = () => <div css={shelfStyle} />;

export default SkeletonSimpleShelf;
