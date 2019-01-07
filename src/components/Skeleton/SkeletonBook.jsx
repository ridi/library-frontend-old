import React from 'react';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { Responsive } from '../../styles/responsive';

const skeletonBookStyle = css({
  backgroundImage: 'linear-gradient(147deg, #f8f9fb, #f1f1f3 55%, #f8f9fb)',
  width: 110,
  height: 168,

  ...Responsive.W360({
    width: 98,
    height: 151,
  }),
});

const SkeletonBook = () => <div css={skeletonBookStyle} />;

export default SkeletonBook;
