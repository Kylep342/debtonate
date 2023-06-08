<template>
  <button :class="mode">
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: ['mode'],
}
</script>

<style scoped>
button {
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  font-family: inherit;
  background-color: #49c1a2;
  border: 1px solid #49c1a2;
  color: #ffffff;
  cursor: pointer;
}

button:hover,
button:active {
  background-color: #37a08e;
  border-color: #37a08e;
}

.flat {
  background-color: transparent;
  color: #49c1a2;
  border: none;
}

.flat:hover,
.flat:active {
  background-color: #37a08e;
}
</style>