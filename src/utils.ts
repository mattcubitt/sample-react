export const getIsScrollbarVisible = () => {
  return (
    window.innerHeight <= document.body.clientHeight &&
    document.body.clientHeight !== 0
  );
};

export const getIsScrollbarAtBottom = () => {
  return window.innerHeight + window.scrollY >= document.body.offsetHeight;
};
