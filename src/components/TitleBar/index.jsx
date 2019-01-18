/** @jsx jsx */
import { jsx } from '@emotion/core';
import FlexBar from '../FlexBar';
import Title from './Title';
import Tool from '../Tool';

const TitleBar = ({ title, totalCount, href, as, query, edit, toggleEditingMode }) => (
  <FlexBar
    renderFlexLeft={() => <Title title={title} totalCount={totalCount} href={href} as={as} query={query} />}
    renderFlexRight={() => <Tool edit={edit} toggleEditingMode={toggleEditingMode} />}
  />
);

export default TitleBar;
