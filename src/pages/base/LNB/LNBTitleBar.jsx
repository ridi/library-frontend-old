/** @jsx jsx */
import { jsx } from '@emotion/core';
import Link from 'next/link';
import { Icon } from '@ridi/rsg';
import { makeLinkProps } from '../../../utils/uri';
import Responsive from '../Responsive';
import IconButton from '../../../components/IconButton';
import Edit from '../../../svgs/Edit.svg';
import * as styles from './styles';

const LNBTitleBar = ({ title, totalCount, href, as, query, a11y = '뒤로가기', onClickEditingMode }) => (
  <Responsive css={styles.LNBHiddenTitleBarWrapper}>
    <nav css={styles.LNBHiddenTitleBar}>
      <Link {...makeLinkProps(href, as, query)}>
        <a>
          <div css={styles.LNBHiddenTitleBarBackIconWrapper}>
            <Icon name="arrow_13_left" css={styles.LNBHiddenTitleBarBackIcon} />
            <span className="a11y">{a11y}</span>
          </div>
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
