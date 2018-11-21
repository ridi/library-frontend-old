import React from 'react';
import { connect } from 'react-redux';
import Responsive from '../../pages/base/Responsive';

const EditingBar = ({ totalSelectedCount, onClickSuccessButton }) => (
  <div>
    <Responsive>
      <span>{totalSelectedCount}권 선택</span>
      <button type="button" onClick={onClickSuccessButton}>
        완료
      </button>
    </Responsive>
  </div>
);

const mapStateToProps = state => ({
  totalSelectedCount: 0,
});

export default connect(mapStateToProps)(EditingBar);
