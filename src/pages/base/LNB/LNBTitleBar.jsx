/** @jsx jsx */
import { jsx } from '@emotion/core';
import Link from 'next/link';
import { Icon } from '@ridi/rsg';
import Responsive from '../Responsive';
import IconButton from '../../../components/IconButton';
import Edit from '../../../svgs/Edit.svg';
import * as styles from './styles';

const LNBTitleBar = ({ title, totalCount, href, as, a11y = '뒤로가기', onClickEditingMode }) => (
  <Responsive css={styles.LNBHiddenTitleBarWrapper}>
    <nav css={styles.LNBHiddenTitleBar}>
      <Link href={href} as={as}>
        <a css={styles.LNBHiddenTitleBarBackIconWrapper}>
          <Icon name="arrow_13_left" css={styles.LNBHiddenTitleBarBackIcon} />
          <span className="a11y">{a11y}</span>
        </a>
      </Link>
      <div css={styles.LNBHiddenTitleBarTitleWrapper}>
        <span css={styles.LNBHiddenTitleBarTitle}>{title}</span>
        <span css={styles.LNBHiddenTitleBarHiddenCount}>{totalCount}</span>
      </div>
      <div>
        <IconButton a11y="편집" css={styles.LNBHiddenTitleBarTool} onClick={onClickEditingMode}>
          <Edit css={styles.editIcon} />
        </IconButton>
      </div>
    </nav>
  </Responsive>
);

export default LNBTitleBar;
