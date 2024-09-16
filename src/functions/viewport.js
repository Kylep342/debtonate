//
export const heightRestOfViewport = (componentRef) => {
  const containerTop = componentRef.value.getBoundingClientRect().top;
  const availableHeight = window.innerHeight - containerTop;
  return availableHeight;
};

//
export const widthRestOfViewport = (componentRef) => {
  const containerLeft = componentRef.value.getBoundingClientRect().left;
  const availableWidth = window.innerWidth - containerLeft;
  return availableWidth;
};
