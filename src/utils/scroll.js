const disableScrollClass = 'disable-scroll';

export const enableScroll = () => {
  const body = document.querySelector('body');
  body.classList.remove(disableScrollClass);
};

export const disableScroll = () => {
  const body = document.querySelector('body');
  body.classList.add(disableScrollClass);
};
