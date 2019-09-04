/** @jsx jsx */
import { jsx } from '@emotion/core';
import AlertIcon from '../../svgs/ExclamationCircleFill.svg';
import Arrow from '../../svgs/NoneDashedArrowRight.svg';
import * as alertStyles from './styles';

export const PageAlert = ({ alertMessage, linkURL }) => (
  <article css={alertStyles.wrapper}>
    <AlertIcon css={alertStyles.alertIcon} />
    <p css={alertStyles.message}>
      {alertMessage}
      {linkURL && (
        <a css={alertStyles.link} href={linkURL}>
          자세히 보기
          <Arrow css={alertStyles.linkArrowIcon} />
        </a>
      )}
    </p>
  </article>
);
