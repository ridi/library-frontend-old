/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/core';
import EditingBar from './EditingBar';
import BottomActionBar from './BottomActionBar';

const styles = {
  fixed: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 9999,

    '& + section': {
      paddingTop: 46,
    },
  },
};

export default class Editable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFixed: false,
    };

    this.navRef = null;
    this.sectionRef = null;
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

    if (this.navRef === null || this.sectionRef === null) {
      return;
    }

    const currentScroll = window.scrollY;
    const offsetTop = isFixed ? this.sectionRef.offsetTop : this.navRef.offsetTop;
    const newIsFixed = currentScroll >= offsetTop;
    if (isFixed === newIsFixed) {
      return;
    }

    this.setState({ isFixed: newIsFixed });
  }

  render() {
    const { isFixed } = this.state;
    const { children, nonEditBar, isEditing, editingBarProps, actionBarProps } = this.props;

    return (
      <>
        <nav
          ref={ref => {
            this.navRef = ref;
          }}
          css={isFixed ? styles.fixed : {}}
        >
          {isEditing ? <EditingBar {...editingBarProps} /> : nonEditBar}
        </nav>
        <section
          ref={ref => {
            this.sectionRef = ref;
          }}
        >
          {children}
        </section>
        {isEditing ? <BottomActionBar {...actionBarProps} /> : null}
      </>
    );
  }
}
