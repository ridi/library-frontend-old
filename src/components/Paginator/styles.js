import { css } from 'emotion';

export const paginator = css`
  height: 30px;
  margin: 0;
  padding: 20px 0 0;
  line-height: 30px;
  text-align: center;
  white-space: nowrap;
`;

export const horizontalWrapper = css`
  display: -webkit-inline-box;
  display: -ms-inline-flexbox;
  display: inline-flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
`;

export const pageItem = css`
  display: inline-block;
  min-width: 42px;
  height: 32px;
  margin-left: -1px;
  padding: 0 10px;
  line-height: 30px;
`;

export const pageItemIcon = css`
  width: 6px;
  height: 9px;
  fill: #818a92;
`;

export const pageItemGroup = css`
  display: inline-block;
  margin: 0 6px;

  list-style-type: none;
  margin: 0;
  padding: 0;
`;

export const pageItemGroupMember = css`
  float: left;
`;

export const paginatorDots = css`
  display: inline-block;
  width: 8px;
  height: var(--Paging-height);
  padding: 0 3px;
`;

export const paginatorDeviderDots = css`
  width: 100%;
  vertical-align: middle;
  fill: #bfc4c8;
`;
