//
export const fillHeight = (componentRef, bottomDelta=0) => {
  const containerTop = componentRef.value.getBoundingClientRect().top;
  const availableHeight = window.innerHeight - (containerTop + bottomDelta);
  return availableHeight;
};

//
export const fillWidth = (componentRef, rightDelta=0) => {
  const containerLeft = componentRef.value.getBoundingClientRect().left;
  const availableWidth = window.innerWidth - (containerLeft + rightDelta);
  return availableWidth;
};
