/** @jsx jsx */
import { jsx } from '@emotion/core';
import * as modalStyles from './styles';

export const Modal = ({ a11y, isActive, children, style }) => (
  <section css={[modalStyles.modal(isActive), style]}>
    {a11y && <h2 className="a11y">{a11y}</h2>}
    {children}
  </section>
);
