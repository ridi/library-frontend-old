import React from 'react';
import Link from 'next/link';
import { Icon } from '@ridi/rsg';
import * as style from './styles';
import Responsive from '../Responsive';
import IconButton from '../../../components/IconButton';

const LNBHiddenTitleBar = ({ title, hiddenTotalCount, href, as, a11y = '뒤로가기', onClickEditingMode }) => (
  <nav className={style.LNBTitleBarWrapper}>
    <Responsive className={style.LNBTitleBar}>
      <Link href={href} as={as}>
        <a className={style.LNBTitleBarBackIconWrapper}>
          <Icon name="arrow_3_left" className={style.LNBTitleBarBackIcon} />
          <span className="a11y">{a11y}</span>
        </a>
      </Link>
      <div className={style.LNBTitleBarTitleWrapper}>
        <span className={style.LNBTitleBarTitle}>{title}</span>
        <span className={style.LNBHiddenTitleBarHiddenCount}>{hiddenTotalCount}</span>
      </div>
      <div className={style.LNBHiddenTitleBarToolsWrapper}>
        <IconButton icon="check_3" a11y="편집" className={style.LNBHiddenTitleBarTool} onClick={onClickEditingMode} />
      </div>
    </Responsive>
  </nav>
);

export default LNBHiddenTitleBar;
