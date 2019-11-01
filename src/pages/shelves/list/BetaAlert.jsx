import { css } from '@emotion/core';
import { PageAlert } from '../../../components/PageAlert';
import { responsiveStylesWidth } from '../../../components/ShelvesWrapper/styles';
import config from '../../../config';
import { MQ, Responsive } from '../../../styles/responsive';

const styles = {
  alertWrapper: css`
    margin-top: 20px;
    ${MQ([Responsive.XSmall, Responsive.Small], 'margin-top: 16px;')}
  `,
};

export const BetaAlert = () => (
  <div css={[responsiveStylesWidth, styles.alertWrapper]}>
    <PageAlert alertMessage="책장 서비스는 BETA 운영중입니다." linkURL={`${config.HELP_BASE_URL}articles/360034317733`} />
  </div>
);
