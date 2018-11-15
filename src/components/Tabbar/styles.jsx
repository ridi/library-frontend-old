import { css } from 'emotion';

const TabBar = css`
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 30px;
`;
const TabItemWrapper = css`
  float: left;
  margin: 0 5px;
  padding: 0 5px;

  height: 100%;
`;

const TabItem = css`
  color: gray;
  font-size: 14px;

  border: 0;
  height: 100%;
`;

const TabItemActive = css`
  color: black;
  font-weight: bolder;

  border-bottom: 3px solid black;
`;

export default {
  TabBar,
  TabItemWrapper,
  TabItem,
  TabItemActive,
};
