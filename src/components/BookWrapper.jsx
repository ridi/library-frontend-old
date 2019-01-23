/** @jsx jsx */
import { jsx } from '@emotion/core';
import { portraitBookWrapperStyle, landscapeBookWrapperStyle } from '../styles/bookLayout';

export const PortraitBookWrapper = ({ children }) => <div css={portraitBookWrapperStyle}>{children}</div>;
export const LandscapeBookWrapper = ({ children }) => <div css={landscapeBookWrapperStyle}>{children}</div>;
