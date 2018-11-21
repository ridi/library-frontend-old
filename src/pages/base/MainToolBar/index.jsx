import React from 'react';
import { connect } from 'react-redux';

import * as styles from './styles';

import Responsive from '../Responsive';
import IconButton from '../../../components/IconButton';
import SelectBox from '../../../components/SelectBox';

import ConnectedEditingBar from '../../../components/EditingBar';
import ConnectedSortModal from '../MainModal/SortModal';

import { getPageInfo, getFilterOptions } from '../../../services/purchased/main/selectors';
import { changePurchaseFilter } from '../../../services/purchased/main/actions';

class MainToolBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      isActiveSortModal: false,
    };
    this.toggleEditingMode = this.toggleEditingMode.bind(this);
    this.toggleSortModal = this.toggleSortModal.bind(this);
  }

  toggleEditingMode() {
    const { isEditing } = this.state;
    this.setState({ isEditing: !isEditing });
  }

  toggleSortModal() {
    const { isActiveSortModal } = this.state;
    this.setState({ isActiveSortModal: !isActiveSortModal });
  }

  renderModal() {
    const { isActiveSortModal } = this.state;

    return (
      <>
        <ConnectedSortModal isActive={isActiveSortModal} />
      </>
    );
  }

  renderToolBar() {
    const {
      pageInfo: { filter },
      filterOptions,
      changePurchaseFilter: dispatchChangePurchaseFilter,
    } = this.props;
    return (
      <div className={styles.MainToolBarWrapper}>
        <Responsive>
          <div className={styles.MainToolBarSearchBarWrapper} />
          <div className={styles.MainToolBarToolsWrapper}>
            <SelectBox selected={filter} options={filterOptions} onChange={value => dispatchChangePurchaseFilter(value)} />
            <IconButton icon="setting" a11y="편집" className={styles.MainToolBarIcon} onClick={this.toggleEditingMode} />
            <IconButton icon="check_1" a11y="정렬" className={styles.MainToolBarIcon} onClick={this.toggleSortModal} />
          </div>
        </Responsive>
      </div>
    );
  }

  render() {
    const { isEditing } = this.state;

    let toolbar = null;
    if (isEditing) {
      toolbar = <ConnectedEditingBar onClickSuccessButton={this.toggleEditingMode} />;
    } else {
      toolbar = this.renderToolBar();
    }

    return (
      <>
        {toolbar}
        {this.renderModal()}
      </>
    );
  }
}

const mapStateToProps = state => ({
  pageInfo: getPageInfo(state),
  filterOptions: getFilterOptions(state),
});
const mapDispatchToProps = {
  changePurchaseFilter,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MainToolBar);
