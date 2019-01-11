/** @jsx jsx */
import { jsx } from '@emotion/core';
import * as modalStyles from './styles';

export const ModalItemGroup = ({ groupTitle, children, style }) => (
  <div css={[modalStyles.itemGroup, style]}>
    {groupTitle && <p css={modalStyles.groupTitle}>{groupTitle}</p>}
    {children}
  </div>
);
