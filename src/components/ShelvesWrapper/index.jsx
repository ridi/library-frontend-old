/** @jsx jsx */
import { jsx } from '@emotion/core';
import { responsiveStyles } from './styles';

export const ShelvesWrapper = ({ children }) => <div css={responsiveStyles}>{children}</div>;
