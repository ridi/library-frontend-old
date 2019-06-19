/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { connect } from 'react-redux';
import * as toastActions from '../../services/toast/actions';
import { ToastStyle } from '../../services/toast/constants';
import Close from '../../svgs/Close.svg';
import { disableScroll, enableScroll } from '../../utils/scroll';
import IconButton from '../IconButton';
import * as styles from './styles';

class Prompt extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      promptInput: this.props.initialValue || '',
    };
  }

  componentDidMount() {
    disableScroll();
  }

  componentWillUnmount() {
    enableScroll();
  }

  submitPrompt = e => {
    e.preventDefault();
    const { emptyInputAlertMessage, onClickCloseButton, onClickConfirmButton, dispatchShowToast } = this.props;
    const trimmedInputValue = this.state.promptInput.trim();
    if (trimmedInputValue.length === 0) {
      dispatchShowToast({
        message: emptyInputAlertMessage || '한 글자 이상 입력해주세요.',
        toastStyle: ToastStyle.BLUE,
      });
    } else {
      onClickCloseButton();
      onClickConfirmButton(trimmedInputValue);
    }
  };

  handleChange = e => {
    this.setState({
      promptInput: e.target.value,
    });
  };

  render() {
    const { onClickCloseButton, title, message, confirmLabel, placeHolder } = this.props;
    const { promptInput: inputValue } = this.state;
    return (
      <form css={styles.promptWrapper} onSubmit={this.submitPrompt}>
        <div css={styles.prompt}>
          <div css={styles.promptHeader}>
            <h1 css={styles.promptTitle}>{title}</h1>
            <IconButton a11y="닫기버튼" css={styles.promptCloseButton} onClick={onClickCloseButton}>
              <Close />
            </IconButton>
          </div>
          <div css={styles.promptContent}>
            <p>{message}</p>
            <input
              css={styles.promptInput}
              type="text"
              placeholder={placeHolder}
              onChange={this.handleChange}
              autoComplete="off"
              value={inputValue}
              autoFocus
            />
          </div>
          <div css={styles.promptFooter}>
            <button type="submit" css={styles.promptButton}>
              {confirmLabel || '확인'}
            </button>
            <div css={styles.clear} />
          </div>
        </div>
      </form>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  dispatchShowToast: toastActions.showToast,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Prompt);
