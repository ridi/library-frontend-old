const focusFreeClass = 'focus-free';

export function registerTabKeyUpEvent(element) {
  const keyupHandler = event => {
    const code = event.keyCode || event.which;
    if (Number(code) === 9) {
      element.classList.remove(focusFreeClass);
    }
  };

  window.addEventListener('keyup', keyupHandler);
  return () => window.removeEventListener('keyup', keyupHandler);
}

export function registerMouseDownEvent(element) {
  const mouseDownHandler = () => {
    element.classList.add(focusFreeClass);
  };

  window.addEventListener('mousedown', mouseDownHandler);
  return () => window.removeEventListener('mousedown', mouseDownHandler);
}

export function initializeTabKeyFocus() {
  const body = document.querySelector('body');
  if (!body) {
    return;
  }
  body.classList.add(focusFreeClass);
}
