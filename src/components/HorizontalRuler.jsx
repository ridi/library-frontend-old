/** @jsx jsx */
import { jsx } from '@emotion/core';

const style = backgroundColor => ({
  height: 1,
  backgroundColor: backgroundColor || '#f3f4f5',
});

const HorizontalRuler = ({ color }) => <div css={style(color)} />;

export default HorizontalRuler;
