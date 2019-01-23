/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import FlexBar from '../FlexBar';
import Title from './Title';
import Tool from '../Tool';

const style = css({
  backgroundColor: '#ffffff',
  marginTop: 1,
});

const TitleBar = ({ title, showCount, totalCount, href, as, query, edit, toggleEditingMode }) => (
  <div css={style}>
    <FlexBar
      renderFlexLeft={() => <Title title={title} showCount={showCount} totalCount={totalCount} href={href} as={as} query={query} />}
      renderFlexRight={() => <Tool edit={edit} toggleEditingMode={toggleEditingMode} />}
    />
  </div>
);

export default TitleBar;
