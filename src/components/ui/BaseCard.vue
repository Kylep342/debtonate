<template>
  <div>
    <slot></slot>
  </div>
</template>

<style scoped>
div {
  animation: populate 0.5s ease-out normal backwards;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  flex: 1;
  height: 100px;
  justify-content: left;
  margin: 0.5em;
  min-width: 100px;
  text-align: left;
  transition: all 0.25s ease;
  /* font-size: 1.5em; */
}
</style>
