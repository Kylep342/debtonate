<template>
  <div class="formItem">
    <slot name="formLabel"></slot>
    <slot name="formInput"></slot>
  </div>
</template>

<style scoped>
.formItem {
  display: flex;
}
</style>
