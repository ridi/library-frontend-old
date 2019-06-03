/** @jsx jsx */
import { jsx } from '@emotion/core';
import { connect } from 'react-redux';
import { toggleItem } from '../../services/selection/actions';
import { getSelectedItems } from '../../services/selection/selectors';
import CheckCircle from '../../svgs/CheckCircle.svg';
import { shelfStyles } from './styles';

const mapStateToProps = state => ({
  selectedShelves: getSelectedItems(state),
});

const mapDispatchToProps = {
  onSelectedCahnge: toggleItem,
};

export const ShelfSelectButton = connect(
  mapStateToProps,
  mapDispatchToProps,
)(props => {
  const { uuid, isActive, selectedShelves, onSelectedCahnge } = props;
  const isSelected = !!selectedShelves[uuid];
  const id = `shelf-checkbox-${uuid}`;
  const toggleSelect = () => {
    onSelectedCahnge(uuid);
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
