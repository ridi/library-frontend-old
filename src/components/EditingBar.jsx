import React from 'react';
import { connect } from 'react-redux';

const EditingBar = ({ totalSelectedCount, onClickSuccessButton }) => (
  <div>
    <span>{totalSelectedCount}권 선택</span>
    <button type="button" onClick={onClickSuccessButton}>
      완료
    </button>
  </div>
);

const mapStateToProps = state => ({
  totalSelectedCount: 0,
});

export default connect(mapStateToProps)(EditingBar);
