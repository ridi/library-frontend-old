/** @jsx jsx */
import { jsx } from '@emotion/core';
import classname from 'classnames';
import React from 'react';
import { connect } from 'react-redux';
import * as toastActions from '../../services/toast/actions';
import { ToastStyle } from '../../services/toast/constants';
import Close from '../../svgs/Close.svg';
import Exclamation from '../../svgs/ExclamationCircleFill.svg';
import { disableScroll, enableScroll } from '../../utils/scroll';
import IconButton from '../IconButton';
import * as styles from './styles';

class Prompt extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      promptInput: this.props.initialValue || '',
      isInputLimitOver: false,
      isFocused: false,
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
    const { value: inputValue } = e.target;
    const { limit } = this.props;
    if (limit && inputValue.length > limit) {
      this.setState({
        isInputLimitOver: true,
      });
    } else {
      this.setState({
        isInputLimitOver: false,
        promptInput: inputValue,
      });
    }
  };

  handleFocus = () => {
    this.setState({ isFocused: true });
  };

  handleBlur = () => {
    this.setState({ isFocused: false });
  };

  render() {
    const { onClickCloseButton, title, message, confirmLabel, placeHolder, limit } = this.props;
    const { promptInput: inputValue, isInputLimitOver, isFocused } = this.state;
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
            <div css={styles.promptInputWrapper} className={classname(isFocused && 'focus', isInputLimitOver && 'invalid')}>
              <input
                css={styles.promptInput}
                type="text"
                placeholder={placeHolder}
                onChange={this.handleChange}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                autoComplete="off"
                value={inputValue}
                autoFocus
              />
              {isInputLimitOver && <Exclamation css={styles.invalidIcon} />}
            </div>
            {isInputLimitOver && <p css={styles.invalidInfo}>최대 {limit}자까지 작성가능합니다.</p>}
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
