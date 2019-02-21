/** @jsx jsx */
import { jsx } from '@emotion/core';
import FlexBar from '../FlexBar';
import * as styles from '../SearchBar/styles';
import Editing from '../Tool/Editing';
import More from '../Tool/More';
import Title from './Title';

const titleBar = {
  backgroundColor: '#ffffff',
  borderTop: '1px solid #f3f4f5',
  borderBottom: '1px solid #d1d5d9',
  boxShadow: '0 2px 10px 0 rgba(0, 0, 0, .04)',
};

const TitleBar = ({ title, showCount, totalCount, href, as, query, showTools, toggleEditingMode }) => (
  <FlexBar
    css={titleBar}
    renderFlexLeft={() => <Title title={title} showCount={showCount} totalCount={totalCount} href={href} as={as} query={query} />}
    renderFlexRight={() =>
      showTools ? (
        <div css={styles.toolsWrapper}>
          {<Editing toggleEditingMode={toggleEditingMode} />}
          {<More showViewType />}
        </div>
      ) : null
    }
  />
);

export default TitleBar;
