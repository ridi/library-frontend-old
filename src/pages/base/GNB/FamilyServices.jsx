import React from 'react';
import config from '../../../config';
import { Hidden } from '../../../styles';
import LogoRidibooks from '../../../svgs/LogoRidibooks.svg';
import LogoRidiselect from '../../../svgs/LogoRidiselect.svg';
import * as styles from './styles';

const FamilyServices = () => (
  <ul css={styles.familyServiceList}>
    <li css={styles.familyServiceItem}>
      <a css={styles.familyServiceLink} href={config.STORE_BASE_URL}>
        <LogoRidibooks css={styles.ridibooksIcon} />
        <span css={Hidden}>RIDIBOOKS</span>
      </a>
    </li>
    <li css={[styles.familyServiceItem, styles.familyServiceItemSeparator]}>
      <a css={styles.familyServiceLink} href={config.SELECT_BASE_URL}>
        <LogoRidiselect css={styles.ridiSelectIcon} />
        <span css={Hidden}>RIDI Select</span>
      </a>
    </li>
  </ul>
);

export default React.memo(FamilyServices);
