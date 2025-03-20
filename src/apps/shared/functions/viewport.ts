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

//
export const smartPosition = (componentRef, hOffset=0, vOffset=0) => {
  const height = componentRef.value.getBoundingClientRect().height;
  const width = componentRef.value.getBoundingClientRect().width;
  const xScale = Math.sign(window.innerWidth - (Math.max(hOffset, 0) + width));
  const yScale = Math.sign(window.innerHeight - (Math.max(vOffset, 0) + height));
  return { left: hOffset + (xScale * width), top: vOffset + (yScale * height) }
};
