/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { PageAlert } from '../../../components/PageAlert';
import { responsiveStyles } from '../../../components/ShelvesWrapper/styles';

const styles = {
  alertWrapper: css`
    padding: 0 !important;
    margin-top: 16px;
  `,
};

export const BetaAlert = () => (
  <div css={[responsiveStyles, styles.alertWrapper]}>
    <PageAlert alertMessage="책장 서비스는 BETA 운영중입니다." />
  </div>
);
