/** @jsx jsx */
import { jsx } from '@emotion/core';
import LNBBar from '../LNBBar';
import Title from './Title';
import Tool from '../Tool';

const TitleBar = ({ title, totalCount, href, as, query, a11y = '뒤로가기', toggleEditingMode }) => (
  <LNBBar
    renderFlexLeft={() => <Title title={title} totalCount={totalCount} href={href} as={as} query={query} a11y={a11y} />}
    renderFlexRight={() => <Tool edit toggleEditingMode={toggleEditingMode} />}
  />
);

export default TitleBar;
