/** @jsx jsx */
import { jsx } from '@emotion/core';
import PlusIcon from '../../svgs/Plus.svg';
import IconButton from '../IconButton';
import { Tooltip } from '../Tooltip';
import * as styles from './styles';

export const Add = props => {
  const { onClickAddButton } = props;
  return (
    <div css={styles.buttonWrapper}>
      <IconButton a11y="책장 추가" css={styles.iconButton()} onClick={onClickAddButton}>
        <div css={styles.iconWrapper}>
          <PlusIcon />
        </div>
      </IconButton>
      <Tooltip name="SHELVES_TOOLTIP" expires={new Date(2019, 8, 20)}>
        책장을 만들어 원하는 책을 담아보세요!
      </Tooltip>
    </div>
  );
};
