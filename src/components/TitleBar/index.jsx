/** @jsx jsx */
import { jsx } from '@emotion/core';
import FlexBar from '../FlexBar';
import Title from './Title';
import Tool from '../Tool';

const titleBar = {
  backgroundColor: '#ffffff',
  marginTop: 1,

  borderBottom: '1px solid #d1d5d9',
  boxShadow: '0 2px 10px 0 rgba(0, 0, 0, .04)',
};

const TitleBar = ({ title, showCount, totalCount, href, as, query, edit, toggleEditingMode }) => (
  <FlexBar
    css={titleBar}
    renderFlexLeft={() => <Title title={title} showCount={showCount} totalCount={totalCount} href={href} as={as} query={query} />}
    renderFlexRight={() => <Tool edit={edit} toggleEditingMode={toggleEditingMode} />}
  />
);

export default TitleBar;
