/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import React from 'react';
import { ACTION_BAR_HEIGHT } from './ActionBar/styles';

const fixed = css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 9999;

  & + section {
    padding-top: 46px;
  }
`;

const double = css`
  & + section {
    padding-top: 92px;
  }
`;

const container = css`
  position: relative;
`;

const actionBarPadding = css`
  height: ${ACTION_BAR_HEIGHT}px;
`;

const styles = {
  fixed,
  double,
  container,
  actionBarPadding,
};

export default class FixedToolbarView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFixed: false,
    };

    this.navRef = React.createRef();
    this.sectionRef = React.createRef();
  }

  componentDidMount() {
    this.detectScroll();
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    this.detectScroll();
  };

  detectScroll() {
    const { isFixed } = this.state;
    const { allowFixed = false } = this.props;

    if (!allowFixed) {
      return;
    }

    if (this.navRef.current === null || this.sectionRef.current === null) {
      return;
    }

    const currentScroll = window.scrollY;
    const offsetTop = isFixed ? this.sectionRef.current.offsetTop : this.navRef.current.offsetTop;
    const newIsFixed = currentScroll >= offsetTop;
    if (isFixed === newIsFixed) {
      return;
    }

    this.setState({ isFixed: newIsFixed });
  }

  render() {
    const { isFixed } = this.state;
    const { children, doubleToolbar, toolbar, actionBar } = this.props;

    return (
      <>
        <nav ref={this.navRef} css={[isFixed && styles.fixed, isFixed && doubleToolbar && styles.double]}>
          {toolbar}
        </nav>
        <section css={styles.container} ref={this.sectionRef}>
          {children}
        </section>
        {actionBar != null && <div css={styles.actionBarPadding} />}
        {actionBar}
      </>
    );
  }
}
