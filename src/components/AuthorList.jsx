import React from 'react';

class AuthorList extends React.Component {
  makeAuthors() {
    const { authors } = this.props;
    return authors.map(value => value).join(' | ');
  }

  render() {
    return <div>{this.makeAuthors()}</div>;
  }
}

export default AuthorList;
