import React from 'react';
import { connect } from 'react-redux';

import { TabBar, TabItem } from './Tabbar';

class LibraryTabbar extends React.Component {
  onClickAllBooks() {
    console.log('onClickAllBooks');
  }

  render() {
    return (
      <TabBar>
        <TabItem title="모든 책" isActive onClick={this.onClickAllBooks} />
      </TabBar>
    );
  }
}

const mapStateToProps = state => {};
const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LibraryTabbar);
