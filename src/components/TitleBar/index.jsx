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
  marginTop: -1,
};

const TitleBar = ({ backLocation, title, showCount, totalCount, query, showTools, toggleEditingMode }) => (
  <FlexBar
    css={titleBar}
    flexLeft={<Title title={title} showCount={showCount} totalCount={totalCount} to={backLocation} />}
    flexRight={
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
