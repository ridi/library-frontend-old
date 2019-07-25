/** @jsx jsx */
import { jsx } from '@emotion/core';
import AlertIcon from '../../svgs/ExclamationCircleFill.svg';
import * as alertStyles from './styles';

export const InlineAlert = ({ message, styles }) => (
  <div css={[alertStyles.alertWrapper, styles]}>
    <p css={alertStyles.alertMessage}>
      <AlertIcon css={alertStyles.alertIcon} />
      {message}
    </p>
  </div>
);
