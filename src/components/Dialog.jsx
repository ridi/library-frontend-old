/** @jsx jsx */
import React from 'react';
import { connect } from 'react-redux';

import { jsx } from '@emotion/core';

class Dialog extends React.Component {
  render() {
    return (
      <div>
        <div>다이얼로그</div>
      </div>
    );
  }
}

const mapStateToProps = state => ({});
const ConnectedDialog = connect(mapStateToProps)(Dialog);

export default ConnectedDialog;
