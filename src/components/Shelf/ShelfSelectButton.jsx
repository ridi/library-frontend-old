/** @jsx jsx */
import { jsx } from '@emotion/core';
import { connect } from 'react-redux';
import { toggleItem } from '../../services/selection/actions';
import { getIsItemSelected } from '../../services/selection/selectors';
import CheckCircle from '../../svgs/CheckCircle.svg';
import { shelfStyles } from './styles';

const mapStateToProps = (state, props) => ({
  isSelected: getIsItemSelected(state, props.uuid),
});

const mapDispatchToProps = {
  onSelectedChange: toggleItem,
};

export const ShelfSelectButton = connect(
  mapStateToProps,
  mapDispatchToProps,
)(props => {
  const { uuid, isActive, isSelected, onSelectedChange } = props;
  const id = `shelf-checkbox-${uuid}`;
  const toggleSelect = () => {
    onSelectedChange(uuid);
  };
  return isActive ? (
    <div css={shelfStyles.selectWrapper}>
      <label css={shelfStyles.selectLabel} htmlFor={id}>
        <input id={id} type="checkbox" checked={isSelected} onChange={toggleSelect} />
        <span css={shelfStyles.selectIconWrapper}>
          <CheckCircle className={isSelected ? 'active' : ''} css={shelfStyles.selectIcon} />
        </span>
        <span className="a11y">책장 선택</span>
      </label>
    </div>
  ) : null;
});
