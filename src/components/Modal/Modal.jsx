/** @jsx jsx */
import { jsx } from '@emotion/core';
import * as modalStyles from './styles';
import { ModalBackground } from './ModalBackground';

export const Modal = ({ a11y, isActive, children, style, onClickModalBackground, horizontalAlign }) => (
  <>
    <section css={[modalStyles.modal(isActive, horizontalAlign), style]}>
      {a11y && <h2 className="a11y">{a11y}</h2>}
      {children}
    </section>
    <ModalBackground isActive={isActive} onClickModalBackground={onClickModalBackground} />
  </>
);
