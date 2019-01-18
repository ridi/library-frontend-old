import React from 'react';

export default class Scrollable extends React.Component {
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    const { hasMore, isLoading, fetch, bottomOffset = 300 } = this.props;

    if (!hasMore || isLoading) {
      return;
    }

    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - bottomOffset) {
      window.requestAnimationFrame(fetch);
    }
  };

  render() {
    const { children, isLoading, showLoader, loader = <h3>...Loading</h3> } = this.props;
    return (
      <>
        {children}
        {isLoading && showLoader ? loader : null}
      </>
    );
  }
}
