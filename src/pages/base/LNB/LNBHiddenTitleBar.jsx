import React from 'react';
import Link from 'next/link';
import { css } from 'emotion';
import { Icon } from '@ridi/rsg';
import Responsive from '../Responsive';
import IconButton from '../../../components/IconButton';

const styles = {
  LNBHiddenTitleBarWrapper: css({
    height: 46,
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 10px 0 rgba(0, 0, 0, 0.04)',
    boxSizing: 'border-box',
    borderBottom: '1px solid #d1d5d9',
  }),

  LNBHiddenTitleBar: css({
    display: 'flex',
    alignItems: 'center',
    height: 46,
  }),

  LNBHiddenTitleBarBackIconWrapper: css({
    padding: '5px 10px 5px 0',
    height: 20,
  }),
  LNBHiddenTitleBarBackIcon: css({
    width: 20,
    height: 20,
    '.RSGIcon': {
      width: 16,
      height: 16,
    },
  }),

  LNBHiddenTitleBarTitleWrapper: css({
    height: 30,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  }),
  LNBHiddenTitleBarTitle: css({
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: -0.3,
    color: '#40474d',
  }),

  LNBHiddenTitleBarHiddenCount: css({
    paddingLeft: 6,
    fontSize: 15,
    fontweight: 'bold',
    letterSpacing: -0.3,
    color: '#808991',
  }),

  LNBHiddenTitleBarToolsWrapper: css({}),
  LNBHiddenTitleBarTool: css({
    margin: '3px 0',
    width: 24,
    height: 24,
    marginRight: 16,
    '&:last-of-type': {
      marginRight: 0,
    },
    '.RSGIcon': {
      width: 20,
      height: 20,
      fill: '#40474d',
    },
  }),
};

const LNBHiddenTitleBar = ({ title, hiddenTotalCount, href, as, a11y = '뒤로가기', onClickEditingMode }) => (
  <nav className={styles.LNBHiddenTitleBarWrapper}>
    <Responsive className={styles.LNBHiddenTitleBar}>
      <Link href={href} as={as}>
        <a className={styles.LNBHiddenTitleBarBackIconWrapper}>
          <Icon name="arrow_3_left" className={styles.LNBHiddenTitleBarBackIcon} />
          <span className="a11y">{a11y}</span>
        </a>
      </Link>
      <div className={styles.LNBHiddenTitleBarTitleWrapper}>
        <span className={styles.LNBHiddenTitleBarTitle}>{title}</span>
        <span className={styles.LNBHiddenTitleBarHiddenCount}>{hiddenTotalCount}</span>
      </div>
      <div className={styles.LNBHiddenTitleBarToolsWrapper}>
        <IconButton icon="check_3" a11y="편집" className={styles.LNBHiddenTitleBarTool} onClick={onClickEditingMode} />
      </div>
    </Responsive>
  </nav>
);

export default LNBHiddenTitleBar;
