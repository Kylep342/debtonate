<template>
  <button :class='[mode, "btn btn-accent btn-outline"]'>
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: ['mode'],
};
</script>
