/** @jsx jsx */
import { jsx } from '@emotion/core';
import AlertIcon from '../../svgs/ExclamationCircleFill.svg';
import * as alertStyles from './styles';

export const PageAlert = ({ alertMessage }) => (
  <article css={alertStyles.wrapper}>
    <AlertIcon css={alertStyles.icon} />
    <p css={alertStyles.message}>{alertMessage}</p>
  </article>
);
