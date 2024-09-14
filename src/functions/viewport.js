//
export const heightRestOfViewport = (componentRef) => {
  const containerTop = componentRef.value.getBoundingClientRect().top;
  const availableHeight = window.innerHeight - containerTop;
  return availableHeight;
};
