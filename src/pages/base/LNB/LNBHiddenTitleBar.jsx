import React from 'react';
import Link from 'next/link';
import { Icon } from '@ridi/rsg';
import * as styles from './styles';
import Responsive from '../Responsive';
import IconButton from '../../../components/IconButton';

const LNBHiddenTitleBar = ({ title, hiddenTotalCount, href, as, a11y = '뒤로가기', onClickEditingMode }) => (
  <nav className={styles.LNBTitleBarWrapper}>
    <Responsive className={styles.LNBTitleBar}>
      <Link href={href} as={as}>
        <a className={styles.LNBTitleBarBackIconWrapper}>
          <Icon name="arrow_3_left" className={styles.LNBTitleBarBackIcon} />
          <span className="a11y">{a11y}</span>
        </a>
      </Link>
      <div className={styles.LNBTitleBarTitleWrapper}>
        <span className={styles.LNBTitleBarTitle}>{title}</span>
        <span className={styles.LNBHiddenTitleBarHiddenCount}>{hiddenTotalCount}</span>
      </div>
      <div className={styles.LNBHiddenTitleBarToolsWrapper}>
        <IconButton icon="check_3" a11y="편집" className={styles.LNBHiddenTitleBarTool} onClick={onClickEditingMode} />
      </div>
    </Responsive>
  </nav>
);

export default LNBHiddenTitleBar;
